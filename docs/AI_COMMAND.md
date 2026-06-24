🔥 CONFIGURATOR COLLAPSED CARD REDESIGN

Redesign the collapsed Configurator Card into a modern SaaS summary card.

OBJECTIVE
- Keep the spreadsheet builder exactly as-is when expanded.
- Only redesign the collapsed state.
- Do not modify any CRUD, save, update, delete, expand, collapse, calculations, margin logic, or backend functionality.
- UI changes only.

CARD LAYOUT

TOP ROW
Left:
- Configurator Name (large bold title)

Right:
- Last Updated label
- Example:
  Last Updated
  24 Jun 2026, 14:35

MIDDLE SECTION

Description text under configurator name.

Example:
"Gaming PC configuration optimized for high-performance gaming, streaming, content creation, and productivity workloads with balanced component selection and healthy profit margins."

Requirements:
- max 2 lines
- use line clamp
- muted text color
- support dark and light mode

BOTTOM SECTION

Left side:
Status Badge

Example:
● Active

Use existing pastel pink accent styling.

Below status:
Components: 9 | Avg Margin: 13.26% | Margin: RM 769

Requirements:
- Components count calculated from assigned products
- Avg Margin uses current configurator calculation
- Margin uses current total margin value
- Read-only summary only

Right side:
Action buttons aligned horizontally

[ Edit ]
[ Delete ]
[ Expand Builder ]

Requirements:
- All 3 buttons same height
- Same vertical alignment
- Positioned bottom-right
- Equal spacing between buttons

STYLE

Card:
- Larger padding
- Rounded corners (16px)
- Subtle border
- Soft SaaS shadow

Dark Mode:
- Matte black background
- Dark navy surface
- Pastel pink accent

Light Mode:
- White background
- Dark text
- Pastel pink accent

DO NOT:
- Change spreadsheet builder
- Change calculations
- Change save functionality
- Change database schema
- Change expand/collapse behavior

Only redesign the collapsed configurator card UI.