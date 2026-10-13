# Auth Session Management

## Fixture
- Use `base.fixture.js` for unauthenticated tests
- Use inline login in tests that need authenticated sessions

## Pages Involved
- Admin Login Page (`src/pages/admin/AdminLoginPage.js`)
- Admin Dashboard Page (`src/pages/admin/AdminDashboardPage.js`)

## Test Cases

### TC-AUTH-06 — Login rejected — unknown email
- Precondition: No account for the email
- Steps:
  1. Navigate to Admin Login Page
  2. Submit an unregistered email and password via the login form
- Expected: System returns an authentication error; does not reveal whether the email exists

### TC-AUTH-07 — Session persists across page reload
- Type: Manual
- Skip in automation

### TC-AUTH-08 — Logout clears session
- Precondition: User is logged in
- Steps:
  1. Log in as admin
  2. Trigger logout via user menu → Sign Out
  3. Navigate to a protected endpoint (/users)
- Expected: Session is destroyed; subsequent request to a protected endpoint redirects to login

### TC-AUTH-09 — Unauthenticated access to protected endpoint
- Precondition: No active session
- Steps:
  1. Navigate directly to /users without authenticating
- Expected: System redirects to /login with a 401 error

### TC-AUTH-10 — Session expiry after maximum lifetime
- Precondition: User logs in
- Steps:
  1. Log in as admin
  2. Clear browser cookies (simulating session expiry)
  3. Try to access a protected endpoint (/users)
- Expected: Session is no longer valid; user is redirected to login (401)

### TC-AUTH-11 — Login email is case-insensitive
- Precondition: Registered user with lowercase email
- Steps:
  1. Navigate to Admin Login Page
  2. Submit login with email in UPPERCASE and correct password
- Expected: System normalises the email and authenticates successfully (redirects to /users)

### TC-AUTH-12 — Concurrent sessions from two browsers
- Type: Manual
- Skip in automation
