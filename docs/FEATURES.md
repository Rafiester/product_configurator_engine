# Features

## Products
Comprehensive CRUD (Create, Read, Update, Delete) management for PC components, allowing precise data entry for Category, Quantity, SDP, Page Price, and SRP.

## Master Categories
Dynamic category lookup management allowing admins to create, publish, and delete categories. Category name updates cascade automatically to all associated products and builder mappings.

## Builders
Administer high-level PC builds (e.g., "Gaming Build A", "Office Build B") which are then populated with precise product selections via the spreadsheet-style Builder interface.

## Dynamic PC Builder
A spreadsheet-style, fully interactive user interface powered by React. It groups available components by category in dropdowns, dynamically binds live pricing calculations, and saves the final matrix to the backend.

## Excel Import/Export
- **Import**: Allows administrators to seamlessly ingest large datasets from Excel. The system securely scans for duplicates using memory-caching and prevents accidental overwrites while handling numeric formatting sanitizations (stripping RM, %, commas).
- **Export**: One-click download of the entire Product Master Data into `.xlsx`. It computes formulas strictly on export and features automatic coloring and layout adjustments natively recognizable by Excel.

## Dark Mode
A meticulously curated Dark Mode implementation using a matte-black styling paradigm, seamlessly integrated with class-based tailwind configurations for a flash-free experience.

## Notifications
A custom, non-blocking SaaS-style toast notification system used across all CRUD actions, imports, and exports, fully eliminating jarring native browser alerts.

## Pricing Calculation
Strict calculation logic decoupled from database storage to prevent desyncing:
- **Total SDP** = `Quantity × SDP`
- **Margin ($)** = `Page Price - Total SDP`
- **Margin (%)** = `(Margin / Page Price) × 100`
