<?php
namespace Tests\Feature;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class RealDbTest extends TestCase
{
    public function test_save()
    {
        $user = User::first() ?? User::factory()->create();
        $response = $this->actingAs($user)->post('/products', [
            'name' => 'Real DB Test',
            'category' => 'GPU',
            'qty' => 10,
            'sdp' => 100,
            'page_price' => 120,
            'srp' => 150,
            'status' => 'active',
        ]);
        if ($response->isRedirection() && session()->has('errors')) {
            dump(session()->get('errors')->all());
        }
        $response->assertSessionHasNoErrors();
    }
}
