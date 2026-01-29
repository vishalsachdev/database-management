class CourseModuleAgent {
    constructor(options) {
        this.container = options.container;
        this.getProfile = options.getProfile;
        this.saveProfile = options.saveProfile;
        this.onAllModulesComplete = options.onAllModulesComplete;
        this.onStateChange = options.onStateChange;
        this.currentGraph = null;
        this.state = this.ensureStateShape(this.getProfile()?.course_modules);
        this.render();
    }

    ensureStateShape(rawState) {
        if (!rawState) {
            return { pending: [], completed: [], last_updated: null };
        }
        return {
            pending: Array.isArray(rawState.pending) ? rawState.pending : [],
            completed: Array.isArray(rawState.completed) ? rawState.completed : [],
            last_updated: rawState.last_updated || null
        };
    }

    async queueModules(modules, graph) {
        this.currentGraph = graph;
        const existingPendingIds = new Set(this.state.pending.map(mod => mod.node_id));

        modules.forEach(module => {
            module.review_items = (module.review_items || []).map(item => ({
                ...item,
                resolved: item.resolved || false
            }));
            if (existingPendingIds.has(module.node_id)) {
                // merge review items if module already exists
                const existing = this.state.pending.find(mod => mod.node_id === module.node_id);
                existing.chapter_id = existing.chapter_id || module.chapter_id;
                existing.chapter_title = existing.chapter_title || module.chapter_title;
                const existingPrompts = new Set((existing.review_items || []).map(item => item.question_id));
                module.review_items.forEach(item => {
                    if (!existingPrompts.has(item.question_id)) {
                        existing.review_items.push(item);
                    }
                });
            } else {
                this.state.pending.push(module);
            }
        });

        if (modules.length) {
            this.state.last_updated = new Date().toISOString();
            this.persist();
        }

        this.render();
        this.emitState();
    }

    markModuleComplete(nodeId) {
        const index = this.state.pending.findIndex(mod => mod.node_id === nodeId);
        if (index === -1) return;

        const [module] = this.state.pending.splice(index, 1);
        module.completed_at = new Date().toISOString();
        this.state.completed.unshift(module);
        this.state.completed = this.state.completed.slice(0, 10); // keep recent history concise
        this.state.last_updated = module.completed_at;
        this.persist();
        this.render();
        this.emitState();

        if (!this.state.pending.length && typeof this.onAllModulesComplete === 'function') {
            this.onAllModulesComplete(module);
        }
    }

    resolveQuestion(questionId) {
        let changed = false;
        this.state.pending.forEach(module => {
            module.review_items.forEach(item => {
                if (item.question_id === questionId && !item.resolved) {
                    item.resolved = true;
                    changed = true;
                }
            });
        });

        if (!changed) return;

        this.persist();
        const completedIds = this.state.pending
            .filter(module => module.review_items.every(item => item.resolved))
            .map(module => module.node_id);

        completedIds.forEach(id => this.markModuleComplete(id));
        this.render();
    }

    clearModules() {
        if (!this.state.pending.length) return;
        this.state.pending = [];
        this.persist();
        this.render();
        this.emitState();
    }

    persist() {
        const profile = this.getProfile();
        profile.course_modules = {
            pending: this.state.pending,
            completed: this.state.completed,
            last_updated: this.state.last_updated
        };
        this.saveProfile(profile);
    }

    loadFromProfile(profile) {
        this.state = this.ensureStateShape(profile?.course_modules);
        this.render();
    }

    emitState() {
        if (typeof this.onStateChange === 'function') {
            this.onStateChange(this.state);
        }
    }

    render() {
        if (!this.container) return;
        this.container.innerHTML = '';

        if (!this.state.pending.length) {
            this.container.style.display = 'none';
            return;
        }

        this.container.style.display = 'block';

        const header = document.createElement('div');
        header.className = 'module-agent-header';
        const activeModule = this.state.pending[0];
        const totalItems = activeModule.review_items.length;
        const resolvedItems = activeModule.review_items.filter(item => item.resolved).length;
        const stepsText = `Concept ${1} of ${this.state.pending.length}`;
        header.innerHTML = `
            <div>
                <h3>Personalized Catch-up Modules</h3>
                <p>Re-answer each highlighted question correctly to unlock the next lesson.</p>
            </div>
            <span class="module-agent-steps">${stepsText}</span>
        `;
        this.container.appendChild(header);

        if (!activeModule) {
            return;
        }

        const card = document.createElement('div');
        card.className = 'module-card';

        const listItems = (activeModule.review_items || []).map(item => `
            <li class="${item.resolved ? 'module-review--resolved' : ''}">
                <div>
                    <strong>${item.prompt}</strong>
                    <span class="module-review__status">${item.resolved ? 'Cleared' : 'Pending'}</span>
                </div>
                <p><em>Correct answer:</em> ${item.correct_answer}</p>
                <p>${item.explanation || 'Focus on the definition and example in the summary below.'}</p>
                <a href="#" class="module-review__link" data-question-ref="${item.question_id}">Go to question ↺</a>
            </li>
        `).join('');

        card.innerHTML = `
            <div class="module-card__badge">Module</div>
            <h4 class="module-card__title">${activeModule.title}</h4>
            <p class="module-card__summary">${activeModule.summary}</p>
            ${activeModule.link ? `<a class="module-card__link" href="${activeModule.link}" target="_blank">Open reference material ↗</a>` : ''}
            <div class="module-card__progress">${resolvedItems}/${totalItems} questions cleared</div>
            <div class="module-card__section">
                <h5>What to review</h5>
                <ul>${listItems}</ul>
            </div>
        `;

        this.container.appendChild(card);
        card.querySelectorAll('.module-review__link').forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                const targetId = link.getAttribute('data-question-ref');
                const target = document.querySelector(`[data-question-id="${targetId}"]`);
                target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });
    }

    hasPendingModules() {
        return this.state.pending.length > 0;
    }
}

window.CourseModuleAgent = CourseModuleAgent;
