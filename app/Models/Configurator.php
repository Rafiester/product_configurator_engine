<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Configurator extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'status',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'configurator_product_mappings')
            ->using(ConfiguratorProductMapping::class)
            ->withPivot(['category', 'qty', 'sdp', 'total_sdp', 'page_price', 'srp', 'margin', 'margin_percentage'])
            ->withTimestamps();
    }
}
