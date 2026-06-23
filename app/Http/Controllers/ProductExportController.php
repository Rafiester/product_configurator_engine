<?php

namespace App\Http\Controllers;

use App\Exports\ProductsExport;
use Maatwebsite\Excel\Facades\Excel;

class ProductExportController extends Controller
{
    public function export()
    {
        $fileName = 'products-master-data-' . date('Y-m-d') . '.xlsx';
        return Excel::download(new ProductsExport, $fileName);
    }
}
