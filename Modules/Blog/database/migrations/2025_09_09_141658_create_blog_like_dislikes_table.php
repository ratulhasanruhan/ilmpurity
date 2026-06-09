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
        Schema::create('blog_like_dislikes', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['like', 'dislike']);
            $table->foreignId('blog_id')->constrained('blogs')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            // Ensure one user can only have one reaction per blog
            $table->unique(['blog_id', 'user_id']);
            $table->index(['blog_id', 'type']); // For counting likes/dislikes
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blog_like_dislikes');
    }
};
