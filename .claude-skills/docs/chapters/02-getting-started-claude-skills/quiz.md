# Quiz: Getting Started with Claude and Skills

Test your understanding of Claude Skills, skill definition files, installation, and invocation with these questions.

---

#### 1. What is a Claude Skill?

<div class="upper-alpha" markdown>

- A simple one-line prompt for Claude AI
- An autonomous agent that executes complex, multi-step workflows
- A keyboard shortcut for common tasks
- A programming language for AI systems

</div>

??? question "Show Answer"
    The correct answer is **B**. Claude Skills represent autonomous agents designed to execute complex, multi-step workflows without continuous human intervention. Unlike simple prompts that request a single output, skills encapsulate comprehensive procedures including context gathering, quality validation, iterative refinement, and structured deliverable generation. Option A describes basic prompts, option C describes hotkeys, and option D mischaracterizes skills as a programming language.

    **Concept Tested:** Claude Skill

    **See:** [Understanding Claude Skills](index.md#understanding-claude-skills)

---

#### 2. Which file defines a Claude Skill?

<div class="upper-alpha" markdown>

- README.md with configuration settings
- skill.json containing workflow steps
- SKILL.md with YAML frontmatter and markdown workflow
- config.yml with execution parameters

</div>

??? question "Show Answer"
    The correct answer is **C**. Every Claude Skill is defined by a `SKILL.md` file containing both metadata (YAML frontmatter) and workflow instructions (markdown content). This standardized structure enables Claude Code to discover, load, and execute skills consistently across projects. Options A, B, and D reference files that are not used in the Claude Skills system.

    **Concept Tested:** Skill Definition File Structure

    **See:** [Skill Definition File Structure](index.md#skill-definition-file-structure)

---

#### 3. What information is included in the YAML frontmatter of a skill file?

<div class="upper-alpha" markdown>

- Step-by-step workflow instructions
- Code examples and templates
- Name, description, license, and allowed tools
- User feedback and quality ratings

</div>

??? question "Show Answer"
    The correct answer is **C**. The YAML frontmatter section provides metadata that Claude Code uses for skill discovery, permission management, and user-facing documentation. Required fields include name, description, and license, while the optional allowed-tools field specifies which tools the skill can use. Option A describes the markdown body (not frontmatter), option B describes supporting resources, and option D is not part of skill files.

    **Concept Tested:** YAML Frontmatter in Skills

    **See:** [YAML Frontmatter in Skills](index.md#yaml-frontmatter-in-skills)

---

#### 4. What is the purpose of the `allowed-tools` field in skill frontmatter?

<div class="upper-alpha" markdown>

- To list tools the user must install before running the skill
- To speed up skill execution by preloading tools
- To improve skill documentation for beginners
- To limit the skill to specific Claude Code tools for security

</div>

??? question "Show Answer"
    The correct answer is **D**. The `allowed-tools` frontmatter field provides fine-grained permission control, limiting skills to specific Claude Code tools. This security and safety mechanism prevents skills from performing unintended operations by following the principle of least privilege—granting only the tools necessary for the skill's function. Options A, B, and C mischaracterize the purpose of this field.

    **Concept Tested:** Allowed Tools in Skills

    **See:** [Allowed Tools in Skills](index.md#allowed-tools-in-skills)

---

#### 5. What is the difference between a Claude Skill and a Claude Command?

<div class="upper-alpha" markdown>

- Skills are for beginners, commands are for experts
- Skills execute multi-step workflows, commands expand simple text prompts
- Skills are free, commands require payment
- Skills work offline, commands require internet

</div>

??? question "Show Answer"
    The correct answer is **B**. Skills are autonomous agents that execute complex, multi-step workflows with context gathering, quality validation, and structured outputs. Commands, by contrast, are simpler mechanisms that expand text prompts—when a user types a slash command like `/commit`, it expands to a predefined prompt. Skills are more sophisticated workflow automation tools, while commands are text expansion shortcuts. The other options describe incorrect distinctions.

    **Concept Tested:** Difference Between Skills & Commands

    **See:** [Claude Command](index.md#claude-command) and [Difference Between Skills & Commands](index.md#difference-between-skills-commands)

---

#### 6. Where should skills be installed for global availability across all projects?

<div class="upper-alpha" markdown>

- In the project root directory
- In /usr/local/share/claude-skills/
- In ~/.claude/skills/ in the user's home directory
- In the Claude AI cloud account settings

</div>

??? question "Show Answer"
    The correct answer is **C**. Global installation makes skills available in all Claude Code sessions regardless of current working directory by storing them in `~/.claude/skills/` in the user's home directory. Project-local skills can be installed in `.claude/skills/` within a specific project directory, but these are not globally available. Options A, B, and D describe incorrect installation locations.

    **Concept Tested:** Installing a Claude Skill

    **See:** [Installing a Claude Skill](index.md#installing-a-claude-skill)

---

#### 7. How does Claude Code determine which workflow steps to execute when a skill is invoked?

<div class="upper-alpha" markdown>

- By analyzing user intent from the invocation command
- By reading the step-by-step instructions in the markdown body of SKILL.md
- By executing all Python scripts in the skill directory
- By querying the Claude AI model for the optimal workflow

</div>

??? question "Show Answer"
    The correct answer is **B**. The markdown body of a SKILL.md file contains detailed, step-by-step instructions (typically under a "## Workflow" section with numbered steps like "Step 1", "Step 2") that Claude Code executes autonomously. These instructions are explicitly written and sequenced, providing clear guidance for execution. Options A, C, and D describe incorrect mechanisms for determining workflow execution.

    **Concept Tested:** Skill Workflow Instructions

    **See:** [Skill Workflow Instructions](index.md#skill-workflow-instructions)

---

#### 8. A developer creates a new skill that needs to analyze existing files but should never modify them or access the internet. Which `allowed-tools` configuration is most appropriate?

<div class="upper-alpha" markdown>

- [Read, Grep, Glob]
- [Write, Edit, Bash]
- [WebFetch, WebSearch, Read]
- All tools (allowed-tools field omitted)

</div>

??? question "Show Answer"
    The correct answer is **A**. For a skill that only analyzes existing files without modification, read-only tools are appropriate: Read (access file contents), Grep (search file contents), and Glob (find files matching patterns). This follows the principle of least privilege by granting only necessary tools. Option B includes write tools, option C includes web access tools, and option D grants excessive permissions. Using [Read, Grep, Glob] ensures the skill cannot accidentally modify files or access external resources.

    **Concept Tested:** Allowed Tools in Skills

    **See:** [Allowed Tools in Skills](index.md#allowed-tools-in-skills)

---

#### 9. Why do well-designed skill workflow instructions include verification checkpoints and error handling guidance?

<div class="upper-alpha" markdown>

- To make the skill file longer and more impressive
- To test Claude's ability to handle complex logic
- To enable autonomous execution even when conditions vary
- To satisfy software licensing requirements

</div>

??? question "Show Answer"
    The correct answer is **C**. Verification checkpoints (confirming expected files exist and meet quality standards) and error handling guidance (instructions for when expected conditions aren't met) enable skills to execute autonomously even when project structures vary or unexpected conditions occur. This makes skills robust and adaptable rather than brittle. Options A, B, and D misunderstand the purpose of these workflow elements.

    **Concept Tested:** Skill Workflow Instructions

    **See:** [Skill Workflow Instructions](index.md#skill-workflow-instructions)

---

#### 10. What does invoking a skill with a slash command like `/quiz-generator` accomplish?

<div class="upper-alpha" markdown>

- It downloads the skill from the internet
- It creates a new SKILL.md file in the project
- It compiles the skill into executable code
- It loads and executes the skill's workflow instructions

</div>

??? question "Show Answer"
    The correct answer is **D**. When you invoke a skill using a slash command (like `/quiz-generator`), Claude Code loads the corresponding SKILL.md file, reads the YAML frontmatter for metadata and permissions, and then executes the step-by-step workflow instructions in the markdown body. The skill must already be installed; invocation doesn't download (A), create (B), or compile (C) anything—it executes an existing installed skill.

    **Concept Tested:** Invoking Skills with Slash Commands

    **See:** [Invoking Skills with Slash Commands](index.md#invoking-skills-with-slash-commands)

---

## Quiz Statistics

- **Total Questions:** 10
- **Bloom's Taxonomy Distribution:**
  - Remember: 4 questions (40%)
  - Understand: 4 questions (40%)
  - Apply: 1 question (10%)
  - Analyze: 1 question (10%)
- **Concepts Covered:** 10 of 18 chapter concepts (56%)
