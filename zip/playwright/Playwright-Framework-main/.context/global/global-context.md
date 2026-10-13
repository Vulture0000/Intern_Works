# Global Application Context

## Application
- Name: PEMnet Configurator
- Purpose: Installation Systems configuration and solution selector platform
- Admin Portal: https://admin.configurator.dev.pemnet.ai
- Test Web Portal: https://testweb.configurator.dev.pemnet.ai

## Tech Stack (Selector Hints for AI)
- React SPA — dynamic rendering
- Form fields use `id` attributes with labels (`for` attribute)
- Selector priority (AI must follow this order):
    1. page.getByRole()              ← prefer always
    2. page.getByLabel()             ← for labelled fields
    3. page.locator('[data-test]')   ← explicit test attrs
    4. page.locator('#id')           ← fallback only

## Authentication
- Admin Portal: POST-based login; redirects to /users; Logout via user menu dropdown → "Sign out"
- Test Web Portal: POST-based login; stays on /; Logout via user menu dropdown → "Sign out"

## Coding Conventions (AI must always follow these)
- All Page Objects MUST extend BasePage (src/pages/base/BasePage.js)
- Constructor receives only: page (Playwright Page object)
- All selectors defined as class properties in constructor — never inline
- All methods must be async
- Methods return `this` for chaining where applicable
- No `expect()` inside Page Objects — assertions belong in test files only
- No `page.waitForTimeout()` — use `locator.waitFor()` only
- Maximum timeout: 10 000 ms
- Test files import from `tests/fixtures/base.fixture.js` — NOT from `@playwright/test` directly
- All tests wrapped in `test.describe()` with a name matching the feature
- Each test must be 100% independent — no shared state between tests

## Environments
- Configured via: process.env.BASE_URL in playwright.config.js
- Admin Portal: https://admin.configurator.dev.pemnet.ai
- Test Web Portal: https://testweb.configurator.dev.pemnet.ai

## Pages in Scope
### Admin Portal
- Admin Login Page       → instructions/pages/admin-login-page.md
- Admin Dashboard        → /users (All Users)
- Admin Roles            → /roles (Roles Management)
- Admin Applications     → /applications
- Admin Tasks            → /tasks
- Admin Analytics        → /analytics
- Admin Datasets         → /datasets/* (Machine Options, Products, Fasteners, Cost Models, etc.)

### Test Web Portal
- Test Web Login Page    → /login (email + password)
- Test Web Home          → / (landing with product categories)
- Installation System    → /installation-system (configurator)
