<?php
$ch = curl_init('http://127.0.0.1:8001/products');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'name' => 'Test Product',
    'category' => 'Test',
    'qty' => 10,
    'sdp' => 100,
    'page_price' => 120,
    'srp' => 150,
    'status' => 'active',
]));
$response = curl_exec($ch);
$info = curl_getinfo($ch);
echo "Status: " . $info['http_code'] . "\n";
echo "Headers:\n";
print_r(curl_getinfo($ch));
if ($info['http_code'] == 302) {
    echo "Redirect: " . curl_getinfo($ch, CURLINFO_REDIRECT_URL) . "\n";
}
