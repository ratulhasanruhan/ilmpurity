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
        Schema::create('certificate_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Template name for admin reference
            $table->string('logo_path')->nullable(); // Path to uploaded logo
            $table->json('template_data'); // All customization data (colors, texts, fonts, etc)
            $table->boolean('is_active')->default(false); // Only one template can be active
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificate_templates');
    }
};
