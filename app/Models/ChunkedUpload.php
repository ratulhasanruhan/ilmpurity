<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChunkedUpload extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'filename',
        'original_filename',
        'file_path',
        'file_url',
        'disk',
        'mime_type',
        'size',
        'upload_id',
        'key',
        'status',
        'chunks_completed',
        'total_chunks',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'size' => 'integer',
        'chunks_completed' => 'integer',
        'total_chunks' => 'integer',
    ];

    /**
     * Get the user that owns the upload
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if upload is complete
     */
    public function isComplete(): bool
    {
        return $this->chunks_completed >= $this->total_chunks;
    }

    /**
     * Get percentage completed
     */
    public function percentCompleted(): int
    {
        if ($this->total_chunks === 0) {
            return 0;
        }

        return (int) (($this->chunks_completed / $this->total_chunks) * 100);
    }
}
