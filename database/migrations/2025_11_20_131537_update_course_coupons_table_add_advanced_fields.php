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
        Schema::table('course_coupons', function (Blueprint $table) {
            // Add new fields after existing columns
            $table->string('discount_type')->default('percentage')->after('discount'); // percentage, fixed
            $table->timestamp('valid_from')->nullable()->after('discount_type');
            $table->timestamp('valid_to')->nullable()->after('valid_from');
            $table->string('usage_type')->default('unlimited')->after('valid_to'); // unlimited, limited
            $table->integer('usage_limit')->nullable()->after('usage_type');
            $table->integer('used_count')->default(0)->after('usage_limit');
            $table->boolean('is_active')->default(true)->after('used_count');

            // Add indexes for better performance
            $table->index('code');
            $table->index('course_id');
            $table->index('is_active');

            // Drop the old expiry column as we now have valid_from and valid_to
            $table->dropColumn('expiry');
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('course_coupons', function (Blueprint $table) {
            // Drop indexes
            $table->dropIndex(['code']);
            $table->dropIndex(['course_id']);
            $table->dropIndex(['is_active']);

            // Drop new columns
            $table->dropColumn([
                'discount_type',
                'valid_from',
                'valid_to',
                'usage_type',
                'usage_limit',
                'used_count',
                'is_active',
            ]);

            // Restore the old expiry column
            $table->date('expiry')->after('discount');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        });
    }
};
