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
        Schema::table('blogs', function (Blueprint $table) {
            $table->dropColumn('category_slug');
            $table->dropColumn('is_popular');
            $table->longText('description')->change();
            $table->foreignId('blog_category_id');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blogs', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['blog_category_id']);
            $table->dropColumn('blog_category_id');
            $table->text('description')->nullable()->change();
            $table->string('category_slug', 255);
            $table->boolean('is_popular')->default(false);
        });
    }
};
