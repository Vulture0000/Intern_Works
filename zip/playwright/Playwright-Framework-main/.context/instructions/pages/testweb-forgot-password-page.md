# Test Web Forgot Password Page

## URL
`/forget-password` (relative to Test Web Portal base URL `https://testweb.configurator.dev.pemnet.ai`)

## Elements
- Page heading — `getByRole('heading', { name: /forgot password/i })` — h1 "Forgot password"
- Email input — `locator('#email')` — form field with placeholder "name@company.com"
- Send OTP button — `getByRole('button', { name: /send otp/i })` — triggers OTP delivery
- OTP input — `locator('#otp')` — uppercase input field for received OTP
- Sign in link — `getByRole('link', { name: /sign in/i })` — redirects to login page
- Success message — `getByText(/otp sent/i)` — shown after OTP is sent
- Error message — `getByRole('alert')` — shown on failure
- Description text — `getByText(/enter your registered email/i)` — instructional text

## Actions
- Navigate to forgot password page — `goto()`
- Fill email field — `fillEmail(value)`
- Click Send OTP button — `clickSendOtp()`
- Fill OTP field — `fillOtp(value)`
- Complete OTP request flow — `requestOtp(email)` (fills email + clicks Send OTP)

## Notes
- React SPA — requires JavaScript to render form elements
- OTP input field uses uppercase text transformation
- Email input has placeholder text "name@company.com"
- After receiving OTP, user enters it in the OTP field for verification
