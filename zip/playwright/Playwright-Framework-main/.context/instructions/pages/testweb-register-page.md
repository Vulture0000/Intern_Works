# Test Web Register Page

## URL
`/register` (relative to Test Web Portal base URL `https://testweb.configurator.dev.pemnet.ai`)

## Elements
- Page heading — `getByRole('heading', { name: /create an account/i })` — h1 "Create an account"
- First name input — `locator('#first-name')` — required field
- Last name input — `locator('#last-name')` — required field
- Email input — `locator('#email')` — required field
- Password input — `locator('#password')` — required, minimum 8 characters
- Confirm password input — `locator('#confirm-password')` — required, must match password
- Company input — `locator('#company')` — required field
- Telephone input — `locator('#telephone-number')` — required field
- Company address input — `locator('#company-address')` — required field
- Function/Department select — `locator('#function-department')` — react-select dropdown
- Region select — `locator('#region')` — react-select dropdown, defaults to "North America"
- Create Account button — `getByRole('button', { name: /create account/i })` — submit action
- Sign in link — `getByRole('link', { name: /sign in/i })` — redirects to login page
- Error message — `getByRole('alert')` — generic validation error
- Password weak error — `getByText(/at least 8 characters/i)` — password too short
- Password mismatch error — `getByText(/passwords do not match/i)` — passwords don't match
- Email exists error — `getByText(/email already registered/i)` — duplicate email

## Actions
- Navigate to register page — `goto()`
- Fill first name — `fillFirstName(value)`
- Fill last name — `fillLastName(value)`
- Fill email — `fillEmail(value)`
- Fill password — `fillPassword(value)`
- Fill confirm password — `fillConfirmPassword(value)`
- Fill company — `fillCompany(value)`
- Fill telephone — `fillTelephone(value)`
- Fill company address — `fillCompanyAddress(value)`
- Select function/department — `selectFunctionDepartment(value)` (clicks react-select, selects option)
- Select region — `selectRegion(value)` (clicks react-select, selects option)
- Click Create Account — `clickCreateAccount()`
- Complete registration flow — `register(data)` (accepts object with all fields, fills conditionally, clicks Create Account)

## Notes
- React SPA — requires JavaScript to render form elements
- All required fields marked with * asterisk
- Password must be at least 8 characters
- Function/Department and Region use react-select dropdown components — select via `getByRole('option')`
- Region defaults to "North America"
- Error messages appear after form submission for invalid data
