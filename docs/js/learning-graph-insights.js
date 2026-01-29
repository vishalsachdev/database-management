function safeJsonParse(raw) {
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (error) {
        console.warn('Failed to parse stored JSON', error);
        return null;
    }
}

function formatPercent(value) {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        return '—';
    }
    return `${Math.round(value * 100)}%`;
}

function renderInsightCard({ title, value, body }) {
    const card = document.createElement('div');
    card.className = 'insight-card';

    const heading = document.createElement('div');
    heading.className = 'insight-card__title';
    heading.textContent = title;

    const valueEl = document.createElement('div');
    valueEl.className = 'insight-card__value';
    valueEl.textContent = value;

    card.appendChild(heading);
    card.appendChild(valueEl);

    if (body) {
        if (Array.isArray(body)) {
            const list = document.createElement('ul');
            list.className = 'insight-list';
            body.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                list.appendChild(li);
            });
            card.appendChild(list);
        } else if (body instanceof HTMLElement) {
            card.appendChild(body);
        } else {
            const paragraph = document.createElement('p');
            paragraph.textContent = body;
            card.appendChild(paragraph);
        }
    }

    return card;
}

function renderSummaryBlock(profile) {
    const summary = document.createElement('div');
    summary.className = 'learning-summary';
    const text = profile.summary || 'Complete a quiz to unlock personalized guidance.';
    summary.innerHTML = `<strong>Agent insight:</strong> ${text}`;
    return summary;
}

function renderRecommendationCard(title, entries, emptyCopy) {
    if (!entries || !entries.length) {
        return renderInsightCard({ title, value: '—', body: emptyCopy || 'No data yet.' });
    }
    return renderInsightCard({
        title,
        value: entries[0].title,
        body: entries.slice(0, 4).map(entry => `${entry.title}${entry.reason ? ` – ${entry.reason}` : ''}`)
    });
}

function buildInsights(profile, container) {
    container.innerHTML = '';

    container.appendChild(renderSummaryBlock(profile));

    const grid = document.createElement('div');
    grid.className = 'learning-graph-insights-grid';
    container.appendChild(grid);

    const masteryEntries = Object.entries(profile.mastery || {});
    const masteredCount = masteryEntries.filter(([_, stats]) => Number(stats?.score || stats) >= 1).length;
    const averageMastery = masteryEntries.length
        ? masteryEntries.reduce((sum, [, stats]) => sum + Number(stats?.score ?? stats ?? 0), 0) / masteryEntries.length
        : null;

    grid.appendChild(
        renderInsightCard({
            title: 'Concept Mastery',
            value: `${masteredCount} / ${masteryEntries.length || 0}`,
            body: averageMastery === null ? 'Start a quiz to build your mastery map.' : `Average mastery ${formatPercent(averageMastery)}`
        })
    );

    const preferences = profile.learned?.inferred_preferences;
    if (preferences) {
        const listItems = [];
        if (preferences.pace) listItems.push(`Pace: ${preferences.pace}`);
        if (preferences.depth) listItems.push(`Depth: ${preferences.depth}`);
        if (preferences.modality) listItems.push(`Prefers ${preferences.modality} explanations`);
        if (typeof preferences.analogy_affinity === 'number') {
            listItems.push(`Analogy affinity ${formatPercent(preferences.analogy_affinity)}`);
        }
        if (listItems.length) {
            grid.appendChild(
                renderInsightCard({
                    title: 'Learning Preferences',
                    value: 'Personalized',
                    body: listItems
                })
            );
        }
    }

    const analogies = profile.learned?.what_works?.analogy_domains || [];
    if (analogies.length) {
        grid.appendChild(
            renderInsightCard({
                title: 'Analogy Domains That Click',
                value: analogies.length === 1 ? analogies[0] : `${analogies.length} favorites`,
                body: analogies.length > 1 ? analogies : null
            })
        );
    }

    const recommendationsDetail = profile.recommendations_detail || {};
    grid.appendChild(
        renderRecommendationCard('Next Lessons', recommendationsDetail.next_focus, 'Answer a question to unlock the next path.')
    );
    grid.appendChild(
        renderRecommendationCard('Ready to Unlock', recommendationsDetail.unlocked, 'Master current concepts to unlock new ones.')
    );
    grid.appendChild(
        renderRecommendationCard('Concepts to Revisit', recommendationsDetail.remediation, 'No remediation needed yet.')
    );

    const courseModules = profile.course_modules;
    if (courseModules?.pending?.length) {
        grid.appendChild(
            renderInsightCard({
                title: 'Remediation Modules',
                value: `${courseModules.pending.length} pending`,
                body: courseModules.pending.slice(0, 3).map(mod => mod.title)
            })
        );
    } else if (courseModules?.completed?.length) {
        grid.appendChild(
            renderInsightCard({
                title: 'Remediation Modules',
                value: 'Up to date',
                body: [`Last completed: ${courseModules.completed[0].title}`]
            })
        );
    }

    const recentWins = profile.learned?.what_works?.recent_wins || profile.context_window || [];
    if (recentWins.length) {
        const winsList = recentWins.slice(-4).map(win => {
            if (typeof win === 'string') return win;
            if (win.summary) return win.summary;
            if (win.node_id) return `Mastered ${win.node_id}`;
            return 'Recorded success';
        });
        grid.appendChild(
            renderInsightCard({
                title: 'Recent Wins',
                value: `${winsList.length} noted`,
                body: winsList
            })
        );
    }

    const retryCounts = profile.learned?.what_fails?.retry_count_by_node;
    if (retryCounts) {
        const toughConcepts = Object.entries(retryCounts)
            .filter(([, attempts]) => attempts >= 2)
            .slice(0, 4)
            .map(([nodeId, attempts]) => `${nodeId} (${attempts} attempts)`);
        if (toughConcepts.length) {
            grid.appendChild(
                renderInsightCard({
                    title: 'Manual Review Queue',
                    value: 'Keep practicing',
                    body: toughConcepts
                })
            );
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('learning-graph-insights');
    if (!container) return;

    const profile = safeJsonParse(localStorage.getItem('student_profile'));
    const studentId = localStorage.getItem('adaptive_student_id');

    if (!profile) {
        const empty = document.createElement('div');
        empty.className = 'insight-empty-state';
        empty.innerHTML = '<strong>No learning profile yet.</strong><br>Complete a chapter quiz to unlock personalized paths.';
        if (studentId) {
            const idTag = document.createElement('p');
            idTag.style.marginTop = '0.75rem';
            idTag.style.fontSize = '0.85rem';
            idTag.style.color = '#94a3b8';
            idTag.textContent = `Student ID: ${studentId}`;
            empty.appendChild(idTag);
        }
        container.appendChild(empty);
        return;
    }

    buildInsights(profile, container);
});
