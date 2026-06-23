# UI Prompt — Cosmetic Currency & Percentage Formatting Only

Update the display formatting for pricing and margin values in the Product Master Data table and Dynamic PC Builder table.

This is a cosmetic UI formatting task only.

Do NOT change backend logic, database values, calculations, formulas, save logic, or numeric values.

---

## Objective

Make financial values easier to read by adding display prefixes/suffixes:

* Add `RM` before currency values
* Add `%` after percentage values

Important:

This must only affect the displayed text in the UI.

It must NOT change the actual numeric value used for calculation or saving.

---

## Currency Columns

Apply `RM` prefix to the displayed value in these columns:

* SDP (RM)
* Total SDP (RM)
* Page Price (RM)
* SRP (RM)
* Margin

---

## Percentage Column

Apply `%` suffix to the displayed value in:

* Margin %

---

## Display Examples

Currency display:

```text
RM 345.00
RM 1,350.00
RM 3,398.00
```

Percentage display:

```text
13.53%
10.08%
-30.26%
```

---

## Important Rule

Do NOT store `RM` or `%` in the database.

Do NOT send `RM` or `%` in form payloads.

Do NOT modify calculation logic.

Do NOT parse formatted text for calculations.

Formatting must happen only at the view/rendering layer.

---

## Calculation Must Stay The Same

Current calculations must remain unchanged:

```text
Total SDP = Quantity × SDP
Margin = Page Price - Total SDP
Margin % = (Margin / Page Price) × 100
```

Only the final displayed output should be formatted.

---

## Affected Areas

Apply this display formatting to:

1. Product Master Data table
2. Product create/edit preview if applicable
3. Configurator Dynamic PC Builder table
4. Grand Total row
5. Any summary cards that show these same values

---

## Format Rules

Use consistent formatting:

```text
RM {number}
{number}%
```

Numbers should keep 2 decimal places where currently used.

Example:

```text
RM 1,289.00
RM 900.00
RM 54.00
13.53%
```

---

## Zero / Empty Value Handling

If value is zero:

```text
RM 0.00
0.00%
```

If value is empty/null/unselected:

```text
-
```

Do not show:

```text
RM -
-% 
```

---

## Margin % Safety

If Page Price is 0, avoid displaying `NaN`, `Infinity`, or `#DIV/0`.

Show:

```text
-
```

or:

```text
0.00%
```

depending on existing UI convention.

Do not change the formula, only prevent ugly display output.

---

## Implementation Guidance

Create or reuse a helper/formatter function if possible:

```js
formatCurrency(value) => "RM 1,289.00"
formatPercent(value) => "13.53%"
```

or Laravel Blade helper if formatting is server-rendered.

The helper must return formatted strings only for display.

Raw numeric values must remain numeric internally.

---

## Strict DO NOT

Do NOT:

* Change database schema
* Change stored values
* Change calculations
* Change save logic
* Change validation rules
* Change product dropdown behavior
* Add RM/% into input values used for saving
* Break dark mode or light mode styling

---

## Final Expected Result

After implementation:

* Currency columns visually show `RM` before the number
* Margin % visually shows `%` after the number
* Calculations still work exactly the same
* Saved values remain clean numeric values
* UI looks closer to the spreadsheet reference
