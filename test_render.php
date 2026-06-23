<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->bootstrap();

$request = \Illuminate\Http\Request::create("/configurators", 'GET');
$response = $kernel->handle($request);
file_put_contents('test_output.html', $response->getContent());
