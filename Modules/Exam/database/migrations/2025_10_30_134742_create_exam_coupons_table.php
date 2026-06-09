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
        Schema::create('exam_coupons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->nullable()->constrained('exams')->onDelete('cascade');
            $table->string('code')->unique();
            $table->string('discount_type')->default('percentage'); // percentage, fixed
            $table->decimal('discount', 10, 2)->default(0);
            $table->timestamp('valid_from')->nullable();
            $table->timestamp('valid_to')->nullable();
            $table->string('usage_type')->default('unlimited'); // unlimited, limited
            $table->integer('usage_limit')->nullable();
            $table->integer('used_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('code');
            $table->index('exam_id');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_coupons');
    }
};
