# Bugs

## BUG-001: Forgot Password — Send OTP yields no response
- **Test IDs**: TC-TW-025, TC-TW-026, TC-TW-041, TC-TW-042
- **Module**: TestWeb Portal — Forgot Password
- **Description**: Clicking "Send OTP" with a registered email does not display a success message or render the OTP input field. Page remains on the email-only form.
- **Expected**: "OTP sent" success message and OTP input field (#otp) should appear.
- **Actual**: No visible feedback. OTP input never renders.
- **Root Cause**: Backend OTP API may not respond, or frontend doesn't process the response.
- **Severity**: P1 — Blocks 4 test cases

## BUG-002: Installation System — Backdrop overlay persists after modal closes
- **Test IDs**: TC-APP-047
- **Module**: Installation System — Application Flows
- **Description**: After a modal closes, the backdrop overlay (`<div class="fixed inset-0 z-50">`) remains visible and blocks subsequent clicks.
- **Expected**: Backdrop should be removed when the modal is dismissed.
- **Actual**: Overlay persists, intercepting click events on elements behind it.
- **Workaround**: Tests use `{ force: true }` to bypass. Proper fix should ensure backdrop is removed on modal close.
- **Severity**: P2 — Blocks 1 test case

## BUG-003: TestWeb Login — Session/logout/multi-tab tests fail
- **Test IDs**: TC-TW-033, TC-TW-035, TC-TW-036
- **Module**: TestWeb Portal — Login
- **Description**: Session management issues across three scenarios:
  1. **Logout (TC-TW-033)**: After clicking "Sign out" in the user menu confirmation modal, the app stays on the home page `/` instead of redirecting to `/login`. Page hangs after the action.
  2. **Expired session (TC-TW-035)**: After clearing all cookies, localStorage, and sessionStorage, navigating to `/installation-system` still loads the full protected page without redirecting to `/login`. Auth state is cached in-memory (React context/Redux) and survives storage clearing.
  3. **Cross-tab persistence (TC-TW-036)**: A new tab opened via `context.newPage()` is redirected to `/login` when accessing a protected route, even though the first tab is fully authenticated. The app likely uses `sessionStorage` or an in-memory token instead of a shared cookie.
- **Expected**: Logout redirects to `/login`; expired/storage-cleared session redirects to `/login` before rendering protected content; second tab shares the session via cookies.
- **Actual**: Logout stays on home page; expired session serves full protected page; cross-tab session is not shared.
- **Root Cause**: App uses in-memory/auth context state that does not persist across page navigations, storage clearing, or new tabs. Likely missing `SameSite` cookie config or uses `sessionStorage` instead of `httpOnly` cookies.
- **Severity**: P1 — Blocks 3 critical session test cases

## BUG-004: E2E — Protected route does not redirect to login without auth
- **Test IDs**: TC-E2E-007
- **Module**: E2E Flows
- **Description**: Accessing a protected page (e.g., `/installation-system`) without authentication does not redirect to `/login`. The app appears to render content or show a blank page instead.
- **Expected**: App should redirect unauthenticated users to `/login`.
- **Actual**: Page does not redirect, or redirects to a different URL.
- **Severity**: P2 — Blocks 1 test case

## BUG-005: E2E — Filtered count does not persist after tab switch
- **Test IDs**: TC-E2E-017
- **Module**: E2E Flows
- **Description**: After applying filters, switching to a different tab and navigating back resets the filtered count instead of preserving it.
- **Expected**: Filtered count should persist across tab switches.
- **Actual**: Filtered count changes after navigating away and back.
- **Severity**: P2 — Blocks 1 test case

## BUG-006: Admin Portal — Non-admin users stuck on "Checking access…" after login
- **Test IDs**: TC-ROLE-004
- **Module**: Admin Portal — Role-Based Access Control
- **Description**: Engineer user (`engineering@penn.com`), configured as a TestWeb user in test data, succeeds in authenticating on the admin portal login page but the SPA then shows "Checking access…" indefinitely and never renders the `/users` page or any admin content. `isPageAccessible()` returns false because body content is minimal.
- **Expected**: After successful login, non-admin users should either be redirected to the admin dashboard (if permitted) or receive an explicit "unauthorized" error message (not a perpetual loading state).
- **Actual**: Page hangs on "Checking access…" loading state. User is neither granted access nor cleanly rejected.
- **Root Cause**: The admin SPA's permission check API call fails for TestWeb-only users. The app lacks a fallback for users who can authenticate but aren't assigned admin portal roles — it simply shows an indefinite loading spinner.
- **Severity**: P1 — Blocks TC-ROLE-004 and potentially other role-based tests

## BUG-007: Admin Portal — Non-admin users receive "Not authorized" page instead of proper access control
- **Test IDs**: TC-ROLE-008 (partially)
- **Module**: Admin Portal — Role-Based Access Control
- **Description**: Sales user (`sales@penn.com`) authenticates and is redirected to `/users`, but navigating to `/applications`, `/tasks`, or other routes returns a static "You are not authorized to access this page" page with an `<h1>` heading and a "Sign out" button. The user is technically logged in but cannot access any admin functionality beyond `/users`.
- **Expected**: Depending on the `canQuote` flag, sales users should either access quoting-related pages or get a proper 403 response (not a generic static error page). The unauthorized page should also include the standard navigation/banner so the user can navigate elsewhere.
- **Actual**: The unauthorized page lacks the standard user menu banner, preventing users from signing out via the normal flow. The `<h1>` text is generic and provides no actionable next steps beyond a single "Sign out" button.
- **Root Cause**: Same as BUG-006 — TestWeb users don't have admin portal permissions. Additionally, the unauthorized error page renders outside the app's shell/layout, omitting the banner and user menu.
- **Severity**: P2 — Partially blocks TC-ROLE-008 (the user menu step fails); the route access steps pass falsely due to a broad `pageHeading` locator matching the error heading.
