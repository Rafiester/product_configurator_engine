<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('configurator_product_mappings', function (Blueprint $table) {
            $table->decimal('sdp', 10, 2)->default(0);
            $table->decimal('total_sdp', 10, 2)->default(0);
            $table->decimal('page_price', 10, 2)->default(0);
            $table->decimal('srp', 10, 2)->default(0);
            $table->decimal('margin', 10, 2)->default(0);
            $table->decimal('margin_percentage', 5, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('configurator_product_mappings', function (Blueprint $table) {
            $table->dropColumn(['sdp', 'total_sdp', 'page_price', 'srp', 'margin', 'margin_percentage']);
        });
    }
};
