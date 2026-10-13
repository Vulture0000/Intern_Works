# AI Playwright Framework — Universal Agent Instructions

This project is an **AI-driven E2E QA automation framework** built on Playwright + JavaScript.
Engineers write plain-English `.md` instruction files. The AI reads them and generates all Page Objects and test specs.

---

## Knowledge Base (read these for context)

| File | Purpose |
|------|---------|
| `.context/global/global-context.md` | App info, selector rules, coding conventions |
| `.context/skills/framework-architecture.md` | Full framework architecture, POM rules, generation workflow |
| `.context/skills/automation-rules.md` | Pre-automation checklist, file creation order, naming conventions |
| `.context/skills/pr-description.md` | PR description format |
| `.agents/skills/playwright-best-practices/SKILL.md` | Comprehensive Playwright best practices reference |

## Task Workflow

1. **Read instructions** — consult knowledge base above based on task
2. **Generate page objects** — read `.context/instructions/pages/<page>.md` + `.context/prompts/pom-generator.md` → output to `src/pages/`
3. **Generate test specs** — read `.context/instructions/features/<feature>.md` + `.context/prompts/test-generator.md` → output to `tests/`
4. **Run tests** — `npm test`

## Quick Links

- **Page instruction files:** `.context/instructions/pages/`
- **Feature instruction files:** `.context/instructions/features/`
- **Page Objects (generated):** `src/pages/`
- **Test specs (generated):** `tests/`
- **Test fixtures:** `tests/fixtures/`
- **Test data:** `test-data/users.json`
- **Prompts:** `.context/prompts/`
