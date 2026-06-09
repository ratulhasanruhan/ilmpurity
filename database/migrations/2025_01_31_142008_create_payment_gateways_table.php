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
        Schema::create('payment_gateways', function (Blueprint $table) {
            $table->id();
            $table->string('identifier')->unique();
            $table->string('currency');
            $table->string('title');
            $table->text('description')->nullable();
            $table->json('keys'); // Store API keys in JSON format
            $table->string('model_name');
            $table->boolean('test_model')->default(true);
            $table->boolean('status')->default(true);
            $table->boolean('is_addon')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_gateways');
    }
};
