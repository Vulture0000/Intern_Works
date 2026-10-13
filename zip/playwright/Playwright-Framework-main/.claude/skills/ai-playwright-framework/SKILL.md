---
name: ai-playwright-framework
description: >
  Framework architecture, POM rules, generation workflow, and project structure.
  The canonical version of this skill is in .context/skills/framework-architecture.md
  and is shared across all LLMs (Cursor, Copilot, Windsurf, etc.).
---

# AI Playwright Framework — Skill

> This skill is a thin wrapper. The **canonical source** is:
> `.context/skills/framework-architecture.md`

## What Changed

All skill knowledge has been consolidated into `.context/skills/` to be LLM-agnostic:

| Claude Skill | New Universal Location |
|---|---|
| `.claude/skills/ai-playwright-framework/SKILL.md` | `.context/skills/framework-architecture.md` |
| `.claude/skills/opencode/SKILL.md` | `.context/skills/automation-rules.md` |
| `.claude/skills/PR_Description/SKILL.md` | `.context/skills/pr-description.md` |
| `.agents/skills/playwright-best-practices/SKILL.md` | `.context/skills/playwright-best-practices/` (symlinked) |

For the full skill content, read:
- `.context/skills/framework-architecture.md` — architecture, POM rules, generation workflow
- `.context/skills/automation-rules.md` — pre-automation checklist, file creation order
- `.context/skills/pr-description.md` — PR description format
- `AGENTS.md` — universal LLM entry point
