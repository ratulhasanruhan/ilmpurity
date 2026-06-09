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
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // Foreign key for users table
            $table->string('category_slug', 255); // Category slug
            $table->string('title', 255); // Blog title
            $table->string('slug', 255)->unique(); // Unique slug for the blog
            $table->text('description')->nullable(); // Blog description
            $table->string('thumbnail', 255)->nullable(); // Thumbnail image path
            $table->string('banner', 255)->nullable(); // Banner image path
            $table->string('keywords', 255)->nullable(); // SEO keywords
            $table->boolean('is_popular')->default(false); // Indicates if the blog is popular
            $table->string('status')->default('draft'); // Blog status
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};
