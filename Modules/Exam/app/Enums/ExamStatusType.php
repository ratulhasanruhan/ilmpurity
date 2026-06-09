<?php

namespace Modules\Exam\Enums;

enum ExamStatusType: string
{
   case DRAFT = 'draft';
   case PUBLISHED = 'published';
   case ARCHIVED = 'archived';

   public function getLabel(): string
   {
      return match ($this) {
         self::DRAFT => 'Draft',
         self::PUBLISHED => 'Published',
         self::ARCHIVED => 'Archived',
      };
   }
}
