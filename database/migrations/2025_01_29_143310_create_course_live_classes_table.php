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
        Schema::create('course_live_classes', function (Blueprint $table) {
            $table->id();
            $table->string('class_topic');
            $table->string('provider');
            $table->timestamp('class_date_and_time');
            $table->text('class_note')->nullable();
            $table->json('additional_info')->nullable();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_live_classes');
    }
};
