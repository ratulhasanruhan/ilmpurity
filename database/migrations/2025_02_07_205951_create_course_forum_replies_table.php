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
        Schema::create('course_forum_replies', function (Blueprint $table) {
            $table->id();
            $table->text('description');
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('course_forum_id')->constrained('course_forums');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_forum_replies');
    }
};
