<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class ProductSaveTest extends TestCase
{
    public function test_product_saves()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)->post('/products', [
            'name' => 'Test',
            'category' => 'GPU',
            'qty' => 10,
            'sdp' => 100,
            'page_price' => 120,
            'srp' => 150,
            'status' => 'active',
        ]);

        $response->assertSessionHasNoErrors();
    }
}
