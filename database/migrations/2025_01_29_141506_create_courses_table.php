<?php

use App\Enums\CoursePricingType;
use App\Enums\ExpiryLimitType;
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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug');
            $table->string('course_type');
            $table->string('status');
            $table->string('level');
            $table->text('short_description');
            $table->text('description')->nullable();
            $table->string('language')->nullable();

            $table->string('pricing_type')->default(CoursePricingType::FREE);
            $table->double('price', 10, 2)->nullable();
            $table->boolean('discount')->default(false);
            $table->double('discount_price', 10, 2)->nullable();
            $table->boolean('drip_content')->default(false);

            $table->string('thumbnail')->nullable();
            $table->string('banner')->nullable();
            $table->string('preview')->nullable();

            $table->string('expiry_type')->default(ExpiryLimitType::LIFETIME);
            $table->string('expiry_duration')->nullable();
            $table->string('created_from')->default('web');

            $table->string('meta_title')->nullable();
            $table->text('meta_keywords')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();

            $table->foreignId('instructor_id')->constrained();
            $table->foreignId('course_category_id')->constrained();
            $table->foreignId('course_category_child_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
