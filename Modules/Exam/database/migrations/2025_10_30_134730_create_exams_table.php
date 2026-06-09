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
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->string('status')->default('draft'); // draft, published, archived
            $table->string('level')->default('beginner'); // beginner, intermediate, advanced, expert

            // Pricing
            $table->string('pricing_type')->default(CoursePricingType::FREE->value);
            $table->double('price', 10, 2)->nullable();
            $table->boolean('discount')->default(false);
            $table->double('discount_price', 10, 2)->nullable();

            // Exam Details
            $table->integer('duration_hours')->default(0);
            $table->integer('duration_minutes')->default(0);
            $table->decimal('pass_mark', 5, 2)->default(0);
            $table->decimal('total_marks', 10, 2)->default(0);
            $table->integer('max_attempts')->default(1);
            $table->integer('total_questions')->default(0); // it will be remove

            // Media
            $table->string('thumbnail')->nullable();
            $table->string('banner')->nullable();

            // Expiry
            $table->string('expiry_type')->default(ExpiryLimitType::LIFETIME->value);
            $table->string('expiry_duration')->nullable();

            // SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_keywords')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();

            // Instructor & Category
            $table->foreignId('instructor_id')->constrained('instructors')->onDelete('cascade');
            $table->foreignId('exam_category_id')->constrained('exam_categories')->onDelete('cascade');
            $table->timestamps();

            // Indexes
            $table->index('slug');
            $table->index('status');
            $table->index('instructor_id');
            $table->index('exam_category_id');
            $table->index('pricing_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};
