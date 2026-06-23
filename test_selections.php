<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->bootstrap();

$configurator = \App\Models\Configurator::with('products')->first();
$mappedProducts = $configurator->products;
$initialSelections = [];
foreach($mappedProducts as $p) {
    $initialSelections[$p->pivot->category] = [
        'id' => $p->id,
        'qty' => $p->pivot->qty ?? 1,
        'sdp' => $p->pivot->sdp ?? 0
    ];
}
echo json_encode($initialSelections);
