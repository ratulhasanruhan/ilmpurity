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
        Schema::create('watch_histories', function (Blueprint $table) {
            $table->id();
            $table->string('prev_watching_id')->nullable();
            $table->string('prev_watching_type')->nullable();
            $table->string('current_section_id');
            $table->string('current_watching_id');
            $table->string('current_watching_type');
            $table->string('next_watching_id')->nullable();
            $table->string('next_watching_type')->nullable();
            $table->json('completed_watching')->nullable();
            $table->timestamp('completion_date')->nullable();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('watch_histories');
    }
};
