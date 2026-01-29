const BASE_PATH = window.location.pathname.includes('/database-management/') ? '/database-management' : '';

const QUESTION_NODE_MAP = {
    db_chapter_01: [
        'db_001_data_vs_information',
        'db_002_database_definition',
        'db_003_dbms_roles',
        'db_004_advantages_challenges',
        'db_003_dbms_roles',
        'db_004_advantages_challenges',
        'db_004_advantages_challenges',
        'db_002_database_definition',
        'db_004_advantages_challenges',
        'db_010_tables_relations'
    ],
    db_chapter_02: [
        'db_011a_primary_keys_focus',
        'db_012_integrity_rules',
        'db_012_integrity_rules',
        'db_013_relational_algebra',
        'db_010_tables_relations',
        'db_011_keys_overview',
        'db_013_relational_algebra',
        'db_011_keys_overview',
        'db_013_relational_algebra',
        'db_012_integrity_rules'
    ],
    db_chapter_03: [
        'db_020_sql_intro',
        'db_020_sql_intro',
        'db_021_sql_ddl',
        'db_022_sql_select_basics',
        'db_022_sql_select_basics',
        'db_023_sql_aggregates_groupby',
        'db_022_sql_select_basics',
        'db_022_sql_select_basics',
        'db_020_sql_intro',
        'db_022_sql_select_basics'
    ]
};

const MASTERY_SUCCESS_THRESHOLD = 0.8;
const MASTERY_REMEDIATE_THRESHOLD = 0.5;

class AdaptiveQuiz {
    constructor() {
        this.studentId = this.getOrCreateStudentId();
        this.responses = [];
        this.currentChapter = this.getCurrentChapter();
        this.apiEndpoint = '/api/learning-agent';
        this.questionStartTimes = {};
        this.studentProfile = this.getStoredProfile();
        this.graphPromise = this.loadKnowledgeGraph();
        this.questionResults = {};
        this.correctCount = 0;
        this.incorrectCount = 0;
        this.totalQuestions = 0;
        this.courseModuleAgent = null;
        this.modulePanel = null;
        this.init();
    }

    init() {
        this.convertQuizzes();
        this.setupCourseModuleAgent();
        this.loadRemoteStudentProfile();
    }

    getStoredProfile() {
        const raw = localStorage.getItem('student_profile');
        if (!raw) return this.createEmptyProfile();
        try {
            const parsed = JSON.parse(raw);
            return this.ensureProfileShape(parsed);
        } catch (error) {
            console.warn('Invalid stored profile, resetting', error);
            return this.createEmptyProfile();
        }
    }

    createEmptyProfile() {
        return {
            mastery: {},
            recommendations: {},
            recommendations_detail: {},
            summary: '',
            learned: {}
        };
    }

    ensureProfileShape(profile) {
        if (!profile.mastery) profile.mastery = {};
        if (!profile.recommendations) profile.recommendations = {};
        if (!profile.recommendations_detail) profile.recommendations_detail = {};
        if (typeof profile.summary !== 'string') profile.summary = '';
        if (!profile.learned) profile.learned = {};
        return profile;
    }

    getOrCreateStudentId() {
        let studentId = localStorage.getItem('adaptive_student_id');
        if (!studentId) {
            studentId = 'student_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('adaptive_student_id', studentId);
        }
        return studentId;
    }

    getCurrentChapter() {
        const path = window.location.pathname;
        if (path.includes('01-database-environment')) return 'db_chapter_01';
        if (path.includes('02-tables-relational-algebra')) return 'db_chapter_02';
        if (path.includes('03-sql-fundamentals')) return 'db_chapter_03';
        return 'unknown_chapter';
    }

    convertQuizzes() {
        const questions = Array.from(document.querySelectorAll('.upper-alpha'))
            .filter(div => this.isChapterQuizQuestion(div));

        this.totalQuestions = questions.length;
        this.questionResults = {};
        this.correctCount = 0;
        this.incorrectCount = 0;

        questions.forEach((questionDiv, index) => {
            const questionId = `${this.currentChapter}_q${index + 1}`;
            this.questionStartTimes[questionId] = Date.now();
            this.makeQuestionInteractive(questionDiv, index + 1);
        });
    }

