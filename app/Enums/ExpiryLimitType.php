<?php

namespace App\Enums;

enum ExpiryLimitType: string
{
   case LIFETIME = 'lifetime';
   case LIMITED_TIME = 'limited_time';

   public function getLabel(): string
   {
      return match ($this) {
         self::LIFETIME => 'lifetime',
         self::LIMITED_TIME => 'limited_time',
      };
   }
}
