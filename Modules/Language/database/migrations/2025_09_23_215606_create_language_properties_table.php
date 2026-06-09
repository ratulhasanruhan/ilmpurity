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
        Schema::create('language_properties', function (Blueprint $table) {
            $table->id();
            $table->string('group');
            $table->string('name');
            $table->string('slug');
            $table->json('properties');
            $table->foreignId('language_id')->constrained('languages')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('language_properties');
    }
};
