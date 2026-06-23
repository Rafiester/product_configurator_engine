<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            // CPU
            ['name' => 'Intel Core Ultra 7 270K Plus (24C/24T @ 5.5GHz)', 'category' => 'CPU', 'qty' => 1, 'sdp' => 1289, 'page_price' => 1350, 'srp' => 1499],
            ['name' => 'Intel Core Ultra 5 225F', 'category' => 'CPU', 'qty' => 1, 'sdp' => 900, 'page_price' => 999, 'srp' => 1099],
            ['name' => 'Intel Core Ultra 5 235F', 'category' => 'CPU', 'qty' => 1, 'sdp' => 950, 'page_price' => 1050, 'srp' => 1150],
            
            // Chassis
            ['name' => '1STPLAYER AU8 12F', 'category' => 'Chassis', 'qty' => 1, 'sdp' => 283, 'page_price' => 335, 'srp' => 393],
            
            // GPU
            ['name' => 'Colorful RTX 5060 Ti GAMING DUO 16GB', 'category' => 'GPU', 'qty' => 1, 'sdp' => 1800, 'page_price' => 1999, 'srp' => 2050],
            ['name' => 'NVIDIA RTX 5070 12GB (Colorful / GIGABYTE)', 'category' => 'GPU', 'qty' => 1, 'sdp' => 2735, 'page_price' => 2899, 'srp' => 2959],
            ['name' => 'ASRock RX 9070 XT Challenger 16GB', 'category' => 'GPU', 'qty' => 1, 'sdp' => 2700, 'page_price' => 2999, 'srp' => 3199],
            ['name' => 'Colorful RTX 5070 Ti BATTLE-AX 16GB', 'category' => 'GPU', 'qty' => 1, 'sdp' => 3200, 'page_price' => 3399, 'srp' => 3599],
            ['name' => 'Colorful RTX 5080 ULTRA OC V2 16GB', 'category' => 'GPU', 'qty' => 1, 'sdp' => 3800, 'page_price' => 4199, 'srp' => 4499],
            ['name' => 'NVIDIA RTX 5060 8GB', 'category' => 'GPU', 'qty' => 1, 'sdp' => 1350, 'page_price' => 1459, 'srp' => 1599],
            
            // Motherboard
            ['name' => 'ASRock B860 Pro-A WiFi6E', 'category' => 'Motherboard', 'qty' => 1, 'sdp' => 260, 'page_price' => 318, 'srp' => 398],
            ['name' => 'GIGABYTE B860 EAGLE WIFI6E', 'category' => 'Motherboard', 'qty' => 1, 'sdp' => 280, 'page_price' => 329, 'srp' => 420],
            
            // RAM
            ['name' => 'KingBank DDR5-6400 16GB (1x16GB)', 'category' => 'RAM', 'qty' => 1, 'sdp' => 465, 'page_price' => 569, 'srp' => 599],
            ['name' => 'KingBank DDR5-6400 32GB (2x16GB)', 'category' => 'RAM', 'qty' => 1, 'sdp' => 900, 'page_price' => 1100, 'srp' => 1200],
            ['name' => 'HIKSEMI DDR5-6400 64GB (2x32GB)', 'category' => 'RAM', 'qty' => 1, 'sdp' => 1300, 'page_price' => 1500, 'srp' => 1600],
            
            // SSD
            ['name' => '500GB NVMe Gen4 (>5000mbps)', 'category' => 'SSD', 'qty' => 1, 'sdp' => 245, 'page_price' => 299, 'srp' => 329],
            ['name' => '1TB NVMe Gen4 (>6000mbps)', 'category' => 'SSD', 'qty' => 1, 'sdp' => 545, 'page_price' => 619, 'srp' => 689],
            ['name' => '2TB NVMe Gen4 (>7000mbps)', 'category' => 'SSD', 'qty' => 1, 'sdp' => 900, 'page_price' => 1050, 'srp' => 1150],
            
            // PSU
            ['name' => 'FSP VIC BD 750 Bronze ATX 3.1', 'category' => 'PSU', 'qty' => 1, 'sdp' => 350, 'page_price' => 399, 'srp' => 459],
            ['name' => 'GAMEMAX GX-750 PRO Gold', 'category' => 'PSU', 'qty' => 1, 'sdp' => 420, 'page_price' => 499, 'srp' => 559],
            ['name' => 'GAMEMAX GX-850 PRO Gold', 'category' => 'PSU', 'qty' => 1, 'sdp' => 480, 'page_price' => 579, 'srp' => 649],
            
            // Cooler
            ['name' => 'DeepCool AG620 G2 ARGB', 'category' => 'Cooler', 'qty' => 1, 'sdp' => 136, 'page_price' => 170, 'srp' => 209],
            ['name' => 'ID-COOLING FX360 LCD ARGB', 'category' => 'Cooler', 'qty' => 1, 'sdp' => 220, 'page_price' => 269, 'srp' => 319],
            
            // ARGB / Accessories
            ['name' => 'Slev 6-port ARGB Hub', 'category' => 'ARGB / Accessories', 'qty' => 1, 'sdp' => 15, 'page_price' => 17, 'srp' => 20],
        ];

        foreach ($products as $productData) {
            Product::firstOrCreate(
                ['name' => $productData['name']],
                $productData
            );
        }
    }
}
