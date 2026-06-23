<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\Configurator;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);

        $gpu1 = Product::create(['name' => 'RTX 5070', 'category' => 'GPU', 'qty' => 10, 'sdp' => 2735, 'page_price' => 2899, 'srp' => 2959, 'status' => 'active']);
        $gpu2 = Product::create(['name' => 'RTX 5060 Ti', 'category' => 'GPU', 'qty' => 20, 'sdp' => 1800, 'page_price' => 1999, 'srp' => 2050, 'status' => 'active']);
        $ram1 = Product::create(['name' => '32GB DDR5', 'category' => 'RAM', 'qty' => 50, 'sdp' => 900, 'page_price' => 1100, 'srp' => 1200, 'status' => 'active']);

        $configurator = Configurator::create(['name' => 'U7', 'base_price' => 100, 'status' => 'active']);

        $configurator->products()->sync([
            $gpu1->id => ['id' => \Illuminate\Support\Str::uuid(), 'category' => 'GPU'],
            $gpu2->id => ['id' => \Illuminate\Support\Str::uuid(), 'category' => 'GPU'],
            $ram1->id => ['id' => \Illuminate\Support\Str::uuid(), 'category' => 'RAM'],
        ]);
    }
}
