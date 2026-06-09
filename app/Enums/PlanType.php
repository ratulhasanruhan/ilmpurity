<?php

namespace App\Enums;

enum PlanType: string
{
    case FREE = 'free';
    case PAID = 'paid';

    public function getLabel(): string
    {
        return match ($this) {
            self::FREE => 'Free',
            self::PAID => 'Paid',
        };
    }
}