    setupCourseModuleAgent() {
        const container = this.ensureModuleContainer();
        if (!container || typeof CourseModuleAgent === 'undefined') {
            return;
        }
        this.courseModuleAgent = new CourseModuleAgent({
            container,
            getProfile: () => this.studentProfile || this.createEmptyProfile(),
            saveProfile: profile => this.updateLocalProfile(profile, { skipModuleSync: true }),
            onAllModulesComplete: () => {
                this.handleModuleStateChange();
            },
            onStateChange: () => this.handleModuleStateChange()
        });
        if (this.studentProfile) {
            this.courseModuleAgent.loadFromProfile(this.studentProfile);
        }
    }

    ensureModuleContainer() {
        if (this.modulePanel) return this.modulePanel;
        const quizHeading = document.getElementById('chapter-quiz');
        if (!quizHeading) return null;
        const panel = document.createElement('section');
        panel.className = 'course-module-agent-panel';
        quizHeading.insertAdjacentElement('afterend', panel);
        this.modulePanel = panel;
        return panel;
    }

    handleModuleStateChange() {
        if (!this.studentProfile) {
            this.studentProfile = this.createEmptyProfile();
        }
        const currentState = this.courseModuleAgent?.state || { pending: [], completed: [] };
        this.studentProfile.course_modules = currentState;
        this.applyRemediationGate(this.studentProfile);
        this.updateLocalProfile(this.studentProfile, { skipModuleSync: true });
    }

    isChapterQuizQuestion(questionDiv) {
        let cursor = questionDiv.previousElementSibling;
        while (cursor) {
            if (/^H[1-6]$/.test(cursor.tagName)) {
                if (cursor.id === 'chapter-quiz') {
                    return true;
                }
                if (cursor.tagName === 'H2' && cursor.id !== 'chapter-quiz') {
                    return false;
                }
            }
            cursor = cursor.previousElementSibling;
        }
        return false;
    }

    makeQuestionInteractive(questionDiv, questionNumber) {
        const options = this.normalizeOptionElements(questionDiv);
        if (!options.length) {
            return;
        }

        const questionId = `${this.currentChapter}_q${questionNumber}`;
        questionDiv.setAttribute('id', questionId);
        questionDiv.setAttribute('data-question-id', questionId);
        const answerDetails = this.extractAnswerDetails(questionDiv);
        if (answerDetails.letter) {
            questionDiv.setAttribute('data-correct-option', answerDetails.letter);
        }
        if (answerDetails.explanation) {
            questionDiv.setAttribute('data-answer-explanation', answerDetails.explanation);
        }
        const prompt = this.getQuestionPrompt(questionDiv, questionNumber);
        questionDiv.setAttribute('data-question-prompt', prompt);

        const nodeId = this.getNodeIdForQuestion(this.currentChapter, questionNumber);
        if (nodeId) {
            questionDiv.setAttribute('data-node-id', nodeId);
        }

        options.forEach((option, optionIndex) => {
            const letter = String.fromCharCode(65 + optionIndex);

            option.classList.add('quiz-option');
            option.setAttribute('data-option', letter);
            option.setAttribute('data-question-id', questionId);

            option.addEventListener('click', () => {
                this.handleOptionClick(questionId, letter, option, questionDiv);
            });

            option.addEventListener('mouseenter', () => {
                if (!option.classList.contains('selected')) {
                    option.classList.add('quiz-option--hover');
                }
            });

            option.addEventListener('mouseleave', () => {
                option.classList.remove('quiz-option--hover');
            });
        });
    }

    getNodeIdForQuestion(chapterId, questionNumber) {
        const chapterMap = QUESTION_NODE_MAP[chapterId];
        if (!chapterMap) return null;
        return chapterMap[questionNumber - 1] || null;
    }

    normalizeOptionElements(questionDiv) {
        const list = questionDiv.querySelector('ul, ol');
        const existingOptions = list ? Array.from(list.children) : Array.from(questionDiv.querySelectorAll('li, p'));
        if (existingOptions.length > 1) {
            existingOptions.forEach(option => {
                option.textContent = option.textContent.trim().replace(/^[A-Z]\.?\s+/, '').replace(/^\d+\.?\s+/, '');
            });
            return existingOptions;
        }

        const sourceElement = existingOptions[0];
        const rawText = sourceElement ? sourceElement.innerText : questionDiv.innerText;
        const lines = rawText
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean);

        if (sourceElement) {
            sourceElement.remove();
        } else {
            questionDiv.textContent = '';
        }

