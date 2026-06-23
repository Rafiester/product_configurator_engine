<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Str;

class ProductImportService implements ToCollection, WithHeadingRow
{
    public $summary = [
        'processed' => 0,
        'added' => 0,
        'skipped' => 0,
        'failed' => 0,
        'errors' => []
    ];

    private $existingProducts = null;

    public function collection(Collection $rows)
    {
        // Load all existing products into memory for duplicate checking
        $this->existingProducts = Product::select('category', 'name')->get()->map(function($p) {
            return strtolower(preg_replace('/\s+/', ' ', trim($p->category))) . '|||' . 
                   strtolower(preg_replace('/\s+/', ' ', trim($p->name)));
        })->flip();

        foreach ($rows as $index => $row) {
            $this->summary['processed']++;

            $category = $this->parseString($row['category'] ?? null);
            $name = $this->parseString($row['product'] ?? null);

            // Ignore fully empty rows
            if (empty($category) && empty($name) && empty($row['qty']) && empty($row['sdp'])) {
                $this->summary['processed']--;
                continue;
            }

            // Validate required fields
            if (empty($category) || empty($name)) {
                $this->summary['failed']++;
                $this->summary['errors'][] = "Row " . ($index + 2) . ": Missing category or product name.";
                continue;
            }

            $qty = $this->parseNumeric($row['qty'] ?? 1);
            $sdp = $this->parseNumeric($row['sdp'] ?? 0);
            $pagePrice = $this->parseNumeric($row['page_price'] ?? 0);
            $srp = $this->parseNumeric($row['srp'] ?? 0);

            if (!is_numeric($qty) || !is_numeric($sdp) || !is_numeric($pagePrice) || !is_numeric($srp)) {
                $this->summary['failed']++;
                $this->summary['errors'][] = "Row " . ($index + 2) . ": Invalid numeric value (Product: $name).";
                continue;
            }

            // Duplicate check
            // Normalize spaces and lowercase for comparison
            $normalizedCategory = strtolower(preg_replace('/\s+/', ' ', trim($category)));
            $normalizedName = strtolower(preg_replace('/\s+/', ' ', trim($name)));
            $key = $normalizedCategory . '|||' . $normalizedName;

            if ($this->existingProducts->has($key)) {
                $this->summary['skipped']++;
                continue;
            }

            // Insert new product
            Product::create([
                'category' => $category, // Original casing
                'name' => $name,         // Original casing
                'qty' => $qty,
                'sdp' => $sdp,
                'page_price' => $pagePrice,
                'srp' => $srp,
                'status' => 'publish',
            ]);

            // Add to existing products cache
            $this->existingProducts->put($key, true);

            $this->summary['added']++;
        }
    }

    private function parseString($value)
    {
        return $value ? trim($value) : '';
    }

    private function parseNumeric($value)
    {
        if (is_numeric($value)) {
            return (float) $value;
        }

        if (is_string($value)) {
            // Remove 'RM', spaces, and commas
            $clean = str_ireplace('RM', '', $value);
            $clean = str_replace(',', '', $clean);
            $clean = trim($clean);
            
            if (is_numeric($clean)) {
                return (float) $clean;
            }
        }

        return null;
    }
}
