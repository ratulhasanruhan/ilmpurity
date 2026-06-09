<?php

namespace Modules\Exam\Enums;

enum ExamQuestionType: string
{
   case MULTIPLE_CHOICE = 'multiple_choice';
   case MULTIPLE_SELECT = 'multiple_select';
   case MATCHING = 'matching';
   case FILL_BLANK = 'fill_blank';
   case ORDERING = 'ordering';
   case SHORT_ANSWER = 'short_answer';
   case LISTENING = 'listening';

   public function getLabel(): string
   {
      return match ($this) {
         self::MULTIPLE_CHOICE => 'Multiple Choice',
         self::MULTIPLE_SELECT => 'Multiple Select',
         self::MATCHING => 'Matching',
         self::FILL_BLANK => 'Fill in the Blank',
         self::ORDERING => 'Ordering',
         self::SHORT_ANSWER => 'Short Answer',
         self::LISTENING => 'Listening',
      };
   }

   public function isAutoGradable(): bool
   {
      return match ($this) {
         self::MULTIPLE_CHOICE,
         self::MULTIPLE_SELECT,
         self::MATCHING,
         self::FILL_BLANK,
         self::ORDERING,
         self::LISTENING => true,
         self::SHORT_ANSWER => false,
      };
   }
}
