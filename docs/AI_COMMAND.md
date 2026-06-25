# Context
I have an existing web application with a "Master Data" page that manages products. I need to add a new "Master Category" page to manage product categories dynamically, and I also need to update the behavior of several input fields on the existing "Add/Edit Product" form.

# Task Requirements

## 1. Navigation & New Page (Master Category)
- **Navbar Update**: Add a new tab called **"Master Category"** next to the existing "Master Data" tab.
- **New Page Creation**: Create the "Master Category" page strictly following the existing UI/UX, layout, and component structures of the "Master Data" (Products) page.
  - **Header**: "Categories (Master Data)"
  - **Top Actions**: Include a "Create New Category" button (styled exactly like the "Create New Product" button).
  - **Search & Filter**: Search bar, Status filter (Publish / Draft), "Filter" and "Clear" buttons.
  - **Data Table**: Columns `NO`, `CATEGORY NAME`, `STATUS`, `ACTIONS` (Edit outline button and Delete red solid button matching current styles).

## 2. Form Input Adjustments (Add/Edit Product)
Please update the UI and behavior of the following fields in the product form:
- **Number Inputs (SDP, Page Price, SRP, Global Quantity)**: 
  - **Empty Default State**: Remove the default `0` or `1` values. When creating a new entry, these fields must start completely empty.
  - **Remove Spinners**: Hide the default HTML up/down arrows (spin buttons) on all number input fields (e.g., using CSS `appearance: none;` or similar Tailwind utility).
  - **Add Placeholders**: 
    - For Pricing inputs (SDP, Page Price, SRP): add `placeholder="e.g. RM 200"`.
    - For Global Quantity input: add `placeholder="e.g. 10"`.
- **Status Dropdown**:
  - Remove the default pre-selected value (currently defaults to "Publish").
  - The dropdown should start unselected with a default placeholder option like `-- Select Status --`.

## 3. Data Integration
- The categories created and managed on the new "Master Category" page must directly populate the "Category" dropdown options in the existing "Base Product Details" form (Add/Edit Product page).

## 4. Styling & Responsiveness Constraints
- **Theme Support**: The new page and components MUST fully support both Dark Mode and Light Mode. Reuse the existing CSS/Tailwind variables or classes that govern the current theme.
- **Mobile Responsiveness**: Ensure the table, search filters, and layout collapse gracefully on mobile devices, matching the behavior of the existing Master Data page.
- **Component Reusability**: Do not invent new UI components. Reuse the existing table, button, input, and modal/form components currently utilized in the `Master Data` page to ensure 100% visual consistency.