# Test Web Home Page

## URL
`/` (relative to Test Web Portal base URL `https://testweb.configurator.dev.pemnet.ai`)

## Elements
- Page heading — `page.locator('h1')` — main page heading
- Installation System button — `getByRole('button', { name: /find your installation system/i })` — navigates to configurator
- Sign In button — `getByRole('button', { name: /sign in/i })` — visible when not authenticated
- Register button — `getByRole('button', { name: /register/i })` — visible when not authenticated
- User menu button — `locator('button').filter({ hasText: /David Wilson|Michael Johnson|Emily Brown|Robert Davis/i }).first()` — user dropdown trigger
- Sign Out menu item — `getByRole('button', { name: /sign out/i })` — within user menu dropdown
- Brand link — Pemnet — `getByRole('link', { name: /pemnet/i })`
- Brand link — Profil Global — `getByRole('link', { name: /profil-global/i })`
- Brand link — Haeger — `getByRole('link', { name: /haeger/i })`
- Brand link — Autoriv — `getByRole('link', { name: /autoriv/i })`
- Brand link — Sherex — `getByRole('link', { name: /sherex/i })`

## Actions
- Navigate to home page — `goto()`
- Navigate to installation system configurator — `goToInstallationSystem()`
- Get current page heading text — `getHeadingText()`
- Click Sign In — `clickSignIn()`
- Click Register — `clickRegister()`
- Sign out — `signOut()` (opens user menu, clicks sign out)

## Notes
- Page is a React SPA — requires JavaScript execution
- Accessible without authentication (sign-in/register buttons visible); authenticated users see user menu and brand links
- Landing page shows product category options and navigation
- Brand links navigate to respective brand portal pages
- User menu button matches known test user names
