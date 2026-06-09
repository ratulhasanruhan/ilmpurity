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
      Schema::create('exam_faqs', function (Blueprint $table) {
         $table->id();
         $table->foreignId('exam_id')->constrained()->onDelete('cascade');
         $table->text('question')->nullable();
         $table->text('answer')->nullable();
         $table->integer('sort')->default(0);
         $table->timestamps();
      });
   }

   /**
    * Reverse the migrations.
    */
   public function down(): void
   {
      Schema::dropIfExists('exam_faqs');
   }
};
