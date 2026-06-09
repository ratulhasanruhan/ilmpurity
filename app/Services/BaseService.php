<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class BaseService
{
   /**
    * Sort categories by drag-drop
    * Uses a single SQL query with CASE statement for optimal performance
    */
   public function updateSortValues(string $table, array $sortedData): bool
   {
      if (empty($sortedData)) {
         return true;
      }

      DB::beginTransaction();

      try {
         // Build the CASE statement for bulk update
         $cases = [];
         $ids = [];
         $params = [];

         foreach ($sortedData as $item) {
            $cases[] = "WHEN id = ? THEN ?";
            $params[] = $item['id'];
            $params[] = $item['sort'];
            $ids[] = $item['id'];
         }

         $idsString = implode(',', array_fill(0, count($ids), '?'));
         $caseStatement = implode(' ', $cases);

         // Execute single UPDATE query with CASE statement
         DB::update(
            "UPDATE {$table} SET sort = CASE {$caseStatement} END WHERE id IN ({$idsString})",
            array_merge($params, $ids)
         );

         DB::commit();
         return true;
      } catch (\Exception $e) {
         DB::rollBack();
         throw $e;
      }
   }
}
