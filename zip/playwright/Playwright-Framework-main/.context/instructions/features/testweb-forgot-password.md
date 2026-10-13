# TestWeb Forgot Password

## Fixture
`base.fixture`

## Pages Involved
- `TestWebForgotPasswordPage` from `../../src/pages/testweb/TestWebForgotPasswordPage.js` — forgot password page object with email input, OTP request, and OTP verification

## Test Scenarios
### TC-TW-024 — Forgot Password Page UI
**Precondition:** Navigate to /forgot-password
**Steps:**
1. Observe the page
**Expected:** Heading "Forgot password", description text explaining the flow, email input with placeholder "name@company.com", "Send OTP" button, "Remember your password? Sign in" link

### TC-TW-025 — Send OTP Happy Path
**Precondition:** Navigate to /forgot-password
**Steps:**
1. Enter email: engineering@penn.com
2. Click "Send OTP"
**Expected:** Success message "OTP sent to your email", OTP input field appears

### TC-TW-026 — Unregistered Email
**Precondition:** Navigate to /forgot-password
**Steps:**
1. Enter email: nonexistent@test.com
2. Click "Send OTP"
**Expected:** Generic error message (should NOT reveal whether the email is registered)

### TC-TW-027 — Empty Email Validation
**Precondition:** Navigate to /forgot-password
**Steps:**
1. Click "Send OTP" without entering an email
**Expected:** Validation error on email field (e.g., "Email is required")

### TC-TW-028 — Navigate to Sign In
**Precondition:** Navigate to /forgot-password
**Steps:**
1. Click "Sign in" link
**Expected:** Navigated to /login

### TC-TW-041 — Invalid OTP Attempts
**Precondition:** Navigate to /forgot-password, request OTP for engineering@penn.com
**Steps:**
1. Enter an incorrect OTP
2. Submit
3. Repeat for 3+ attempts
**Expected:** Error "Invalid OTP" after each attempt

### TC-TW-042 — OTP Expiry
**Precondition:** Navigate to /forgot-password, request OTP for engineering@penn.com
**Steps:**
1. Wait beyond OTP validity period (e.g., simulate time travel or wait for timeout)
2. Enter a valid OTP
**Expected:** Error "OTP expired" or "OTP has expired"
