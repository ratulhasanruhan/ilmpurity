<?php

namespace App\Enums;

enum CourseStatusType: string
{
    case DRAFT = 'draft';
    case UPCOMING = 'upcoming';
    case PENDING = 'pending';
    case REJECTED = 'rejected';
    case APPROVED = 'approved';

    public function getLabel(): string
    {
        return match ($this) {
            self::DRAFT => 'Draft',
            self::UPCOMING => 'Upcoming',
            self::PENDING => 'Pending',
            self::REJECTED => 'Rejected',
            self::APPROVED => 'Approved',
        };
    }
}
