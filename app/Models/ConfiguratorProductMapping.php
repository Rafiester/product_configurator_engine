<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ConfiguratorProductMapping extends Pivot
{
    use HasUuids;

    public $incrementing = false;
    
    protected $table = 'configurator_product_mappings';

    protected $fillable = [
        'configurator_id',
        'product_id',
        'category',
        'qty',
        'sdp',
        'total_sdp',
        'page_price',
        'srp',
        'margin',
        'margin_percentage',
    ];
}
