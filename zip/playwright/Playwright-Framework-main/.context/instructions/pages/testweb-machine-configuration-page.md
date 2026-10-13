# Test Web Machine Configuration Page

## URL
This is a panel/section within the `/installation-system` page (relative to Test Web Portal base URL `https://testweb.configurator.dev.pemnet.ai`). It appears after clicking "Compare / Configure Solutions" then "Configure Solution" on a selected solution card.

## Precondition
- User has selected at least one solution on the installation system page
- User clicked "Compare / Configure Solutions" button to view comparison cards
- User clicked "Configure Solution" button on a specific solution card

## Elements

### Configuration Panel Header
- Panel heading — `locator('div.text-xs:has-text("Configure solution")').first()` — heading text "Configure solution" followed by solution name
- Panel close button — `getByRole('button', { name: 'Close' })` — × close button
- Filters heading — `locator('div.text-xs.font-semibold:has-text("Filters")').first()` — "Filters" section heading
- Fastener group select — `locator('label:has-text("Fastener group") + select')` — dropdown, default "All"
- Feeder tracks select — `locator('label:has-text("Feeder tracks") + select')` — dropdown, default "All"
- Force (kN) range select — `locator('label:has-text("Force") + select')` — range select with min/max values
- Filtered info text — `getByText('Filtered by product, fastener group, feeder tracks, and force').first()` — filter description

### Available Machine Options
- Machine options heading — `getByText('Available machine options')` — section heading

#### Machine Section
- Machine section heading — `locator('div.text-xs.font-semibold.tracking-wide.uppercase:has-text("Machine")').first()` — uppercase "Machine"
- Option cards with name, price, part number, description, product/subcategory tags, fastener group, feeder tracks, force kN, and "Add to configuration" button

#### Options Section
- Options section heading — `locator('div.text-xs.font-semibold.tracking-wide.uppercase:has-text("Options")').first()` — uppercase "Options"
- Accessory option cards

#### Custom Tooling Section
- Custom Tooling section heading — `locator('div.text-sm.font-semibold:has-text("Custom Tooling")').first()` — "Custom Tooling"
- Custom Tooling card — `locator('section:has-text("Custom Tooling")').first()` — card with description placeholder

### Configuration Summary
- Configuration summary heading — `getByText('Configuration summary')`
- Selected options total — `getByText('Selected options total')` — total price display
- Download quotation button — `getByRole('button', { name: 'Download quotation', exact: true })`
- Download Word button — `getByRole('button', { name: 'Download Word', exact: true })`
- Add manual line item button — `getByRole('button', { name: 'Add manual line item', exact: true })`
- Request Quotation / Support button — `getByRole('button', { name: 'Request Quotation / Support', exact: true })`

## Actions
- Check if panel is visible — `isPanelVisible()`
- Close the configuration panel — `closePanel()`
- Get panel heading text — `getPanelHeadingText()`
- Select fastener group filter — `selectFastenerGroup(option)` (selects option by value)
- Select feeder tracks filter — `selectFeederTracks(option)` (selects option by value)
- Get count of visible machine option cards — `getMachineOptionCount()`
- Check if a specific option is visible — `isMachineOptionVisible(optionName)`
- Get selected options total text — `getSelectedOptionsTotal()`
- Check if download quotation is visible — `isDownloadQuotationVisible()`
- Check if download Word is visible — `isDownloadWordVisible()`
- Check if add manual line item is visible — `isAddManualLineItemVisible()`
- Check if request quotation is visible — `isRequestQuotationVisible()`
- Check if custom tooling is visible — `isCustomToolingVisible()`

## Notes
- React SPA — all within the same page
- Requires authentication — all 4 test web roles can access
- No `data-test` attributes — use role selectors, label text, and text content
- Pricing shown in USD by default for NA region
- Options are filtered by product, fastener group, feeder tracks, and force range
- Force range select may be a dropdown or slider depending on implementation
