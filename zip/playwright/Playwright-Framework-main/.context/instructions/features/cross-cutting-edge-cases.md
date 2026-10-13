# Cross-Cutting Edge Cases

## Fixtures
- Use `base.fixture.js` for unauthenticated tests
- Use `web-engineer-auth.fixture.js` for Engineering role

## Page Objects
- `TestWebInstallationSystemPage` — installation system configurator
- `TestWebMachineConfigurationPage` — configuration panel
- `TestWebLoginPage` — login page
- `TestWebRegisterPage` — registration page

## Description
These tests cover cross-cutting quality attributes that apply across multiple features: input sanitization, loading states, error handling, browser navigation, and UI resilience.

## Test Cases

### TC-EDGE-001 — Rapid double-click on Sign In does not cause duplicate submission
- Steps:
  1. Navigate to login page
  2. Fill in valid credentials
  3. Rapidly click Sign In twice
- Expected: No duplicate submission errors. User is logged in successfully or remains on login page without errors.

### TC-EDGE-002 — XSS injection in text fields is sanitized
- Steps:
  1. Navigate to register page
  2. Enter `<script>alert("XSS")</script>` in the name field
  3. Fill other required fields
- Expected: Script tag is not executed. Input is sanitized and does not appear as executable script in the DOM.

### TC-EDGE-003 — Spinner/loading indicator visible while data loads
- Steps:
  1. Log in as engineering
  2. Navigate to installation system
- Expected: A loading spinner or progress indicator is visible while the page/data loads, or the page content renders directly.

### TC-EDGE-004 — Browser back/forward does not corrupt page state
- Steps:
  1. Log in as engineering
  2. Navigate to installation system
  3. Interact with the page (e.g. check a solution checkbox)
  4. Navigate away and press browser back
- Expected: Page renders correctly after back navigation without visual corruption or JavaScript errors.

### TC-EDGE-005 — Unicode and special characters in text fields are handled gracefully
- Steps:
  1. Navigate to register page
  2. Enter Unicode text (e.g. `Hello 世界 ñoño 🔧 테스트`) in the name field
- Expected: Unicode characters are accepted and displayed correctly in the input field.

### TC-EDGE-006 — Very long input does not break form submission
- Steps:
  1. Navigate to register page
  2. Enter 5000 characters in the name field
- Expected: Long text is accepted without browser crash or input truncation issues.

### TC-EDGE-007 — Configuration panel loads with visible machine options section
- Steps:
  1. Log in as engineering
  2. Navigate to installation system
  3. Select A210 solution
  4. Open comparison view and configuration panel
- Expected: Configuration panel is visible with machine options, filters, and action buttons.

### TC-EDGE-008 — Login with invalid credentials shows error message
- Steps:
  1. Navigate to login page
  2. Enter an invalid email and password
  3. Click Sign In
- Expected: A clear error message is displayed (e.g. "Sign-in could not be completed"). User remains on the login page.
