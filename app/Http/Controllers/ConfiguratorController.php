<?php

namespace App\Http\Controllers;

use App\Models\Configurator;
use Illuminate\Http\Request;

class ConfiguratorController extends Controller
{
    public function index()
    {
        $configurators = Configurator::with('products')->latest()->paginate(10);
        $allCategories = \App\Models\Product::select('category')->distinct()->pluck('category');
        $allProductsByCategory = \App\Models\Product::where('status', 'active')->get()->groupBy('category');
        
        return view('configurators.index', compact('configurators', 'allCategories', 'allProductsByCategory'));
    }

    public function create()
    {
        return view('configurators.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|string|in:active,inactive',
        ]);

        Configurator::create($validated);
        return redirect()->route('configurators.index')->with('success', 'Configurator created successfully.');
    }

    public function show(string $id)
    {
        // Not used
    }

    public function edit(Configurator $configurator)
    {
        $configurator->load('products');
        $allProductsByCategory = \App\Models\Product::where('status', 'active')->get()->groupBy('category');
        return view('configurators.edit', compact('configurator', 'allProductsByCategory'));
    }

    public function update(Request $request, Configurator $configurator)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|string|in:active,inactive',
        ]);

        $configurator->update($validated);
        return redirect()->route('configurators.index')->with('success', 'Configurator updated successfully.');
    }

    public function syncProducts(Request $request, Configurator $configurator)
    {
        try {
            // =========================
            // 1. REQUEST LOG
            // =========================
            \Log::info('PC_BUILDER_SAVE_REQUEST_RECEIVED', [
                'payload' => $request->all(),
                'user_id' => auth()->id() ?? null,
                'ip' => $request->ip(),
                'configurator_id' => $configurator->id,
            ]);

            // =========================
            // 2. VALIDATION
            // =========================
            $validated = $request->validate([
                'selections' => 'present|array',
                'selections.*.category' => 'required|string',
                'selections.*.product_id' => 'nullable|exists:products,id',
                'selections.*.qty' => 'required|integer|min:1',
                'selections.*.sdp' => 'nullable|numeric',
                'selections.*.total_sdp' => 'nullable|numeric',
                'selections.*.page_price' => 'nullable|numeric',
                'selections.*.srp' => 'nullable|numeric',
                'selections.*.margin' => 'nullable|numeric',
                'selections.*.margin_percentage' => 'nullable|numeric',
            ]);

            \Log::info('PC_BUILDER_VALIDATION_PASSED', [
                'validated' => $validated
            ]);

            // =========================
            // 3. PARSE ITEMS
            // =========================
            $items = $request->selections ?? [];

            \Log::info('PC_BUILDER_ITEMS_PARSED', [
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
                \Log::warning('PC_BUILDER_MISSING_PRODUCT_ID_DETECTED', [
                    'missing_items' => $missingProducts
                ]);

                // As per trace-logs.md: NO HTTP 200 if data is partially lost, NO silent failure
                return response()->json([
                    'success' => false,
                    'message' => 'Data loss detected: Missing product_id in payload.',
                    'missing_items' => $missingProducts
                ], 422);
            }

            // =========================
            // 5. TRANSFORM ITEMS
            // =========================
            $syncData = [];
            foreach ($items as $selection) {
                if (!empty($selection['product_id']) && $selection['qty'] > 0) {
                    $syncData[$selection['product_id']] = [
                        'id' => \Illuminate\Support\Str::uuid()->toString(),
                        'product_id' => $selection['product_id'],
                        'category' => $selection['category'],
                        'qty' => $selection['qty'],
                        'sdp' => $selection['sdp'] ?? 0,
                        'total_sdp' => $selection['total_sdp'] ?? 0,
                        'page_price' => $selection['page_price'] ?? 0,
                        'srp' => $selection['srp'] ?? 0,
                        'margin' => $selection['margin'] ?? 0,
                        'margin_percentage' => $selection['margin_percentage'] ?? 0,
                    ];
                }
            }

            \Log::info('PC_BUILDER_ITEMS_TRANSFORMED', [
                'transformed_items' => $syncData
            ]);

            // =========================
            // 6. DB WRITE
            // =========================
            $savedItems = [];

            foreach ($syncData as $item) {
                $saved = \App\Models\ConfiguratorProductMapping::updateOrCreate(
                    [
                        'configurator_id' => $configurator->id,
                        'category' => $item['category']
                    ],
                    [
                        'product_id' => $item['product_id'],
                        'qty' => $item['qty'],
                        'sdp' => $item['sdp'],
                        'total_sdp' => $item['total_sdp'],
                        'page_price' => $item['page_price'],
                        'srp' => $item['srp'],
                        'margin' => $item['margin'],
                        'margin_percentage' => $item['margin_percentage'],
                    ]
                );

                $savedItems[] = $saved;
            }

            // Also, we must delete any categories that were unselected (if the user removed them)
            // so we don't end up with orphaned old selections.
            $categoriesInPayload = array_column($syncData, 'category');
            \App\Models\ConfiguratorProductMapping::where('configurator_id', $configurator->id)
                ->whereNotIn('category', $categoriesInPayload)
                ->delete();

            \Log::info('PC_BUILDER_DB_WRITE_SUCCESS', [
                'saved_count' => count($savedItems),
                'saved_items' => $savedItems
            ]);

            // =========================
            // 7. RESPONSE
            // =========================
            $response = [
                'success' => true,
                'saved_items_count' => count($syncData),
            ];

            \Log::info('PC_BUILDER_SAVE_RESPONSE_SENT', [
                'response' => $response
            ]);

            return response()->json($response);

        } catch (\Throwable $e) {
            // =========================
            // 8. ERROR LOG (GLOBAL)
            // =========================
            \Log::error('PC_BUILDER_SAVE_FAILED', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'payload' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Save failed'
            ], 500);
        }
    }

    public function destroy(Configurator $configurator)
    {
        $configurator->delete();
        return redirect()->route('configurators.index')->with('success', 'Configurator deleted successfully.');
    }
}
