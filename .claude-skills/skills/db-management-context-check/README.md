# Database Management Context Check Skill

## Overview
This skill ensures that any work on the Database Management intelligent textbook begins with a current understanding of the project state by reading `db-management-textbook-overview.md`.

## Usage
Invoke this skill before any coding, content, configuration, or asset changes within the `database-management/` directory:

```
Use the db-management-context-check skill before implementing [task description]
```

## What It Does
1. Confirms the request scope involves the Database Management textbook
2. Reads the latest overview file to capture project topology, content status, gaps, and constraints
3. Summarizes relevant insights before proceeding with implementation
4. Maintains alignment with known gaps and suggested next steps

## When to Use
- Before implementing new chapters, labs, or resources
- Before adjusting MkDocs configuration, theme assets, or plugins
- Before adding interactive assets, simulations, or Claude skill integrations
- Before performing refactors, cleanups, or fixes

## Guardrails
- Treats `db-management-textbook-overview.md` as read-only authoritative context
- Stops and informs the user if the overview file is missing or outdated
- Recommends re-running after significant time has passed

## Integration
This skill follows the standard Claude Skills pattern and integrates with the existing skills ecosystem in the `.claude-skills` directory.