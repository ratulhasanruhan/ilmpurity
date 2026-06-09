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
        Schema::create('exam_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained('exams')->onDelete('cascade');
            $table->string('question_type'); // multiple_choice, multiple_select, matching, fill_blank, ordering, short_answer, listening
            $table->text('title');
            $table->longText('description')->nullable();
            $table->decimal('marks', 5, 2)->default(1);
            $table->integer('sort')->default(0);
            $table->json('options')->nullable(); // For matching, ordering, fill_blank types
            $table->timestamps();

            $table->index('exam_id');
            $table->index('question_type');
            $table->index('sort');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_questions');
    }
};
