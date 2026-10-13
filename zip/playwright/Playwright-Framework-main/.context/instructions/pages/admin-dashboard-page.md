# Admin Dashboard Page

## URL
`/users` (relative to Admin Portal base URL `https://admin.configurator.dev.pemnet.ai`)

## Elements
- Page heading — `getByRole('heading', { level: 1 })` — varies by route (e.g. "All Users", "Roles Management")
- Sidebar — `locator('nav').first()` — main sidebar navigation
- Sidebar collapsible groups — `locator('nav button:has(svg.lucide-chevron-down)')` — group toggle buttons
- User menu button — `getByRole('button', { name: /john smith/i })` — dropdown in top-right corner
- Sign Out button — `getByRole('button', { name: /sign out/i })` — within user menu dropdown

### Sidebar Links
- Dashboard link — `getByRole('link', { name: /dashboard/i })`
- Analytics link — `getByRole('link', { name: /analytics/i })`
- Users link — `getByRole('link', { name: /^users$/i })`
- Roles link — `getByRole('link', { name: /roles/i })`
- Applications link — `getByRole('link', { name: /applications/i })`
- Tasks link — `getByRole('link', { name: /tasks/i })`
- Change Log link — `getByRole('link', { name: /change log/i })`
- SMTP link — `getByRole('link', { name: /smtp/i })`
- Profile link — `getByRole('link', { name: /profile/i })`

### Sidebar Collapsible Groups
- Machine group — `getByRole('button', { name: /machine/i })` — expands Machine Options, Products, etc.
- Fasteners group — `getByRole('button', { name: /fasteners/i })` — expands Fasteners section
- Tooling group — `getByRole('button', { name: /tooling/i })` — expands Tooling section
- Pricing group — `getByRole('button', { name: /pricing/i })` — expands Cost Models, etc.
- Calculations group — `getByRole('button', { name: /calculations/i })` — expands Calculations section
- Content group — `getByRole('button', { name: /content/i })` — expands Content section

## Actions
- Navigate to any admin route via URL — `goToPage(path)` (takes path string)
- Get current page heading text — `getHeadingText()` (returns h1 text)
- Check if current page is accessible — `isPageAccessible()` (verifies no 403/Access Denied/not found)
- Open user menu dropdown — `openUserMenu()` (clicks user menu button)
- Sign out — `signOut()` (opens user menu, clicks sign out)

## Notes
- All routes under the admin dashboard require authentication
- Unauthenticated users are redirected to `/login`
- Each page displays at minimum an h1 heading identifying the section
- Sidebar has collapsible groups for Machine, Fasteners, Tooling, Pricing, Calculations, and Content — each toggled by a button with a chevron icon
- User menu button targets "John Smith" test user name
