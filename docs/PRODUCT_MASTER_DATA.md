# Product Master Data

The Product Master Data module is the core component repository for the application.

## Core Fields
- **Category**: Determines the grouping in the Configurator Builder.
- **Product Name**: The display name of the component.
- **Qty**: Base quantity.
- **SDP**: Standard Dealer Price.
- **Page Price**: The retail price displayed to the end-user.
- **SRP**: Suggested Retail Price.
- **Status**: Publish or Unpublish.

## Calculated Logistics
Calculations like Total SDP, Margin, and Margin Percentage are purely derived data points and are never inherently saved as isolated inputs in Master Data. 
```txt
Total SDP = Quantity × SDP
```

## Excel Interactions
- **Import Excel Behavior**: Users can upload spreadsheets. The system enforces strict numeric cleansing (removing `RM`, `%`, and `,`) and ensures duplicates are skipped safely using normalized memory-checking algorithms.
- **Export Excel Behavior**: Exports all products into a cleanly formatted, styled `.xlsx` file, calculating `Total SDP`, `Margin`, and `Margin %` cleanly for the export payload.

## Duplicate Checking Rules
A product is considered an existing duplicate if it matches:
```txt
Same Normalized Category + Same Normalized Product Name
```
Normalization includes stripping excess spaces, trimming, and performing strict case-insensitive comparisons in-memory to maintain compatibility across SQLite and Postgres databases.
