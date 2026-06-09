<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class JobCircular extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'experience_level',
        'location',
        'salary_min',
        'salary_max',
        'salary_currency',
        'salary_negotiable',
        'application_deadline',
        'contact_email',
        'skills_required',
        'positions_available',
        'job_type',
        'work_type',
        'status',
    ];

    protected $casts = [
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2',
        'salary_negotiable' => 'boolean',
        'skills_required' => 'array',
        'application_deadline' => 'date',
        'positions_available' => 'integer',
    ];

    protected $attributes = [
        'skills_required' => '[]',
        'positions_available' => 1,
        'salary_currency' => 'USD',
        'experience_level' => 'mid',
        'job_type' => 'full-time',
        'work_type' => 'on-site',
        'status' => 'draft',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (JobCircular $jobCircular) {
            if (empty($jobCircular->slug)) {
                $jobCircular->slug = static::generateUniqueSlug($jobCircular->title);
            }
        });

        static::updating(function (JobCircular $jobCircular) {
            if ($jobCircular->isDirty('title') && !$jobCircular->isDirty('slug')) {
                $jobCircular->slug = static::generateUniqueSlug($jobCircular->title);
            }
        });
    }

    /**
     * Generate a unique slug for the job circular.
     */
    public static function generateUniqueSlug(string $title): string
    {
        $slug = \Illuminate\Support\Str::slug($title);
        $originalSlug = $slug;
        $counter = 1;

        while (static::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Scope a query to only include active job circulars.
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('status', 'active');
    }

    /**
     * Scope a query to only include published job circulars.
     */
    public function scopePublished(Builder $query): void
    {
        $query->where('status', 'active');
    }

    /**
     * Scope a query to only include non-expired job circulars.
     */
    public function scopeNotExpired(Builder $query): void
    {
        $query->where('application_deadline', '>=', now()->format('Y-m-d'));
    }



    /**
     * Scope a query to filter by job type.
     */
    public function scopeByJobType(Builder $query, string $jobType): void
    {
        $query->where('job_type', $jobType);
    }

    /**
     * Scope a query to filter by experience level.
     */
    public function scopeByExperienceLevel(Builder $query, string $experienceLevel): void
    {
        $query->where('experience_level', $experienceLevel);
    }

    /**
     * Scope a query to filter by work type.
     */
    public function scopeByWorkType(Builder $query, string $workType): void
    {
        $query->where('work_type', $workType);
    }

    /**
     * Get the formatted salary range.
     */
    public function getFormattedSalaryAttribute(): string
    {
        if ($this->salary_negotiable) {
            return 'Negotiable';
        }

        if (!$this->salary_min && !$this->salary_max) {
            return 'Not specified';
        }

        $currency = $this->salary_currency;

        if ($this->salary_min && $this->salary_max) {
            return "{$currency} " . number_format($this->salary_min) . " - " . number_format($this->salary_max);
        }

        if ($this->salary_min) {
            return "{$currency} " . number_format($this->salary_min) . "+";
        }

        if ($this->salary_max) {
            return "Up to {$currency} " . number_format($this->salary_max);
        }

        return 'Not specified';
    }

    /**
     * Get the time remaining until application deadline.
     */
    public function getTimeUntilDeadlineAttribute(): string
    {
        if ($this->application_deadline < now()->format('Y-m-d')) {
            return 'Expired';
        }

        $deadline = Carbon::parse($this->application_deadline);
        $now = now();

        $diffInDays = $deadline->diffInDays($now);

        if ($diffInDays === 0) {
            return 'Today';
        } elseif ($diffInDays === 1) {
            return 'Tomorrow';
        } else {
            return $diffInDays . ' days left';
        }
    }

    /**
     * Check if the job circular is expired.
     */
    public function getIsExpiredAttribute(): bool
    {
        return $this->application_deadline < now()->format('Y-m-d');
    }

    /**
     * Check if the job circular is published.
     */
    public function getIsPublishedAttribute(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Get available job types.
     */
    public static function getJobTypes(): array
    {
        return [
            'full-time' => 'Full Time',
            'part-time' => 'Part Time',
            'contract' => 'Contract',
            'internship' => 'Internship',
            'freelance' => 'Freelance',
        ];
    }

    /**
     * Get available work types.
     */
    public static function getWorkTypes(): array
    {
        return [
            'on-site' => 'On-site',
            'remote' => 'Remote',
            'hybrid' => 'Hybrid',
        ];
    }

    /**
     * Get available experience levels.
     */
    public static function getExperienceLevels(): array
    {
        return [
            'entry' => 'Entry Level',
            'mid' => 'Mid Level',
            'senior' => 'Senior Level',
            'executive' => 'Executive',
        ];
    }

    /**
     * Get available statuses.
     */
    public static function getStatuses(): array
    {
        return [
            'draft' => 'Draft',
            'active' => 'Active',
            'closed' => 'Closed',
        ];
    }
}
