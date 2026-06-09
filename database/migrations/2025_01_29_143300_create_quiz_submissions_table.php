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
        Schema::create('quiz_submissions', function (Blueprint $table) {
            $table->id();
            $table->integer('attempts');
            $table->integer('correct_answers');
            $table->integer('incorrect_answers');
            $table->integer('total_marks');
            $table->boolean('is_passed');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('section_quiz_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_submissions');
    }
};
