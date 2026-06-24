# Configurator Card Polish (Final SaaS Layout Refinement)

The configurator card is already close to the desired design. Apply ONLY the following UI refinements.

## Header Section

### Action Buttons
Current action buttons (Edit, Delete, Expand/Collapse Builder) feel too small and too far apart.

Adjust:

- Increase button height by ~10-15%
- Increase horizontal padding
- Increase font size slightly
- Reduce gap between buttons
- Keep all 3 buttons aligned on a single row
- Maintain pastel pink accent styling
- Preserve dark/light mode support

Desired visual hierarchy:

[ Edit ] [ Delete ] [ Expand Builder ]

Compact but premium SaaS appearance.

---

## Remove Builder Title

Delete:

"Dynamic PC Builder"

from the expanded section.

The spreadsheet/table itself already communicates the builder context.

No replacement title needed.

---

## Table Alignment

Currently the table starts too close to the card edges and does not visually align with the content above.

Adjust:

- Add left padding to table container
- Add right padding to table container
- Table content should align vertically with:
  - Configurator title
  - Description text
  - Status badge
  - Metrics row

Use approximately:

padding-left: 24px–32px
padding-right: 24px–32px

The table should feel like it belongs inside the same card layout.

---

## Table Breathing Space

Improve spacing inside the spreadsheet section.

Adjust:

### Header Row

Increase vertical padding:

- Category
- Product
- Qty
- SDP
- Total SDP
- Page Price
- SRP
- Margin
- Margin %

Need better readability.

---

### Data Rows

Increase row height slightly.

Target:

- More breathing room
- Cleaner SaaS dashboard appearance
- No cramped spreadsheet feeling

Do NOT make rows excessively tall.

---

## Grand Total Section

Keep current structure.

Only:

- Align with table padding
- Match left/right spacing of table
- Preserve current calculations
- Preserve current styling

---

## Important Constraints

DO NOT modify:

- Configurator CRUD logic
- Save Configuration logic
- Product selection logic
- Margin calculations
- Grand Total calculations
- Database schema
- API endpoints
- Expand/Collapse functionality

This task is UI spacing and visual polish only.

Goal:
Create a cleaner premium SaaS configurator card with better alignment, larger action buttons, improved spacing, and a more polished professional appearance.