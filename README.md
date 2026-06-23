# PC Configurator CMS (Laravel + Supabase)

## Overview

This project is a simple **internal CMS for PC configurator system**.

The goal is to avoid manually managing hundreds of product combinations by using a **master data + configurator mapping system**.

All pricing and product selection are dynamic and driven by master data.

---

# Tech Stack

* Backend: Laravel 12
* Frontend: Blade + Tailwind CSS + Alpine.js
* Database: Supabase PostgreSQL
* Auth: Laravel Authentication
* Hosting: Local / VPS (prototype first)
* UI/UX: Modern SaaS Admin Interface (Dark/Light mode, Pastel Pink #F9A8D4 accents)

---

# Core Concept

Instead of creating static product bundles, the system uses:

### 1. Master Data (Products)

Single source of truth for all PC components.

### 2. Configurators (U5 / U7 / U8 / 3060 / 5050)

Represents PC packages.

### 3. Mapping System

Controls which products appear in which configurator.

---

# Spreadsheet Reference (Current Logic)

Existing structure:

```text
Products (MASTER DATA)
U5
U7
U8
3060
5050
```

* `Products` = all components
* `U5/U7/U8` = configurator templates

---

# Database Structure

## 1. products (MASTER DATA)

Stores all components.

```sql
id uuid primary key
name text
category text
qty int
sdp numeric
page_price numeric
srp numeric
status text
created_at timestamp
updated_at timestamp
```

### Example:

| Category | Product   | SDP  | Page Price | SRP  |
| -------- | --------- | ---- | ---------- | ---- |
| GPU      | RTX 5070  | 2735 | 2899       | 2959 |
| RAM      | 32GB DDR5 | 900  | 1100       | 1200 |

---

## 2. configurators

Represents PC packages.

```sql
id uuid primary key
name text
base_price numeric
status text
created_at timestamp
updated_at timestamp
```

### Example:

* U5
* U7
* U8
* 3060
* 5050

---

## 3. configurator_product_mapping

Controls which products are available in each configurator.

```sql
id uuid primary key
configurator_id uuid
product_id uuid
category text
created_at timestamp
```

---

# Key Concept (IMPORTANT)

## DO NOT ADD CONFIGURATOR COLUMNS IN PRODUCTS TABLE

❌ Bad:

```
Product table contains U5, U7, U8 columns
```

✔ Good:

```
Use mapping table instead
```

---

# Mapping Logic Example

## Master Data contains:

* 20 GPUs
* 10 RAMs
* 8 SSDs

## U7 configurator allows only:

* 5 GPUs
* 4 RAMs
* 3 SSDs

### Mapping Example:

| Configurator | Category | Product     |
| ------------ | -------- | ----------- |
| U7           | GPU      | RTX 5060 Ti |
| U7           | GPU      | RTX 5070    |
| U7           | GPU      | RX 9070 XT  |
| U7           | RAM      | 32GB DDR5   |

---

# System Flow

```text
Admin Login
↓
Manage Products (Master Data)
↓
Create Configurator (U5 / U7 / U8)
↓
Assign Allowed Products (Mapping)
↓
Open Configurator Preview
↓
User selects components
↓
System calculates price dynamically
```

---

# Configurator UI Flow

The configurator flow is optimized to be short and accessible directly from the configurator card, eliminating the need to switch pages.

```text
Configurator Card
↓
Click "Expand Builder"
↓
Spreadsheet Dynamic PC Builder Table (Nested Product Manager)
↓
User selects components per category from dropdowns
↓
Auto-calculates prices dynamically
↓
Click "Save Configuration"
```

---

# Pricing Logic

```text
Total SDP = Sum of selected product SDP
Total Page Price = Sum of selected product Page Price
Total SRP = Sum of selected product SRP

Margin = Total Page Price - Total SDP
Margin % = Margin / Total Page Price * 100
```

---

# Rules

## 1. Single Source of Truth

All prices must come from `products` table only.

## 2. No duplication

Do not store product prices inside configurators.

## 3. Dynamic update

If product price changes in master data, all configurators update automatically.

## 4. Mapping-based system

Configurator only shows products assigned in mapping table.

---

# CMS Pages

## Dashboard

* Total Products
* Total Configurators
* Active Products

---

## Products Page (Master Data)

Fields:

* Name
* Category
* SDP
* Page Price
* SRP
* Status

Actions:

* Create
* Edit
* Delete

---

## Configurator Page

Fields:

* Name
* Base Price
* Status

Example:

* U5
* U7
* U8

---

## Dynamic PC Builder (Nested inside Configurators)

Replaces traditional multi-page forms with a familiar spreadsheet-like interface nested directly within the Configurator page.

Features:
* Inline dropdowns for strict product selection per category (GPU, RAM, CPU, etc.)
* Real-time calculation of pricing
* Shows:
  * Selected Components
  * Qty
  * Total SDP
  * Page Price
  * SRP
  * Margin
  * Margin %
* Admin does not need to switch pages to build a PC layout.

---

# Why This System

## Problem

Manual PC bundle pricing is:

* Hard to maintain
* Not scalable
* Error prone

## Solution

Use:

* Master data (products)
* Configurator (packages)
* Mapping table (relationships)

Result:

* Easy scaling
* Easy updates
* No duplicate pricing
* Clean architecture

---

# Future Upgrade (Optional)

* Excel import/export
* Bulk price update
* Product search/filter
* Customer-facing configurator
* Shopify integration
* API for frontend builder

---

# Final Goal

Build a scalable PC configurator CMS where:

* Admin only manages master data
* Configurators dynamically pull allowed products
* Pricing is always real-time and centralized