        const ul = document.createElement('ul');
        const newOptions = [];
        lines.forEach(line => {
            const text = line.replace(/^[A-Z]\.?\s+/, '').replace(/^\d+\.?\s+/, '').trim();
            if (!text) {
                return;
            }
            const li = document.createElement('li');
            li.textContent = text;
            ul.appendChild(li);
            newOptions.push(li);
        });
        questionDiv.appendChild(ul);

        return newOptions;
    }

    extractAnswerDetails(questionDiv) {
        const answerRegex = /correct answer is[^A-Z]*([A-Z])/i;
        let sibling = questionDiv.nextElementSibling;
        let hops = 0;
        while (sibling && hops < 4) {
            const text = sibling.textContent || '';
            const match = text.match(answerRegex);
            if (match) {
                return {
                    letter: match[1].toUpperCase(),
                    explanation: text.trim()
                };
            }
            sibling = sibling.nextElementSibling;
            hops += 1;
        }
        return { letter: null, explanation: '' };
    }

    getQuestionPrompt(questionDiv, questionNumber) {
        const heading = questionDiv.previousElementSibling;
        if (heading && /^H[1-6]$/.test(heading.tagName)) {
            return heading.innerText.trim();
        }
        return `Question ${questionNumber}`;
    }

    getAnswerText(questionDiv, letter) {
        const option = questionDiv.querySelector(`[data-option="${letter}"]`);
        if (!option) {
            const list = questionDiv.querySelector('li');
            return list ? list.textContent.trim() : '';
        }
        return option.textContent.trim();
    }

    cloneDeep(obj) {
        return obj ? JSON.parse(JSON.stringify(obj)) : obj;
    }

    trackQuestionResult(questionId, result) {
        const previous = this.questionResults[questionId];
        if (previous) {
            if (previous.isCorrect) {
                this.correctCount = Math.max(0, this.correctCount - 1);
            } else {
                this.incorrectCount = Math.max(0, this.incorrectCount - 1);
            }
        }
        this.questionResults[questionId] = result;
        if (result.isCorrect) {
            this.correctCount += 1;
        } else {
            this.incorrectCount += 1;
        }
    }

    maybeTriggerRemediation() {
        if (!this.courseModuleAgent || !this.totalQuestions) return;
        const answered = Object.keys(this.questionResults).length;
        if (answered < this.totalQuestions) return;

        if (this.incorrectCount <= this.correctCount || this.incorrectCount === 0) {
            this.courseModuleAgent.clearModules();
            return;
        }

        this.graphPromise.then(graph => {
            if (!graph) return;
            const modules = this.buildRemediationModules(graph);
            if (!modules.length) return;
            this.courseModuleAgent.queueModules(modules, graph);
            this.studentProfile.course_modules = this.courseModuleAgent.state;
            const firstPending = this.courseModuleAgent.state.pending[0];
            if (firstPending) {
                this.studentProfile.recommendations = this.studentProfile.recommendations || {};
                this.studentProfile.recommendations.next_focus = [];
                this.studentProfile.summary = `Complete "${firstPending.title}" before progressing to the next concept.`;
            }
            this.updateLocalProfile(this.studentProfile);
        });
    }

    buildRemediationModules(graph) {
        const grouped = {};
        const chapterTitle = this.getCurrentChapterTitle();
        Object.values(this.questionResults).forEach(result => {
            if (result.isCorrect || !result.nodeId) return;
            if (!grouped[result.nodeId]) grouped[result.nodeId] = [];
            grouped[result.nodeId].push({
                question_id: result.questionId,
                prompt: result.prompt,
                correct_answer: result.correct_answer,
                explanation: result.explanation
            });
        });

        return Object.entries(grouped).map(([nodeId, reviewItems]) => {
            const node = graph.nodeById[nodeId] || {};
            return {
                node_id: nodeId,
                title: node.title || reviewItems[0]?.prompt || 'Concept Review',
                summary: node.core_content || 'Review this concept and retry the quiz.',
                link: this.getNodeDocLink(node),
                review_items: reviewItems,
                chapter_id: this.currentChapter,
                chapter_title: chapterTitle
            };
        });
    }

    getNodeDocLink(node) {
        if (!node?.page_index?.path) return null;
        const cleanPath = node.page_index.path.replace(/^docs\//, '').replace(/\.md$/, '/');
        const anchor = node.page_index.section_anchor || '';
        const normalizedAnchor = anchor ? (anchor.startsWith('#') ? anchor : `#${anchor}`) : '';
        return `${BASE_PATH}/${cleanPath}${normalizedAnchor}`;
    }

    getCurrentChapterTitle() {
        const heading = document.querySelector('article h1, main h1');
        if (heading) {
            return heading.innerText.trim();
        }
        return 'Current Chapter';
    }

    async handleOptionClick(questionId, selectedOption, optionElement, questionDiv) {
        const allOptions = questionDiv.querySelectorAll('.quiz-option');
        allOptions.forEach(opt => {
            opt.classList.remove('selected', 'quiz-option--correct', 'quiz-option--incorrect', 'quiz-option--hover');
        });

        optionElement.classList.add('selected');

        const correctLetter = questionDiv.getAttribute('data-correct-option');
        const isCorrect = correctLetter ? selectedOption === correctLetter : false;

        if (isCorrect) {
            optionElement.classList.add('quiz-option--correct');
        } else {
            optionElement.classList.add('quiz-option--incorrect');
            if (correctLetter) {
                const correctOptionElement = questionDiv.querySelector(`[data-option="${correctLetter}"]`);
                if (correctOptionElement) {
                    correctOptionElement.classList.add('quiz-option--correct');
                }
            }
        }

        const response = {
            questionId,
            selectedOption,
            timestamp: new Date().toISOString(),
            timeSpent: this.calculateTimeSpent(questionId),
            chapter: this.currentChapter
        };

        this.responses.push(response);

        const nodeId = questionDiv.getAttribute('data-node-id');
        const prompt = questionDiv.getAttribute('data-question-prompt') || `Question`;
        const explanation = questionDiv.getAttribute('data-answer-explanation') || '';
        const correctAnswerText = correctLetter ? this.getAnswerText(questionDiv, correctLetter) : '';
        this.trackQuestionResult(questionId, {
            questionId,
            nodeId,
            isCorrect,
            prompt,
            correct_answer: correctAnswerText,
            correct_letter: correctLetter,
            explanation
        });
        if (isCorrect) {
            this.courseModuleAgent?.resolveQuestion(questionId);
        }
        this.updateMastery(nodeId, isCorrect);

        await this.sendToLearningAgent(response);
        this.showImmediateFeedback(questionId, selectedOption, optionElement);
        this.maybeTriggerRemediation();
    }

    updateMastery(nodeId, isCorrect) {
        const profile = this.ensureProfileShape(this.studentProfile || this.createEmptyProfile());
        if (nodeId) {
            if (!profile.mastery[nodeId]) {
                profile.mastery[nodeId] = { attempts: 0, correct: 0, score: 0 };
            }
            const stats = profile.mastery[nodeId];
            stats.attempts += 1;
            if (isCorrect) {
                stats.correct += 1;
            }
            stats.score = stats.attempts ? stats.correct / stats.attempts : 0;
            stats.last_result = isCorrect ? 'correct' : 'incorrect';
            stats.updated_at = new Date().toISOString();
        }

        this.studentProfile = profile;
        this.updateLocalProfile(profile);
        this.computeRecommendations(nodeId, isCorrect);
    }

    calculateTimeSpent(questionId) {
        const now = Date.now();
        const lastTime = this.questionStartTimes?.[questionId] || now;
        return now - lastTime;
    }

    async loadKnowledgeGraph() {
        try {
            const response = await fetch(`${BASE_PATH}/curriculum/knowledge_graph.json`);
            if (!response.ok) throw new Error('Failed to load knowledge graph');
            const data = await response.json();
            const nodeById = {};
            const dependents = {};
            data.nodes.forEach(node => {
                nodeById[node.node_id] = node;
                (node.prerequisites || []).forEach(pr => {
                    if (!dependents[pr]) dependents[pr] = [];
                    dependents[pr].push(node.node_id);
                });
            });
            return { nodes: data.nodes, nodeById, dependents };
        } catch (error) {
            console.warn('Unable to load knowledge graph', error);
            return null;
        }
    }

    async computeRecommendations(latestNodeId, isCorrect) {
        try {
            const graph = await this.graphPromise;
            if (!graph) return;

            const profile = this.ensureProfileShape(this.studentProfile || this.createEmptyProfile());
            const mastery = profile.mastery || {};

            const focusCandidates = [];
            if (latestNodeId && isCorrect && graph.dependents[latestNodeId]) {
                focusCandidates.push(...graph.dependents[latestNodeId]);
            }
            if (latestNodeId && !isCorrect) {
                const prereqs = graph.nodeById[latestNodeId]?.prerequisites || [];
                focusCandidates.push(...prereqs);
                const refreshers = graph.nodeById[latestNodeId]?.prerequisite_refreshers || [];
                refreshers.forEach(ref => focusCandidates.push(ref.refresher_node));
            }

            const unlocked = graph.nodes
                .filter(node => {
                    const score = mastery[node.node_id]?.score || 0;
                    if (score >= MASTERY_SUCCESS_THRESHOLD) return false;
                    return (node.prerequisites || []).every(pr => (mastery[pr]?.score || 0) >= MASTERY_SUCCESS_THRESHOLD);
                })
                .map(node => node.node_id);

            const remediation = Object.entries(mastery)
                .filter(([, stats]) => stats.score < MASTERY_REMEDIATE_THRESHOLD && stats.attempts >= 2)
                .map(([nodeId]) => nodeId);

            profile.recommendations = {
                next_focus: this.dedupe(focusCandidates),
                unlocked,
                remediation
            };

            profile.recommendations_detail = {
                next_focus: this.describeNodes(graph, profile.recommendations.next_focus, isCorrect ? 'Build on recent success' : 'Focus after challenge'),
                unlocked: this.describeNodes(graph, unlocked, 'Ready to unlock'),
                remediation: this.describeNodes(graph, remediation, 'Needs reinforcement')
            };

            profile.summary = this.buildSummary(profile.recommendations_detail);

            this.applyRemediationGate(profile);

            this.updateLocalProfile(profile);
        } catch (error) {
            console.warn('Failed to compute recommendations', error);
        }
    }

    dedupe(list) {
        return [...new Set(list.filter(Boolean))];
    }

    describeNodes(graph, ids, reason) {
        if (!ids || !ids.length) return [];
        return ids.map(id => ({
            node_id: id,
            title: graph.nodeById[id]?.title || id,
            reason
        }));
    }

    buildSummary(details) {
        const next = details.next_focus?.[0];
        const remediation = details.remediation?.[0];
        const unlockedCount = details.unlocked?.length || 0;
        const sentences = [];
        if (next) {
            sentences.push(`Next up: ${next.title}.`);
        }
        if (remediation) {
            sentences.push(`Review recommended: ${remediation.title}.`);
        }
        if (unlockedCount) {
            sentences.push(`${unlockedCount} new concept${unlockedCount > 1 ? 's are' : ' is'} unlocked based on your mastery.`);
        }
        return sentences.join(' ') || 'Complete a quiz to unlock personalized guidance.';
    }

    applyRemediationGate(profile) {
        const pendingModules = (profile.course_modules?.pending && profile.course_modules.pending.length
            ? profile.course_modules.pending
            : (this.courseModuleAgent?.state?.pending || []));
        if (pendingModules.length) {
            const currentRecommendations = this.cloneDeep(profile.recommendations || {});
            const currentDetails = this.cloneDeep(profile.recommendations_detail || {});
            const currentSummary = profile.summary || '';
            if (!profile.remediation_gate || !profile.remediation_gate.active) {
                profile.remediation_gate = {
                    active: true,
                    chapter_id: pendingModules[0].chapter_id || this.currentChapter,
                    chapter_title: pendingModules[0].chapter_title || this.getCurrentChapterTitle(),
                    fallback_recommendations: currentRecommendations,
                    fallback_details: currentDetails,
                    fallback_summary: currentSummary
                };
            } else {
                profile.remediation_gate.fallback_recommendations = currentRecommendations;
                profile.remediation_gate.fallback_details = currentDetails;
                profile.remediation_gate.fallback_summary = currentSummary || profile.remediation_gate.fallback_summary;
            }
            const remediationNodeId = `remediation_${profile.remediation_gate.chapter_id}`;
            profile.recommendations = { ...currentRecommendations, next_focus: [remediationNodeId] };
            profile.recommendations_detail = { ...currentDetails, next_focus: [{
                node_id: remediationNodeId,
                title: `${profile.remediation_gate.chapter_title || 'Remediation Module'}`,
                reason: 'Complete personalized module before advancing'
            }] };
            profile.summary = `Complete the ${profile.remediation_gate.chapter_title || 'chapter'} remediation module to unlock the next chapter.`;
        } else if (profile.remediation_gate?.active) {
            profile.recommendations = this.cloneDeep(profile.remediation_gate.fallback_recommendations || {});
            profile.recommendations_detail = this.cloneDeep(profile.remediation_gate.fallback_details || profile.recommendations_detail);
            profile.summary = profile.remediation_gate.fallback_summary || (profile.recommendations_detail ? this.buildSummary(profile.recommendations_detail) : profile.summary);
            profile.remediation_gate.active = false;
        } else if (profile.recommendations_detail) {
            profile.summary = this.buildSummary(profile.recommendations_detail);
        }
    }

    async sendToLearningAgent(response) {
        try {
            const payload = {
                student_id: this.studentId,
                response: response,
                context: {
                    chapter: this.currentChapter,
                    all_responses: this.responses,
                    user_agent: navigator.userAgent,
                    viewport: {
                        width: window.innerWidth,
                        height: window.innerHeight
                    }
                }
            };

            const result = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Student-ID': this.studentId
                },
                body: JSON.stringify(payload)
            });

            if (result.ok) {
                const agentResponse = await result.json();

                if (agentResponse.adaptations) {
                    this.applyAdaptations(agentResponse.adaptations);
                }

                if (agentResponse.updated_profile) {
                    this.updateLocalProfile(agentResponse.updated_profile);
                }
            }

        } catch (error) {
            console.warn('Learning agent unavailable, storing responses locally:', error);
            this.storeResponseLocally(response);
        }
    }

    applyAdaptations(adaptations) {
        if (adaptations.show_hint) {
            this.showContextualHint(adaptations.show_hint);
        }

        if (adaptations.adjust_difficulty) {
            this.adjustQuizDifficulty(adaptations.adjust_difficulty);
        }

        if (adaptations.recommend_review) {
            this.suggestReview(adaptations.recommend_review);
        }
    }

    showContextualHint(hint) {
        const hintDiv = document.createElement('div');
        hintDiv.className = 'adaptive-hint';
        hintDiv.style.cssText = `
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
            font-style: italic;
        `;
        hintDiv.innerHTML = `💡 <strong>Personalized Hint:</strong> ${hint.message}`;

        const currentQuestion = document.querySelector(`[data-question-id="${hint.question_id}"]`);
        if (currentQuestion) {
            currentQuestion.parentElement.insertAdjacentElement('afterend', hintDiv);
            setTimeout(() => hintDiv.remove(), 10000);
        }
    }

    showImmediateFeedback(questionId, selectedOption, optionElement) {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'immediate-feedback';
        feedbackDiv.style.cssText = `
            background: #e8f5e8;
            border: 1px solid #4caf50;
            padding: 10px;
            margin: 5px 0;
            border-radius: 5px;
            font-size: 14px;
        `;
        feedbackDiv.innerHTML = `✓ Response recorded! Analyzing your learning pattern...`;

        optionElement.parentElement.insertAdjacentElement('afterend', feedbackDiv);
        setTimeout(() => feedbackDiv.remove(), 3000);
    }

    async loadRemoteStudentProfile() {
        try {
            const profileResponse = await fetch(`/api/student-profile/${this.studentId}`);
            if (profileResponse.ok) {
                this.studentProfile = this.ensureProfileShape(await profileResponse.json());
                this.applyProfileAdaptations();
                this.updateLocalProfile(this.studentProfile);
            }
        } catch (error) {
            console.log('No remote student profile found, relying on local data');
        }
    }

    applyProfileAdaptations() {
        if (this.studentProfile?.learned?.inferred_preferences?.pace === 'slow') {
            this.addPacingIndicators?.();
        }

        if (this.studentProfile?.learned?.what_works?.analogy_domains) {
            this.enhanceQuestionsWithAnalogies?.();
        }
    }

    storeResponseLocally(response) {
        const stored = JSON.parse(localStorage.getItem('quiz_responses') || '[]');
        stored.push(response);
        localStorage.setItem('quiz_responses', JSON.stringify(stored));
    }

    updateLocalProfile(profile, options = {}) {
        this.studentProfile = this.ensureProfileShape(profile);
        if (!options.skipGate) {
            this.applyRemediationGate(this.studentProfile);
        }
        localStorage.setItem('student_profile', JSON.stringify(this.studentProfile));
        if (!options.skipModuleSync && this.courseModuleAgent) {
            this.courseModuleAgent.loadFromProfile(this.studentProfile);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.upper-alpha')) {
        new AdaptiveQuiz();
    }
});

window.AdaptiveQuiz = AdaptiveQuiz;
