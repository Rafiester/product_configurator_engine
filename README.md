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

## Installation & Deployment

This application supports multiple environments. Choose the setup guide that fits your needs:

1. **[🖥️ Local Development Setup](docs/DEPLOY_LOCAL.md)**  
   *For local development using `php artisan serve`, Laravel Valet, Herd, or Sail.*

2. **[🚀 VPS Server Deployment](docs/DEPLOY_SERVER.md)**  
   *For traditional production deployment on Ubuntu using Nginx and PHP-FPM.*

3. **[☁️ Vercel Serverless Deployment](docs/DEPLOY_VERCEL.md)**  
   *For serverless deployment using `vercel-php` and external databases.*

## Documentation

For deep technical details, architectures, and guidelines, please refer to the documentation in the `/docs` folder:

- [Overview](docs/OVERVIEW.md)
- [Features Details](docs/FEATURES.md)
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
