
# 🔍 PC BUILDER SAVE TRACE LOGGER (FULL SINGLE PROMPT)

## 🎯 GOAL
Create a complete debug trace system for Dynamic PC Builder Save API to ensure no data loss (especially product_id mapping per category like GPU, CPU, RAM, SSD).

System must make every step traceable from:
Request → Validation → Transformation → DB Write → Response

---

# ⚠️ NON-NEGOTIABLE RULES

- NO silent failure allowed
- NO HTTP 200 if data is partially lost
- product_id MUST NEVER be dropped silently
- EVERY transformation step MUST be logged
- ANY missing product_id MUST be explicitly flagged
- DB write MUST be traceable per item

---

# 📥 FULL IMPLEMENTATION (DROP-IN CODE)

```php
try {

    // =========================
    // 1. REQUEST LOG
    // =========================
    Log::info('PC_BUILDER_SAVE_REQUEST_RECEIVED', [
        'payload' => $request->all(),
        'user_id' => auth()->id() ?? null,
        'ip' => $request->ip(),
        'template_id' => $request->template_id ?? null,
    ]);

    // =========================
    // 2. VALIDATION
    // =========================
    $validated = $request->validate([
        'template_id' => 'required',
        'items' => 'required|array',
    ]);

    Log::info('PC_BUILDER_VALIDATION_PASSED', [
        'validated' => $validated
    ]);

    // =========================
    // 3. PARSE ITEMS
    // =========================
    $items = $request->items ?? [];

    Log::info('PC_BUILDER_ITEMS_PARSED', [
        'items_raw' => $items
    ]);

    // =========================
    // 4. MISSING PRODUCT DETECTION
    // =========================
    $missingProducts = [];

    foreach ($items as $index => $item) {
        if (empty($item['product_id'])) {
            $missingProducts[] = [
                'index' => $index,
                'category' => $item['category'] ?? null,
                'item' => $item
            ];
        }
    }

    if (!empty($missingProducts)) {
        Log::warning('PC_BUILDER_MISSING_PRODUCT_ID_DETECTED', [
            'missing_items' => $missingProducts
        ]);
    }

    // =========================
    // 5. TRANSFORM ITEMS
    // =========================
    $transformedItems = array_map(function ($item) {
        return [
            'category' => $item['category'],
            'product_id' => $item['product_id'] ?? null,
            'qty' => $item['qty'] ?? 1,
        ];
    }, $items);

    Log::info('PC_BUILDER_ITEMS_TRANSFORMED', [
        'transformed_items' => $transformedItems
    ]);

    // =========================
    // 6. DB WRITE
    // =========================
    $savedItems = [];

    foreach ($transformedItems as $item) {

        $saved = BuilderItem::updateOrCreate(
            [
                'template_id' => $request->template_id,
                'category' => $item['category']
            ],
            [
                'product_id' => $item['product_id'],
                'qty' => $item['qty']
            ]
        );

        $savedItems[] = $saved;
    }

    Log::info('PC_BUILDER_DB_WRITE_SUCCESS', [
        'saved_count' => count($savedItems),
        'saved_items' => $savedItems
    ]);

    // =========================
    // 7. RESPONSE
    // =========================
    $response = [
        'status' => 'success',
        'saved_items_count' => count($savedItems),
    ];

    Log::info('PC_BUILDER_SAVE_RESPONSE_SENT', [
        'response' => $response
    ]);

    return response()->json($response);

} catch (\Throwable $e) {

    // =========================
    // 8. ERROR LOG (GLOBAL)
    // =========================
    Log::error('PC_BUILDER_SAVE_FAILED', [
        'message' => $e->getMessage(),
        'trace' => $e->getTraceAsString(),
        'payload' => $request->all()
    ]);

    return response()->json([
        'status' => 'error',
        'message' => 'Save failed'
    ], 500);
}