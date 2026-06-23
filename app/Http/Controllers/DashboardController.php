<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Configurator;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $totalProducts = Product::count();
        $totalConfigurators = Configurator::count();
        $activeProducts = Product::where('status', 'active')->count();

        return view('dashboard', compact('totalProducts', 'totalConfigurators', 'activeProducts'));
    }
}
