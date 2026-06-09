<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class BaseModel extends Model
{
   /**
    * Get the next sort value for the model.
    * Used for auto-incrementing sort order.
    */
   public static function getNextSortValue(): int
   {
      $maxSort = static::query()->max('sort');

      return is_null($maxSort) ? 1 : (int)$maxSort + 1;
   }

   /**
    * Generate a unique slug for the model.
    * Automatically appends numbers if slug already exists.
    */
   public static function generateUniqueSlug(string $text): string
   {
      $slug = Str::slug($text);
      $originalSlug = $slug;
      $counter = 1;

      while (static::where('slug', $slug)->exists()) {
         $slug = $originalSlug . '-' . $counter;
         $counter++;
      }

      return $slug;
   }
}
