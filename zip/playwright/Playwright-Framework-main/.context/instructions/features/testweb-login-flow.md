# TestWeb Login Flow

## Fixture
`base.fixture`

## Pages Involved
- `TestWebLoginPage` from `../../src/pages/testweb/TestWebLoginPage.js` — login page object covering email/password authentication, magic link UI, and error handling
- `TestWebHomePage` from `../../src/pages/testweb/TestWebHomePage.js` — post-login landing page verifying user menu, brand links, and navigation

## Test Scenarios
### TC-TW-001 — Login Page UI Elements
**Precondition:** Navigate to /
**Steps:**
1. Observe the page
**Expected:** Brand links visible (pemnet, profil-global, haeger, autoriv, sherex), "Find Your Installation System" button visible, Sign In button visible, Register button visible, email input with placeholder "name@company.com", "Send code" button visible, "Sign in with a password instead" link visible, Register link visible

### TC-TW-002 — Happy Path Password Flow (Engineering)
**Precondition:** Navigate to /
**Steps:**
1. Click "Sign in with a password instead"
2. Enter email: engineering@penn.com
3. Enter password: valid password
4. Click Sign In
**Expected:** Redirected to /, user menu shows "David Wilson", role "Engineering"

### TC-TW-003 — Happy Path Password Flow (Sales)
**Precondition:** Navigate to /
**Steps:**
1. Click "Sign in with a password instead"
2. Enter email: sales@penn.com
3. Enter password: valid password
4. Click Sign In
**Expected:** User menu shows "Michael Johnson", role "Sales"

### TC-TW-004 — Happy Path Password Flow (Customer)
**Precondition:** Navigate to /
**Steps:**
1. Click "Sign in with a password instead"
2. Enter email: customer@penn.com
3. Enter password: valid password
4. Click Sign In
**Expected:** User menu shows "Emily Brown", role "External/Customer"

### TC-TW-005 — Happy Path Password Flow (Distributor)
**Precondition:** Navigate to /
**Steps:**
1. Click "Sign in with a password instead"
2. Enter email: distributor@penn.com
3. Enter password: valid password
4. Click Sign In
**Expected:** User menu shows "Robert Davis", role "Distributor/Partner"

### TC-TW-006 — Magic Link Flow UI
**Precondition:** Navigate to /
**Steps:**
1. Observe the login form
**Expected:** Email input visible, "Send code" button visible, password field NOT visible initially

### TC-TW-008 — Invalid Credentials
**Precondition:** Navigate to /
**Steps:**
1. Click "Sign in with a password instead"
2. Enter email: bad@server.com
3. Enter password: wrongpassword
4. Click Sign In
**Expected:** Stays on /login, generic error message displayed (no information about which field is wrong)

### TC-TW-011 — Case-Insensitive Email
**Precondition:** Navigate to /
**Steps:**
1. Click "Sign in with a password instead"
2. Enter email: ENGINEERING@PENN.COM (uppercase)
3. Enter password: valid password
4. Click Sign In
**Expected:** Login succeeds, redirected to /

### TC-TW-012 — Password Field Masked
**Precondition:** Navigate to /
**Steps:**
1. Click "Sign in with a password instead"
2. Type characters in the password field
**Expected:** Password characters displayed as bullets (type="password")

### TC-TW-013 — Navigate to Register
**Precondition:** Navigate to /
**Steps:**
1. Click the Register link/button
**Expected:** Navigated to /register

### TC-TW-029 — Home Page UI (Unauthenticated)
**Precondition:** Navigate to / (logged out)
**Steps:**
1. Observe the home page
**Expected:** Brand links (pemnet, profil-global, haeger, autoriv, sherex) visible, Sign In button visible, Register button visible

### TC-TW-030 — Home Page UI (Authenticated)
**Precondition:** Login as engineering@penn.com
**Steps:**
1. Observe the home page after login
**Expected:** User menu visible (instead of Sign In / Register buttons)

### TC-TW-031 — Navigate to Installation System
**Precondition:** Navigate to /
**Steps:**
1. Click "Find Your Installation System" button
**Expected:** Navigated to /installation-system

### TC-TW-033 — Logout Via User Menu
**Precondition:** Login as engineering@penn.com
**Steps:**
1. Click user menu
2. Click Sign Out
**Expected:** Redirected to /login, user is logged out

### TC-TW-034 — Protected Route Without Auth
**Precondition:** Clear session (logged out)
**Steps:**
1. Navigate to /installation-system
**Expected:** Redirected to /login

### TC-TW-035 — Expired Session Redirects
**Precondition:** Login as engineering@penn.com
**Steps:**
1. Clear cookies and localStorage (simulate expired session)
2. Navigate to /installation-system (or any protected route)
**Expected:** Redirected to /login

### TC-TW-036 — Login Persists Across Tabs
**Precondition:** Login as engineering@penn.com in tab 1
**Steps:**
1. Open a new tab
2. Navigate to /
**Expected:** New tab is already authenticated (user menu visible)

### TC-TW-037 — Page Refresh Preserves Session
**Precondition:** Login as engineering@penn.com
**Steps:**
1. Refresh the page
**Expected:** Stays logged in (user menu still visible)

### TC-TW-043 — Password Instead Button Toggle
**Precondition:** Navigate to /
**Steps:**
1. Enter email in the email input
2. Click "Sign in with a password instead" link
**Expected:** Password field appears, email stays filled, user can proceed with password login

### TC-TW-044 — Email Input Autocomplete
**Precondition:** Navigate to /
**Steps:**
1. Inspect the email input element
**Expected:** Email input has autocomplete attribute set (e.g., "email")

### TC-TW-007 — Magic Link Send Code flow
**Precondition:** Navigate to /login
**Steps:**
1. Enter engineering@penn.com in email input
2. Click "Send code" button
**Expected:** Code/OTP input field appears. Success message shown.

### TC-TW-009 — Empty Email Validation
**Precondition:** Navigate to /login
**Steps:**
1. Click "Send code" without entering email
**Expected:** Page remains on /login. Email field stays empty. No error crash.

### TC-TW-010 — Empty Password Validation
**Precondition:** Navigate to /login
**Steps:**
1. Enter email
2. Click "Sign in with a password instead"
3. Click Sign In without entering password
**Expected:** Page remains on /login. Form not submitted.

### TC-TW-014 — Navigate to Forgot Password page
**Precondition:** Browser at fresh state
**Steps:**
1. Navigate to /forget-password
**Expected:** Forgot password page loads with heading, email input, and Send OTP button.
