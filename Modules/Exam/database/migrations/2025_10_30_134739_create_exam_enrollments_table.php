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
        Schema::create('exam_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('exam_id')->constrained('exams')->onDelete('cascade');
            $table->string('enrollment_type')->default('lifetime'); // lifetime, limited
            $table->timestamp('entry_date')->useCurrent();
            $table->timestamp('expiry_date')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('exam_id');
            $table->index('enrollment_type');
            $table->unique(['user_id', 'exam_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_enrollments');
    }
};
