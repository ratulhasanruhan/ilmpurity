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
        Schema::create('course_category_children', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug');
            $table->integer('sort')->default(0);
            $table->boolean('status')->default(true);
            $table->string('icon')->nullable();
            $table->string('description', 500)->nullable();
            $table->foreignId('course_category_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_category_children');
    }
};
