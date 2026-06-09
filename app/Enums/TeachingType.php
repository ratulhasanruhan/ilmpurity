<?php

namespace App\Enums;

enum TeachingType: string
{
    case ADMINISTRATIVE = 'administrative';
    case COLLABORATIVE = 'collaborative';

    public function getLabel(): string
    {
        return match ($this) {
            self::ADMINISTRATIVE => 'Administrative',
            self::COLLABORATIVE => 'Collaborative',
        };
    }
}
