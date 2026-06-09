<?php

namespace App\Enums;

enum UserType: string
{
    case ADMIN = 'admin';
    case INSTRUCTOR = 'instructor';
    case STUDENT = 'student';

    public function getLabel(): string
    {
        return match ($this) {
            self::ADMIN => 'Admin',
            self::INSTRUCTOR => 'instructor',
            self::STUDENT => 'student',
        };
    }
}
