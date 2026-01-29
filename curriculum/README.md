# Adaptive Curriculum Artifacts

This folder holds the portable-adaptive graph and navigation index for the Database Management textbook (chapters 1–3 draft).

## Files
- `knowledge_graph.json` — Spec-compliant DAG with remediation and refresher nodes:
  - `remediation.subnodes` decompose a concept when the learner is stuck (e.g., keys split into primary/foreign focus before retrying the parent).
  - `prerequisite_refreshers` insert short recap nodes before a target concept when its prereqs are weak.
- `page_index.json` — Linear page order and node-to-page mapping for the current chapters.
- `pathfinding-notes.md` — Pseudocode for inserting remediation and refresher nodes into the agent cycle.

## How to integrate with the agent
1) Load `knowledge_graph.json` and `page_index.json` as the graph + index in the agent’s state step.
2) Pathfinding:
   - If `retry_count_by_node[A] >= 2` or mastery[A] < 0.5 after a retry → enqueue `remediation.subnodes` before A, block A until they pass.
   - If candidate B has prereq A with mastery < 0.7 or high retries → enqueue `prerequisite_refreshers` for A before B.
   - Then rank candidates using `learned` preferences (pace/depth/modality), weak_node_types, and per_concept_hints.
3) Instruction generation: use each node’s `core_content`, apply learned analogies/style, and include page_index info for UI linking.
4) Validation/Learn: update mastery, retry counts, recent wins, and optional per-concept hints; cap lists per spec.

## Known gaps / anchors
- The chapter file `docs/chapters/02-tables-relational-algebra.md` does not currently expose `#keys` or `#foreign-keys` anchors; page_index uses page numbers only for these nodes. If you want fragment links, add heading anchors for the keys and foreign-keys sections.
- Chapters 4–9, labs, and resources are still missing; the graph only covers chapters 1–3.

## Next steps (optional)
- Add anchors in chapter 2 for keys/foreign-keys sections to enable direct fragment linking.
- Extend the graph/page index for chapters 4–9 once content exists.
- Add a profile schema + sample profile in `profiles/` to exercise the full adaptive loop.
