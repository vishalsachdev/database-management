---
name: db-management-context-check
description: Before starting any coding or content implementation in the Database Management textbook project, review db-management-textbook-overview.md to align with the current project state, gaps, and constraints.
---

# Database Management Context Check

## Purpose
This skill prevents context drift when working inside the `database-management/` intelligent textbook by enforcing a quick refresh on the repository's status before any code or content changes begin. The `db-management-textbook-overview.md` file captures the latest architecture, outstanding gaps, plugin behaviors, and follow-up work. Reading it first keeps every contributor aligned with reality.

## When to Invoke
Run this skill **before any task that modifies code, content, configuration, or assets** within the `database-management/` subtree, including but not limited to:
- Implementing new chapters, labs, or resources
- Adjusting MkDocs configuration, theme assets, or plugins
- Adding interactive assets, simulations, or Claude skill integrations
- Performing refactors, cleanups, or fixes triggered by broken builds or navigation issues

If you are unsure whether the request touches the Database Management textbook, assume it does and invoke this skill.

## Required Workflow

### Step 1 · Confirm Scope
- Identify whether the user request involves the Database Management textbook (`database-management/` directory).
- If the scope is unclear, ask the user for clarification before proceeding.

### Step 2 · Read the Overview File
- Use the `read` tool to open `/database-management/db-management-textbook-overview.md`.
- Extract and note the latest information on:
  - Project topology and key directories
  - Authored content coverage versus placeholders
  - Learning graph assets and their roles
  - Build/deployment workflow expectations
  - Custom plugin behavior and dependencies
  - Known gaps, missing assets, and suggested next actions

### Step 3 · Capture Applicable Constraints
- Summarize the context that affects the upcoming task (e.g., missing labs, absent CSS/JS assets, incomplete chapters).
- Reference specific sections or bullets from the overview when explaining decisions or raising risks.

### Step 4 · Proceed with Implementation
- Begin editing files, running generators, or invoking other skills only after the overview has been reviewed in this session.
- Keep the identified constraints in mind throughout the task and call out if the requested work conflicts with known gaps or blockers.

## Guardrails
- **Do not modify** `db-management-textbook-overview.md` while using this skill; treat it as a read-only source of truth.
- If the file is missing or appears outdated, stop and inform the user instead of guessing.
- Re-run this skill whenever significant time has passed or the project state may have changed.

## Deliverable
Provide a brief confirmation (one to six bullet points) summarizing the relevant insights from the overview before you begin the requested coding work. This confirmation becomes the anchor for downstream decisions and verifications.
