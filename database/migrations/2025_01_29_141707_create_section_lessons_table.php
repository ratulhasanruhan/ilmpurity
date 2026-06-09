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
        Schema::create('section_lessons', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->integer('sort');
            $table->boolean('status')->default(1);
            $table->string('lesson_type');
            $table->text('lesson_src')->nullable();
            $table->string('lesson_provider')->nullable();
            $table->string('embed_source')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('duration')->nullable();
            $table->boolean('is_free')->default(false);
            $table->text('description')->nullable();
            $table->text('summary')->nullable();
            $table->unsignedInteger('lesson_number');
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
        Schema::dropIfExists('section_lessons');
    }
};
