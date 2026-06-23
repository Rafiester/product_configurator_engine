# Import & Export Guidelines

## Import Excel Format
Admins can batch upload Product Master Data via `.xlsx`, `.xls`, or `.csv` files. The system uses robust parsing mechanisms to strip currency strings and numeric padding natively.

### Required Columns
```txt
Category
Product
Qty
SDP
Total SDP
Page Price
SRP
Margin ($)
Margin (%)
```
*Note: Computed columns like Total SDP and Margins present in the Excel file are intentionally ignored during ingestion to protect the mathematical integrity of the system.*

### Duplicate Checking
Duplicates are skipped entirely. The system performs memory-cached duplicate checking by asserting:
- Exact case-insensitive match on normalized `Category`
- Exact case-insensitive match on normalized `Product Name`
Whitespace collapses are handled automatically to prevent subtle duplication errors (e.g. `" GPU"` vs `"GPU"`).

## Export Excel Format
Export uses the exact same template structure above. It fetches the active database logic and dynamically processes the missing formulas on-the-fly to populate `Total SDP`, `Margin ($)`, and `Margin (%)` for Excel users to analyze safely. 

It strips away native app text representations (like `RM` and `%`) and replaces them with strict native Excel NumberFormats for ease of spreadsheet manipulation.
