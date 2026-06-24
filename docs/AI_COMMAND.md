# Configurator Layout Alignment & CTA Refinement

The configurator card is almost finished.

Apply the following visual alignment improvements only.

---

## 1. Table Horizontal Alignment

Currently the table starts too close to the card edges.

The table should align perfectly with the content above.

Use the same left/right gutter spacing as:

- Configurator title
- Description
- Status badge
- Metrics row

Target:

Card Content Padding:
- Left: 32px
- Right: 32px

Apply the same spacing to:

- Table header
- Table body
- Grand Total row
- Save Configuration section

Everything should sit on the same vertical grid.

---

## 2. Symmetrical Table Layout

Current table feels stretched edge-to-edge.

Add proper internal container padding.

Goal:

Title
Description
Metrics
Table
Grand Total
Save Button

must all share the exact same horizontal alignment.

No element should extend further left or right than the others.

---

## 3. Save Configuration Button Redesign

Current button styling does not match the SaaS theme.

Update Save Configuration button to use the same design language as:

- Collapse Builder button
- Edit button

Style:

Background:
Pastel Pink Accent

Examples:
#EC7AB7
#E97DB8

Text:
White

Font Weight:
600

Border Radius:
12px

Height:
44-48px

Padding:
16px 24px

Hover:
Slight brightness increase only

No blue tones.

---

## 4. Save Button Alignment

Align Save Configuration button with the table content width.

Current position feels detached from the spreadsheet.

Requirements:

- Keep button on bottom-right
- Respect same right gutter used by table
- Align with Margin % column edge
- Align with header content grid

Visual result should feel intentional.

---

## 5. Grand Total Row Alignment

Grand Total row must use the same left/right spacing as table content.

No columns should feel cramped against edges.

Especially:

- Margin
- Margin %
- Grand Total values

Need additional breathing room.

---

## 6. Do Not Change

DO NOT TOUCH:

- Save functionality
- CRUD functionality
- Configurator logic
- Margin calculations
- Product selection
- Database structure
- Expand / Collapse behavior
- Responsive behavior

UI alignment and styling only.

Goal:

Create a polished SaaS-grade configurator where:

- Title section
- Metrics section
- Table section
- Grand Total section
- Save button

all align on a consistent visual grid with premium spacing and pastel pink accent styling.