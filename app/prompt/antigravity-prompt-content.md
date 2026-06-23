# Documentation Cleanup & README Refactor

Refactor and organize all project documentation for this Laravel PC Configurator CMS.

This is a documentation-only task.

Do NOT change application code, backend logic, database schema, UI layout, routes, controllers, or Blade files.

---

## Goal

Clean up the repository documentation so it is easier to understand, maintain, and continue with AI-assisted development.

The current README should be rewritten into a simple high-level overview of the application and its core features.

Move deeper technical details into separate files inside the `/docs` folder.

---

## Required Documentation Structure

Create or update this structure:

```txt
README.md
docs/
├── OVERVIEW.md
├── FEATURES.md
├── SETUP.md
├── DATABASE.md
├── PRODUCT_MASTER_DATA.md
├── CONFIGURATOR_BUILDER.md
├── IMPORT_EXPORT.md
├── DESIGN_SYSTEM.md
├── DARK_MODE.md
├── NOTIFICATION_SYSTEM.md
├── TESTING_CHECKLIST.md
└── AI_WORKFLOW.md
```

---

## README.md Requirement

Rewrite README.md to be simple and product-focused.

README should include:

1. Project name
2. Short description
3. What the app is for
4. Core features
5. Tech stack
6. Quick setup summary
7. Documentation links
8. Current project status

Do NOT make README too long.

README should explain the app in simple terms:

* Product Master Data management
* Dynamic PC Builder / Configurator
* Pricing and margin calculation
* Excel import/export
* Dark mode with pastel pink accent
* SaaS-style admin UI

---

## Suggested README Content

Use this direction:

### Project Name

PC Configurator CMS

### Description

A lightweight internal CMS for managing PC component master data, configurator templates, pricing, and margin calculations.

### Main Purpose

This app helps internal admin users manage PC build options, calculate pricing, and review margins without manually maintaining hundreds of product combinations in spreadsheets.

### Core Features

* Product Master Data CRUD
* Excel import for master data
* Excel export for master data
* Configurator management
* Dynamic PC Builder spreadsheet
* Live pricing calculation
* Margin and margin percentage calculation
* Publish / Unpublish status
* Dark mode and light mode
* Pastel pink SaaS design system
* Custom toast notification system

---

## docs/OVERVIEW.md

Explain the project concept:

* Why this app exists
* Main business problem
* Difference from normal CMS
* How it replaces spreadsheet-heavy workflow

---

## docs/FEATURES.md

List all app features in detail:

* Products
* Configurators
* Dynamic PC Builder
* Excel import/export
* Dark mode
* Notifications
* Pricing calculation

---

## docs/SETUP.md

Include setup instructions:

* Clone repository
* Install Composer dependencies
* Install NPM dependencies
* Setup `.env`
* Run migration
* Run seeders if any
* Start local server
* Build frontend assets

Example commands:

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm run dev
php artisan serve
```

---

## docs/DATABASE.md

Document database tables:

* products
* configurators
* configurator_product_mapping or related mapping table
* users if relevant

Include:

* field names
* purpose
* relationships
* important notes

---

## docs/PRODUCT_MASTER_DATA.md

Document product module:

* Product fields
* Category
* Quantity
* SDP
* Total SDP
* Page Price
* SRP
* Status
* Import Excel behavior
* Export Excel behavior
* Duplicate checking rule

Important logic:

```txt
Total SDP = Quantity × SDP
```

---

## docs/CONFIGURATOR_BUILDER.md

Document configurator module:

* Configurator concept
* Dynamic PC Builder table
* Category rows
* Product dropdown by category
* Quantity
* Pricing columns
* Grand Total
* Save Configuration behavior

Include formulas:

```txt
Total SDP = Quantity × SDP
Margin = Page Price - Total SDP
Margin % = (Margin / Page Price) × 100
```

Explain that the builder is spreadsheet-style and should not be redesigned into rule blocks or chips.

---

## docs/IMPORT_EXPORT.md

Document:

* Import Excel format
* Export Excel format
* Required columns
* Duplicate checking
* Numeric parsing rules
* What gets skipped
* What gets inserted

Excel columns:

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

---

## docs/DESIGN_SYSTEM.md

Document UI system:

* Pastel pink accent
* Light mode color system
* Dark mode matte black color system
* Buttons
* Cards
* Tables
* Badges
* Pagination
* Spacing
* Typography

Primary accent:

```txt
Pastel Pink: #F9A8D4
Hover: #F472B6
Active: #EC4899
```

---

## docs/DARK_MODE.md

Document theme behavior:

* Light mode
* Dark mode
* `.dark` class strategy
* localStorage preference
* Common rules to avoid broken text color

Important rule:

```txt
Never use text-white globally unless the background is always dark.
Use text-gray-900 dark:text-gray-100 for normal text.
```

---

## docs/NOTIFICATION_SYSTEM.md

Document custom toast/modal system:

* Success toast
* Error toast
* Warning toast
* Delete confirmation modal
* No native alert/confirm/prompt

Important rule:

```txt
Do not use alert(), confirm(), or prompt().
Use the custom notification system instead.
```

---

## docs/TESTING_CHECKLIST.md

Create a checklist for manual testing:

Products:

* Create product
* Edit product
* Delete product
* Import Excel
* Export Excel
* Search/filter
* Light mode readability
* Dark mode readability

Configurator:

* Create configurator
* Edit details
* Expand builder
* Select products
* Change quantity
* Save configuration
* Confirm grand total
* Confirm margin calculation

Theme:

* Toggle dark/light mode
* Check text contrast
* Check buttons
* Check table readability

---

## docs/AI_WORKFLOW.md

Create rules for AI coding assistants.

Include:

* Do not redesign stable UI unless requested
* Do not change backend logic during styling tasks
* Always inspect existing files first
* Commit after completed task if tests pass
* Use conventional commits
* Keep README as product overview
* Keep technical notes inside docs

Example commit messages:

```txt
docs: refactor project documentation
docs: add configurator builder guide
docs: add import export documentation
```

---

## Documentation Style Rules

* Keep language simple
* Use clear headings
* Use tables where useful
* Avoid overengineering
* Avoid outdated prompt history in README
* Make documentation useful for future developer or AI assistant

---

## Final Expected Result

After this task:

* README.md becomes clean and product-focused
* `/docs` folder contains organized technical documentation
* Future AI assistants can understand the project faster
* Documentation is easier to maintain
* No application code is changed
