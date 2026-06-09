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
        Schema::create('exam_question_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_question_id')->constrained('exam_questions')->onDelete('cascade');
            $table->text('option_text');
            $table->boolean('is_correct')->default(false);
            $table->integer('sort')->default(0);
            $table->timestamps();

            $table->index('exam_question_id');
            $table->index('is_correct');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_question_options');
    }
};
