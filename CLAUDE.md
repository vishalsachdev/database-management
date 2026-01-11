# CLAUDE.md

This file provides guidance to Claude Code when working on this textbook.

## Project Overview

This is **Database Management**, an intelligent textbook built using the Intelligent Textbooks Framework. It combines AI-powered content generation with interactive learning experiences.

## Development Commands

### Local Development
```bash
# Install dependencies
conda create -n database-management python=3
conda activate database-management
pip install mkdocs "mkdocs-material[imaging]"
pip install -e .

# Build the site
mkdocs build

# Run local server
mkdocs serve

# Deploy to GitHub Pages
mkdocs gh-deploy
```

## Architecture

- **Framework**: Based on [intelligent-textbooks](https://github.com/dmccreary/intelligent-textbooks)
- **Skills**: Uses [Claude Skills](https://github.com/dmccreary/claude-skills)
- **Content**: Located in `docs/`
- **Simulations**: Located in `docs/sims/`

## File Conventions

- All content pages are Markdown files in `docs/`
- Navigation structure is defined in `mkdocs.yml`
- MicroSims follow the pattern: `docs/sims/[name]/index.md` + `main.html` + `*.js`
- Custom CSS in `docs/css/extra.css`
- Custom JS in `docs/js/extra.js`

## Keeping Updated

Run these scripts to sync with upstream:

- `./sync-skills.sh` - Update skills from dmccreary/claude-skills
- `./sync-framework.sh` - Update framework plugins and tools

## Content Organization

[Add specific information about how content is organized in this textbook]

---

## AI Assistant Guidelines

### DO:
- Help understand concepts and explain approaches
- Review code structure and suggest improvements
- Assist with debugging and error explanation
- Help students understand database concepts
- Explain MicroSim implementations and p5.js code

### DON'T:
- Provide complete solutions to assignments
- Write code that students should write themselves
- Share answers to graded assessments

---

## Current Focus
- [ ] [Update during /session-start]

## Roadmap
- [ ] [Add planned features]

## Session Log
### 2025-12-27
- Added AI Assistant Guidelines and roadmap sections
