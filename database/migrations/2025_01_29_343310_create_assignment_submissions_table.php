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
        Schema::create('assignment_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('attachment_type')->default('url'); // url or file
            $table->string('attachment_path');
            $table->text('comment')->nullable();
            $table->timestamp('submitted_at')->default(now());
            $table->decimal('marks_obtained', 8, 2)->default(0);
            $table->text('instructor_feedback')->nullable();
            $table->string('status')->default('pending'); // pending, graded, late, resubmitted
            $table->integer('attempt_number')->default(1);
            $table->boolean('is_late')->default(false);
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_assignment_id')->constrained()->cascadeOnDelete();
            $table->foreignId('grader_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assignment_submissions');
    }
};
