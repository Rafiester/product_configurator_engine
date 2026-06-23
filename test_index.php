<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->bootstrap();

$request = \Illuminate\Http\Request::create("/configurators", 'GET');
$response = $kernel->handle($request);
$content = $response->getContent();
if (preg_match('/spreadsheetBuilder\(.*?(\{.*?\})\, \'(.*?)\'\)/s', $content, $matches)) {
    echo "Found spreadsheetBuilder args:\n";
    echo $matches[1] . "\n";
} else {
    echo "Not found!\n";
}
