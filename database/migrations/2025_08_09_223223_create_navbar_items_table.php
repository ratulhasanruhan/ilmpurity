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
        Schema::create('navbar_items', function (Blueprint $table) {
            $table->id();
            $table->integer('sort');
            $table->string('type');
            $table->string('slug');
            $table->string('title');
            $table->string('value')->nullable();
            $table->json('items')->nullable();
            $table->boolean('active')->default(true);
            $table->foreignId('navbar_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('navbar_items');
    }
};
