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
        Schema::create('payment_histories', function (Blueprint $table) {
            $table->id();
            $table->string('payment_type')->nullable();
            $table->decimal('amount', 10, 2)->nullable();
            $table->decimal('admin_revenue', 10, 2)->nullable();
            $table->decimal('instructor_revenue', 10, 2)->nullable();
            $table->decimal('tax', 10, 2)->nullable();
            $table->string('coupon')->nullable();
            $table->string('invoice')->nullable();
            $table->string('transaction_id')->nullable();
            $table->string('session_id')->nullable();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_histories');
    }
};
