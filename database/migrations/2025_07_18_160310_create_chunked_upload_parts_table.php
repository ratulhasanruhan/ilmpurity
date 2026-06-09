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
        Schema::create('chunked_upload_parts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('upload_id')->constrained('chunked_uploads')->onDelete('cascade');
            $table->integer('part_number');
            $table->string('etag'); // S3 ETag for the part
            $table->bigInteger('size')->default(0); // Size of this chunk in bytes
            $table->timestamps();
            
            // Create composite index for faster lookups
            $table->unique(['upload_id', 'part_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chunked_upload_parts');
    }
};
