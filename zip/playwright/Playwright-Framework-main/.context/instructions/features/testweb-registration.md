# TestWeb Registration

## Fixture
`base.fixture`

## Pages Involved
- `TestWebRegisterPage` from `../../src/pages/testweb/TestWebRegisterPage.js` — registration page object with form fields, validation, and submit/reset actions

## Test Scenarios
### TC-TW-015 — Register Page UI Elements
**Precondition:** Navigate to /register
**Steps:**
1. Observe the registration page
**Expected:** Brand links visible, "Find Your Installation System" button visible, heading "Create an account", subtitle "Fill in the details below to get started", all form fields present (First name*, Last name*, Email*, Password* with min 8 chars hint, Confirm password*, Company*, Telephone number*, Company address*, Function/department* as react-select, Region* as react-select defaulting to "North America"), "Create account" button visible, "Already have an account? Sign in" link visible

### TC-TW-016 — Happy Path Complete Registration
**Precondition:** Navigate to /register
**Steps:**
1. Fill in all valid values for every required field
2. Click "Create account"
**Expected:** Registration succeeds, success message or redirect to login/home

### TC-TW-017 — Password Mismatch Validation
**Precondition:** Navigate to /register
**Steps:**
1. Fill valid values in all fields
2. Enter "Password123!" in Password field
3. Enter "DifferentPassword456!" in Confirm password field
4. Click "Create account"
**Expected:** Error message "Passwords do not match"

### TC-TW-018 — Weak Password Validation
**Precondition:** Navigate to /register
**Steps:**
1. Fill valid values in all fields
2. Enter "123" in Password field
3. Click "Create account"
**Expected:** Error "At least 8 characters"

### TC-TW-019 — Required Fields Validation
**Precondition:** Navigate to /register
**Steps:**
1. Click "Create account" without filling any fields
**Expected:** Validation errors on all required fields (First name, Last name, Email, Password, Confirm password, Company, Telephone number, Company address, Function/department, Region)

### TC-TW-020 — Invalid Email Format
**Precondition:** Navigate to /register
**Steps:**
1. Fill valid values in all fields
2. Enter "notanemail" in Email field
3. Click "Create account"
**Expected:** Email validation error (e.g., "Invalid email format")

### TC-TW-021 — Email Already Exists
**Precondition:** Navigate to /register
**Steps:**
1. Fill valid values in all fields
2. Enter "engineering@penn.com" in Email field
3. Click "Create account"
**Expected:** Error "Email already registered"

### TC-TW-022 — Telephone Number Validation
**Precondition:** Navigate to /register
**Steps:**
1. Fill valid values in all fields
2. Enter "abc" in Telephone number field
3. Click "Create account"
**Expected:** Validation error on telephone number (e.g., "Invalid telephone number")

### TC-TW-023 — Cancel/Navigate Away
**Precondition:** Navigate to /register
**Steps:**
1. Click "Sign in" link
**Expected:** Navigated to /login

### TC-TW-038 — Long Password Validation
**Precondition:** Navigate to /register
**Steps:**
1. Fill valid values in all fields
2. Enter a 100+ character password in Password and Confirm password
3. Click "Create account"
**Expected:** Handled gracefully (accepted or truncated, no crash)

### TC-TW-039 — Special Characters in Name
**Precondition:** Navigate to /register
**Steps:**
1. Enter special characters (e.g., "John@" or "*&^%") in First name field
2. Fill valid values in other fields
3. Click "Create account"
**Expected:** Handled gracefully (sanitized, rejected with message, or accepted)

### TC-TW-040 — All Fields Max Length
**Precondition:** Navigate to /register
**Steps:**
1. Enter 500+ characters in each text field
2. Click "Create account"
**Expected:** Max length respected or values truncated gracefully (no crash)
