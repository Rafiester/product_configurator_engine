# Project Overview

## Why this app exists
Managing PC configurations across multiple components quickly becomes a logistical nightmare when done purely through spreadsheets. The PC Builder CMS centralizes component data to allow dynamic building, accurate margin tracking, and synchronized updates across multiple packages.

## Main business problem
Sales teams and system builders often face inconsistent pricing or outdated component options. Traditional spreadsheets are prone to user error, duplicate entries, and broken formulas.

## Difference from normal CMS
Instead of managing purely frontend content like blog posts, this CMS is heavily geared towards calculated data management. It focuses entirely on `Products` and `Builders`, merging them seamlessly through a dynamic Builder spreadsheet-style interface inside the app itself.

## How it replaces spreadsheet-heavy workflow
- **Single Source of Truth**: All component details (Page Price, SRP, SDP) are maintained safely in the database.
- **Formula Safety**: Users can no longer accidentally break calculation formulas (Margin, Margin %, Total SDP). The backend cleanly computes and enforces these.
- **Controlled Exports**: Users still get the flexibility of exporting to fully-formatted Excel files for localized reporting without touching the source constraints.
