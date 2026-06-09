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
        Schema::create('section_quizzes', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->time('duration');
            $table->integer('hours')->default(0);
            $table->integer('minutes')->default(0);
            $table->integer('seconds')->default(0);
            $table->integer('total_mark');
            $table->integer('pass_mark');
            $table->integer('retake')->default(1);
            $table->integer('drip_rule')->nullable();
            $table->integer('summary')->nullable();
            $table->integer('num_questions')->nullable();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_section_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('section_quizzes');
    }
};
