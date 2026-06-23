<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// Disable CSRF temporarily
$app->bind('Illuminate\Foundation\Http\Middleware\VerifyCsrfToken', function() {
    return new class {
        public function handle($request, $next) { return $next($request); }
    };
});

$request = Illuminate\Http\Request::create('/products', 'POST', [
    'name' => 'Test Product',
    'category' => 'Test Category',
    'qty' => 10,
    'sdp' => 100,
    'page_price' => 150,
    'srp' => 200,
    'status' => 'active',
]);
$response = $kernel->handle($request);

echo "Status: " . $response->getStatusCode() . "\n";
if ($response->isRedirection()) {
    echo "Redirect: " . $response->headers->get('Location') . "\n";
    if (session()->has('errors')) {
        echo "Errors:\n";
        print_r(session()->get('errors')->all());
    } else {
        echo "No errors in session.\n";
    }
} else {
    echo $response->getContent();
}
