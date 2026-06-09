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
      Schema::table('section_lessons', function (Blueprint $table) {
         // Increase capacity for full iframe/html embed code
         $table->longText('embed_source')->nullable()->change();
      });
   }

   /**
    * Reverse the migrations.
    */
   public function down(): void
   {
      Schema::table('section_lessons', function (Blueprint $table) {
         // Revert back to string if needed
         $table->string('embed_source')->nullable()->change();
      });
   }
};
