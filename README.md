# PC Configurator CMS

## Description
A lightweight internal CMS for managing PC component master data, configurator templates, pricing, and margin calculations.

## Main Purpose
This application helps internal admin users effortlessly manage PC build options, live calculate pricing, and review margins without the manual burden of maintaining hundreds of product combinations in legacy spreadsheets.

## Core Features
- Product Master Data CRUD
- Excel import for master data
- Excel export for master data
- Configurator management
- Dynamic PC Builder spreadsheet
- Live pricing calculation
- Margin and margin percentage calculation
- Publish / Unpublish status toggles
- Dark mode and light mode support
- Pastel pink SaaS design system
- Custom toast notification system

## Quick Setup

```bash
# Clone the repository and install dependencies
composer install
npm install

# Setup environment variables
cp .env.example .env
php artisan key:generate

# Run migrations (and seeders if applicable)
php artisan migrate

# Compile frontend assets
npm run build
# OR run the dev server: npm run dev

# Start the local PHP development server
php artisan serve
```

## Documentation

For deep technical details, architectures, and guidelines, please refer to the documentation in the `/docs` folder:

- [Overview](docs/OVERVIEW.md)
- [Features Details](docs/FEATURES.md)
- [Setup Instructions](docs/SETUP.md)
- [Database Structure](docs/DATABASE.md)
- [Product Master Data](docs/PRODUCT_MASTER_DATA.md)
- [Configurator Builder](docs/CONFIGURATOR_BUILDER.md)
- [Import/Export Guidelines](docs/IMPORT_EXPORT.md)
- [Design System](docs/DESIGN_SYSTEM.md)
- [Dark Mode Logic](docs/DARK_MODE.md)
- [Notification System](docs/NOTIFICATION_SYSTEM.md)
- [Testing Checklist](docs/TESTING_CHECKLIST.md)
- [AI Workflow & Rules](docs/AI_WORKFLOW.md)

## Current Status
The CMS is currently fully functional with core Master Data and Configurator logic integrated, complete with advanced Excel Import/Export capabilities and a robust SaaS-style pastel pink UI supporting dynamic dark mode.
