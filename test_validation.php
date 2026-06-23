<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$app->bind('Illuminate\Foundation\Http\Middleware\VerifyCsrfToken', function() {
    return new class { public function handle($request, $next) { return $next($request); } };
});
$app->bind('App\Http\Middleware\Authenticate', function() {
    return new class { public function handle($request, $next) { 
        \Illuminate\Support\Facades\Auth::loginUsingId(1);
        return $next($request); 
    } };
});

$request = Illuminate\Http\Request::create('/products', 'POST', [
    'name' => 'Test Product',
    'category' => 'GPU',
    'qty' => 10,
    'sdp' => 100,
    'page_price' => 120,
    'srp' => 150,
    'status' => 'active',
]);
$response = $kernel->handle($request);

if ($response->isRedirection() && session()->has('errors')) {
    echo "Validation Errors:\n";
    print_r(session()->get('errors')->all());
} elseif ($response->isRedirection()) {
    echo "Redirect: " . $response->headers->get('Location') . "\n";
} else {
    echo "Status: " . $response->getStatusCode() . "\n";
}
