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
        Schema::create('job_circulars', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('description'); // I will add everything about the job circular here by richtext editor from frontend.
            $table->string('experience_level')->default('mid');
            $table->string('location');
            $table->decimal('salary_min', 10, 2)->nullable();
            $table->decimal('salary_max', 10, 2)->nullable();
            $table->string('salary_currency', 3)->default('USD');
            $table->boolean('salary_negotiable')->default(false);
            $table->date('application_deadline');
            $table->string('contact_email');
            $table->json('skills_required')->nullable(); // Array of required skills
            $table->integer('positions_available')->default(1);
            $table->string('job_type')->default('full-time');
            $table->string('work_type')->default('on-site');
            $table->string('status')->default('draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_circulars');
    }
};
