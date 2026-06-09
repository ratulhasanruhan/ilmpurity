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
        Schema::create('chunked_uploads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('filename');
            $table->string('original_filename');
            $table->string('file_path')->nullable();
            $table->string('file_url')->nullable();
            $table->string('disk')->default('s3');
            $table->string('mime_type')->nullable();
            $table->bigInteger('size')->default(0);
            $table->string('upload_id')->nullable()->comment('AWS S3 multipart upload ID');
            $table->string('key')->nullable()->comment('S3 object key');
            $table->string('status')->default('pending');
            $table->integer('chunks_completed')->default(0);
            $table->integer('total_chunks')->default(0);
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chunked_uploads');
    }
};
