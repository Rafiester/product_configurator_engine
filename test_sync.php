<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$configurator = \App\Models\Configurator::first();
$product = \App\Models\Product::first();

$request = \Illuminate\Http\Request::create("/configurators/{$configurator->id}/sync-products", 'POST', [
    'selections' => [
        [
            'category' => $product->category,
            'product_id' => $product->id,
            'qty' => 2
        ]
    ]
]);

$controller = new \App\Http\Controllers\ConfiguratorController();
try {
    $response = $controller->syncProducts($request, $configurator);
    echo $response->getContent();
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
