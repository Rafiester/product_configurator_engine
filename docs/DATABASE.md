# Database Structure

## `users`
Standard Laravel users table used for managing administrator access.
- `id`
- `name`
- `email`
- `password`

## `products`
The main repository for Product Master Data.
- `id` (UUID)
- `category` (String)
- `name` (String)
- `qty` (Integer)
- `sdp` (Decimal)
- `page_price` (Decimal)
- `srp` (Decimal)
- `status` (Enum: publish, unpublish)
- `deleted_at` (SoftDeletes)
- `timestamps`

## `configurators`
Stores the high-level PC package templates.
- `id` (UUID)
- `name` (String)
- `description` (Text)
- `status` (Enum: publish, unpublish)
- `deleted_at` (SoftDeletes)
- `timestamps`

## `configurator_product_mappings`
The pivot table linking `configurators` to their selected `products`. It operates dynamically as the storage backend for the PC Builder spreadsheet UI.
- `id` (UUID)
- `configurator_id` (Foreign Key -> configurators.id)
- `product_id` (Foreign Key -> products.id)
- `category` (String) - Cached for grouping
- `qty` (Integer)
- `sdp` (Decimal)
- `total_sdp` (Decimal)
- `page_price` (Decimal)
- `srp` (Decimal)
- `margin` (Decimal)
- `margin_percentage` (Decimal)

*Note: For historical tracking and builder snapshots, pricing is snapshotted into this mapping table at the time of configuration save, preventing historical configurations from changing unexpectedly if Master Data is updated.*
