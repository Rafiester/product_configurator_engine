<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->bootstrap();

$allProductsByCategory = \App\Models\Product::where('status', 'active')->get()->groupBy('category');
$found = false;
foreach($allProductsByCategory as $cat => $products) {
    foreach($products as $p) {
        if($p->id == '019eefe0-dae8-728f-843d-3c1df8219e8c') {
            $found = true;
            echo "FOUND GPU in active products!\n";
        }
    }
}
if (!$found) echo "NOT FOUND!\n";
