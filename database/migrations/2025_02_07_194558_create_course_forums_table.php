<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
   {
      Schema::create('course_forums', function (Blueprint $table) {
         $table->id();
         $table->string('title');
         $table->text('description');
         $table->json('likes')->nullable();
         $table->json('dislikes')->nullable();
         $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
         $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
         $table->foreignId('section_lesson_id')->constrained('section_lessons')->cascadeOnDelete();
         $table->timestamps();
      });
   }

   public function down(): void
   {
      Schema::dropIfExists('course_forums');
   }
};
