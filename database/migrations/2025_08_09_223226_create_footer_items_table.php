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
        Schema::create('footer_items', function (Blueprint $table) {
            $table->id();
            $table->integer('sort');
            $table->string('type');
            $table->string('slug');
            $table->string('title');
            $table->boolean('active')->default(true);
            $table->json('items')->nullable();
            $table->foreignId('footer_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('footer_items');
    }
};
