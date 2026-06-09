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
        Schema::create('blog_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Category name
            $table->string('slug')->unique(); // Unique slug for the category
            $table->string('icon');
            $table->integer('sort')->default(0);
            $table->text('description')->nullable(); // Category description
            $table->string('status')->default('active'); // Category status: active, inactive
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blog_categories');
    }
};
