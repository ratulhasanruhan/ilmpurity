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
        Schema::create('exam_attempt_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_attempt_id')->constrained('exam_attempts')->onDelete('cascade');
            $table->foreignId('exam_question_id')->constrained('exam_questions')->onDelete('cascade');
            $table->json('answer_data'); // Flexible JSON to store various answer types
            $table->boolean('is_correct')->nullable();
            $table->decimal('marks_obtained', 5, 2)->default(0);
            $table->timestamps();

            $table->index('exam_attempt_id');
            $table->index('exam_question_id');
            $table->index('is_correct');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_attempt_answers');
    }
};
