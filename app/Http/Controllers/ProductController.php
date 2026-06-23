<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Configurator;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('configurators')->latest();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('configurator')) {
            $query->whereHas('configurators', function ($q) use ($request) {
                $q->where('configurators.id', $request->configurator);
            });
        }

        $products = $query->paginate(10)->withQueryString();
        
        $categories = Product::select('category')->distinct()->pluck('category');
        $allConfigurators = Configurator::orderBy('name')->get();

        return view('products.index', compact('products', 'categories', 'allConfigurators'));
    }

    public function create()
    {
        $configurators = Configurator::orderBy('name')->get();
        return view('products.create', compact('configurators'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'qty' => 'required|integer|min:0',
            'sdp' => 'required|numeric|min:0',
            'page_price' => 'required|numeric|min:0',
            'srp' => 'required|numeric|min:0',
            'status' => 'required|string|in:active,inactive',
            'configurator_ids' => 'nullable|array',
            'configurator_ids.*' => 'exists:configurators,id',
            'configurator_qty' => 'nullable|array',
            'configurator_qty.*' => 'nullable|integer|min:1',
        ]);

        $product = Product::create($validated);

        $syncData = [];
        if (!empty($validated['configurator_ids'])) {
            foreach ($validated['configurator_ids'] as $configuratorId) {
                $qty = isset($validated['configurator_qty'][$configuratorId]) 
                        ? (int)$validated['configurator_qty'][$configuratorId] 
                        : 1;

                $syncData[$configuratorId] = [
                    'id' => Str::uuid(),
                    'category' => $product->category,
                    'qty' => $qty,
                    'sdp' => $product->sdp,
                    'total_sdp' => $product->sdp * $qty,
                    'page_price' => $product->page_price,
                    'srp' => $product->srp,
                ];
            }
        }
        $product->configurators()->sync($syncData);

        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }

    public function show(string $id)
    {
        // Not used
    }

    public function edit(Product $product)
    {
        $configurators = Configurator::orderBy('name')->get();
        $selectedConfigurators = $product->configurators->pluck('id')->toArray();
        return view('products.edit', compact('product', 'configurators', 'selectedConfigurators'));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'qty' => 'required|integer|min:0',
            'sdp' => 'required|numeric|min:0',
            'page_price' => 'required|numeric|min:0',
            'srp' => 'required|numeric|min:0',
            'status' => 'required|string|in:active,inactive',
            'configurator_ids' => 'nullable|array',
            'configurator_ids.*' => 'exists:configurators,id',
            'configurator_qty' => 'nullable|array',
            'configurator_qty.*' => 'nullable|integer|min:1',
        ]);

        $product->update($validated);

        $syncData = [];
        if (!empty($validated['configurator_ids'])) {
            foreach ($validated['configurator_ids'] as $configuratorId) {
                // Default qty to 1 if not specified
                $qty = isset($validated['configurator_qty'][$configuratorId]) 
                        ? (int)$validated['configurator_qty'][$configuratorId] 
                        : 1;

                $syncData[$configuratorId] = [
                    'id' => Str::uuid(),
                    'category' => $product->category,
                    'qty' => $qty,
                    'sdp' => $product->sdp,
                    'total_sdp' => $product->sdp * $qty,
                    'page_price' => $product->page_price,
                    'srp' => $product->srp,
                ];
            }
        }
        $product->configurators()->sync($syncData);

        return redirect()->route('products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
    }

    public function syncConfigurators(Request $request, Product $product)
    {
        $validated = $request->validate([
            'configurator_ids' => 'nullable|array',
            'configurator_ids.*' => 'exists:configurators,id',
        ]);

        $syncData = [];
        if (!empty($validated['configurator_ids'])) {
            foreach ($validated['configurator_ids'] as $configuratorId) {
                $syncData[$configuratorId] = [
                    'id' => Str::uuid(),
                    'category' => $product->category
                ];
            }
        }
        $product->configurators()->sync($syncData);

        $updatedConfigurators = $product->configurators()->get(['configurators.id', 'configurators.name']);

        return response()->json([
            'success' => true,
            'configurators' => $updatedConfigurators
        ]);
    }
}
