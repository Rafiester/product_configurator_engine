# Configurator Builder

## Concept
A "Configurator" is an overarching package or PC build (e.g., "Standard Office Build", "Ultra Gaming Rig"). The true power of the Configurator lies within its **Dynamic PC Builder** interface.

## Dynamic PC Builder
The builder is specifically designed as a spreadsheet-style matrix powered heavily by Alpine.js. It organizes data into categorized rows allowing precise product assignment.

**Important Note:** The builder UI is strictly spreadsheet-style. It should not be redesigned into blocky rules, layout chips, or standard web-forms. It must retain its data-dense spreadsheet UX.

### Features
- **Category Rows**: Automatically grouped by unique categories available in the Master Data.
- **Product Dropdowns**: Filtered to only display products belonging to that specific category.
- **Quantity Manipulation**: Live input fields.
- **Live Pricing Calculation**: Instantly updates totals across the row and grand totals at the bottom.

## Important Formulas
The following logic drives the live calculation matrix:
```txt
Total SDP = Quantity × SDP
Margin = Page Price - Total SDP
Margin % = (Margin / Page Price) × 100
```

## Save Configuration Behavior
Upon clicking "Save Configuration", the active matrix is parsed, and each active row is converted into a `configurator_product_mapping` record. All calculated fields are snapshotted into this pivot table ensuring historical stability of the configuration package.
