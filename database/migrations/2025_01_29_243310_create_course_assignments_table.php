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
        Schema::create('course_assignments', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->integer('total_mark');
            $table->integer('pass_mark');
            $table->integer('retake')->default(1);
            $table->text('summary')->nullable();
            $table->dateTime('deadline')->default(now()->addDays(7));
            $table->boolean('late_submission')->default(false);
            $table->integer('late_total_mark')->default(0);
            $table->dateTime('late_deadline')->nullable();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_assignments');
    }
};
