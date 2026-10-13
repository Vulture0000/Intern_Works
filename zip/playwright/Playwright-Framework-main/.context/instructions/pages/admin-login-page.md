# Admin Login Page

## URL
`/login` (relative to Admin Portal base URL `https://admin.configurator.dev.pemnet.ai`)

## Elements
- Email address textbox — `getByRole('textbox', { name: /email address/i })` — form field
- Password textbox — `getByRole('textbox', { name: /password/i })` — form field (appears after clicking password instead)
- Sign In button — `getByRole('button', { name: /^sign in$/i })` — submit action
- Password instead button — `getByRole('button', { name: /sign in with a password instead/i })` — switches from magic link to password mode
- Send Code button — `getByRole('button', { name: /send code/i })` — magic link flow
- Error message — `getByRole('alert')` — displayed after failed login
- Heading — `getByRole('heading', { name: /sign in/i })` — page title

## Actions
- Navigate to login page — `goto()`
- Fill email address — `fillEmail(value)` (takes string value)
- Fill password — `fillPassword(value)` (takes string value)
- Click Sign In button — `clickSignIn()`
- Complete login flow — `login(email, password)` (fills email, clicks password instead, fills password, clicks sign in)
- Get error message text — `getErrorText()` (after failed login attempt)
- Check if error is visible — `isErrorVisible()`

## Notes
- Login form is server-rendered (not SPA)
- Default flow uses magic link (email only + Send Code); password mode activated via "sign in with a password instead" button
- Successful admin login redirects to `/users`
- Admin accounts are created by an administrator (shown below form)
- Error message uses `getByRole('alert')` selector
