<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'name',
        'category',
        'qty',
        'sdp',
        'page_price',
        'srp',
        'status',
    ];

    public function getTotalSdpAttribute()
    {
        return $this->qty * $this->sdp;
    }

    public function configurators()
    {
        return $this->belongsToMany(Configurator::class, 'configurator_product_mappings')
            ->using(ConfiguratorProductMapping::class)
            ->withPivot(['category', 'qty', 'sdp', 'total_sdp', 'page_price', 'srp', 'margin', 'margin_percentage'])
            ->withTimestamps();
    }
}
