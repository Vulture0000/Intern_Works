# Test Web Login Page

## URL
`/login` (relative to Test Web Portal base URL `https://testweb.configurator.dev.pemnet.ai`)

## Elements
- Email textbox — `getByRole('textbox', { name: /email/i })` — form field
- Password textbox — `getByRole('textbox', { name: /password/i })` — form field (appears after clicking password instead)
- Sign In button — `locator('form').getByRole('button', { name: /sign in/i })` — submit action within form
- Password instead button — `getByRole('button', { name: /sign in with a password instead/i })` — switches from magic link to password mode
- Send Code button — `getByRole('button', { name: /send code/i })` — magic link flow
- Error message — `getByRole('alert')` — displayed after failed login

## Actions
- Navigate to login page — `goto()`
- Fill email — `fillEmail(value)` (takes string value)
- Fill password — `fillPassword(value)` (takes string value)
- Click Sign In button — `clickSignIn()`
- Complete login flow — `login(email, password)` (fills email, clicks password instead, fills password, clicks sign in)
- Get error message text — `getErrorText()` (after failed login)

## Notes
- Page is a React SPA — requires JavaScript to render form elements
- Default flow shows magic link option; password mode activated via "sign in with a password instead" button
- Successful login redirects to `/` (landing page)
- Error message uses `getByRole('alert')` selector — not text content matching
