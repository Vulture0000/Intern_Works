# Admin SMTP Settings Page

## URL
`/smtp` (relative to Admin Portal base URL `https://admin.configurator.dev.pemnet.ai`)

## Elements
- Page heading (h1) — "SMTP"
- Page description — "Configure task notification emails and test SMTP delivery."
- Reload button — `getByRole('button', { name: /reload/i })` — reloads SMTP config
- Send Test button — `getByRole('button', { name: /send test/i })` — sends test email
- Save button — `getByRole('button', { name: /save/i })` — saves SMTP config

### Enabled Toggle
- Enabled checkbox/toggle — "Send task emails whenever a new RFQ task is created."
- Label text — "ENABLED"

### Secure SMTP Section
- Section heading — "SECURE SMTP"
- Note text — "Implicit TLS — managed by AWS SES (always on)."
- From Email input — `getByRole('textbox', { name: /from email/i })`
- From Name input — `getByRole('textbox', { name: /from name/i })`
- Test Recipient input — `getByRole('textbox', { name: /test recipient/i })`

### Relay Transport Section
- Section heading — "RELAY TRANSPORT"
- Relay URL input — `getByRole('textbox', { name: /relay url/i })`
- Relay Region input — `getByRole('textbox', { name: /relay region/i })`
- Default From Address — read-only text display
- Note text — "Default From Address is the relay's allowlisted sender..."

## Actions
- Navigate to SMTP settings page
- Toggle enabled/disabled
- Fill From Email
- Fill From Name
- Fill Test Recipient
- Click Reload
- Click Send Test
- Click Save
- Get enabled state

## Notes
- React SPA — requires authentication (admin role only)
- Task emails include RFQ snapshot, configured machine options, applications, and ZIP attachments
- When RFQ is submitted, system sends emails based on Responsibility Map mappings
