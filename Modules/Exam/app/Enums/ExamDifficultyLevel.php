<?php

namespace Modules\Exam\Enums;

enum ExamDifficultyLevel: string
{
   case BEGINNER = 'beginner';
   case INTERMEDIATE = 'intermediate';
   case ADVANCED = 'advanced';
   case EXPERT = 'expert';

   public function getLabel(): string
   {
      return match ($this) {
         self::BEGINNER => 'Beginner',
         self::INTERMEDIATE => 'Intermediate',
         self::ADVANCED => 'Advanced',
         self::EXPERT => 'Expert',
      };
   }
}
