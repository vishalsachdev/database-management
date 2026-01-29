# Adaptive Pathfinding Notes (Draft)

## Triggers and Behaviors
- **Stuck on A → decompose A**: If `retry_count_by_node[A] >= 2` or mastery[A] < 0.5 after a retry, schedule `remediation.subnodes` (if present) before attempting A again. Mark A as blocked until subnodes complete.
- **Learner wants B but weak on A (prereq)**: For each B candidate, if any prereq mastery < threshold (e.g., 0.7) or high retry_count, insert `prerequisite_refreshers` for those prereqs before B.

## Pseudocode Sketch
```
state = load(profile, graph, page_index)
ready = []

for node in graph.nodes:
  if mastered(node): continue
  if prereqs_mastered(node):
    ready.append(node)

# Decomposition for stuck nodes
candidates = []
for n in ready:
  if is_stuck(n) and has_remediation(n):
    candidates.extend(n.remediation.subnodes)
    mark_blocked(n)
  else:
    candidates.append(n)

# Just-in-time refresher
final_queue = []
for n in candidates:
  weak_prereqs = [p for p in prereqs(n) if mastery(p) < 0.7 or retry(p) >= 2]
  if weak_prereqs and has_refreshers(n):
    final_queue.extend(refreshers_for(n, weak_prereqs))
  final_queue.append(n)

# Rank using learned preferences
ranked = rank(final_queue, learned_preferences)
next_node = ranked[0]
```

## Ranking Heuristics
- If pace == "slow": prefer lower complexity and page-order continuity.
- If weak_node_types includes assessment.type: either deprioritize or add scaffolding.
- If per_concept_hints exists: small boost to use known hint.

## Instruction Generation Hooks
- For subnodes: keep scope narrow; reuse analogies that worked; short quiz/mini challenge.
- For refreshers: concise recap + 1–2 checks; on success, bump mastery(prereq) toward 0.7–0.8.

## Persistence
- On success: update mastery, recent_wins, last_page/last_node; reinforce analogy/explanation_style if used.
- On failure: increment retry_count_by_node; add confusion_triggers if explicit feedback.
- Cap lists (recent_wins, confusion_triggers) per spec; keep profile portable.

## Open Items
- Decide exact thresholds (retry >= 2, mastery < 0.7) and make them config-driven.
- Add validation to ensure remediation subnodes and refresher nodes are in the graph and page_index.
```
