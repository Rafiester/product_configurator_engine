<?php

namespace App\Http\Controllers;

use App\Services\ProductImportService;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ProductImportController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240', // 10MB max
        ]);

        try {
            $importService = new ProductImportService();
            Excel::import($importService, $request->file('file'));

            $summary = $importService->summary;
            
            $message = "Processed {$summary['processed']} rows. Added {$summary['added']} new products, skipped {$summary['skipped']}.";
            if ($summary['failed'] > 0) {
                $message .= " Failed {$summary['failed']} rows.";
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'summary' => $summary
            ]);

        } catch (\Throwable $e) {
            \Log::error('Product import failed', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Import failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
