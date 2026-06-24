# Dashboard SaaS Enhancement (Safe Mode)

## Objective

Upgrade the Dashboard page into a modern SaaS-style dashboard while preserving all existing business logic.

IMPORTANT:

* DO NOT modify any Product CRUD logic.
* DO NOT modify any Configurator CRUD logic.
* DO NOT modify Save Configuration functionality.
* DO NOT modify Import Product functionality.
* DO NOT modify Export Product functionality.
* DO NOT modify margin calculations.
* DO NOT modify database schema.
* DO NOT modify API routes.
* DO NOT modify controllers, services, repositories, models, migrations, or validation rules.
* Dashboard must be READ-ONLY.
* Dashboard only consumes existing data.

This task is UI/Visualization only.

---

# Theme Support

Dashboard must fully support:

## Light Mode

Background:

* #FFFFFF

Cards:

* #FFFFFF

Text:

* #111827

Border:

* #E5E7EB

Accent:

* Pastel Pink (#F472B6)

---

## Dark Mode

Background:

* #0F1115

Cards:

* #171A21

Text:

* #F3F4F6

Border:

* #2A2F3A

Accent:

* Pastel Pink (#F472B6)

No pure black.

Use matte dark surfaces.

---

# Dashboard Layout

Create responsive dashboard layout:

---

[ KPI Cards Row ]

Products
Configurators
Average Margin %
Potential Revenue

---

[ Row 2 ]

Product Category Distribution
Margin Health

---

[ Row 3 ]

Top Configurators
Recent Activities

---

[ Row 4 ]

Quick Actions

---

Spacing:

* 24px between sections
* 16px card padding minimum
* Card radius 16px
* Soft shadow

---

# KPI Cards

Create 4 cards.

## Products

Display:

* Total Products

Example:
325

---

## Configurators

Display:

* Total Configurators
* Active count

Example:
28 Active

---

## Average Margin %

Display:

14.2%

Use existing margin data.

Do not recalculate business logic.

---

## Potential Revenue

Display:

RM 85,320

Based on existing configurator totals.

Read-only.

---

# Product Category Distribution

Create Donut Chart.

Categories:

* CPU
* GPU
* RAM
* SSD
* Motherboard
* PSU
* Chassis
* Cooler
* Accessories

Pastel Pink should be primary chart color.

Dark mode and light mode must both render correctly.

---

# Margin Health

Create Horizontal Bar Chart.

Show average margin percentage by category.

Examples:

GPU 18%
CPU 12%
RAM 15%
SSD 14%

Color rules:

> =15%
> green

10%-15%
pastel pink

<10%
orange

Visualization only.

No business logic changes.

---

# Top Configurators

Create ranking card.

Show Top 5 Configurators.

Columns:

* Name
* Margin
* Status

Example:

Gaming Pro
RM 769

Creator Build
RM 652

Read-only.

---

# Recent Activities

Create activity timeline.

Show latest:

* Product Created
* Product Updated
* Configurator Created
* Configurator Updated
* Import Product

If activity logs do not exist:

show placeholder state.

Do not create new database tables.

Do not create logging system.

---

# Quick Actions

Create action buttons.

* New Product
* New Configurator
* Import Products
* Export Master Data

Use existing routes only.

Do not change button functionality.

---

# UI Quality

Use SaaS design language:

* clean cards
* soft borders
* pastel pink accent
* modern spacing
* responsive layout
* no sticky components
* no nested scrolling
* no overflow issues

Dashboard should visually match:

* Product Master Data page
* Configurator page
* Dark Mode system
* White Mode system

---

# Safety Requirements

Before finishing:

Verify:

✓ Product Save still works

✓ Product Edit still works

✓ Product Delete still works

✓ Configurator Save still works

✓ Configurator CRUD still works

✓ Import Product still works

✓ Export Product still works

✓ Dark Mode still works

✓ White Mode still works

✓ No database changes

✓ No API changes

✓ No schema changes

Only dashboard UI should be affected.
