<?php

namespace App\Services\Course;

use App\Models\Course\QuizQuestion;

class QuizQuestionService
{
   public function createQuestion(array $data)
   {
      return QuizQuestion::create([
         ...$data,
         'answer'  => json_encode($data['answer']),
         'options' => json_encode($data['options']),
      ]);
   }

   public function updateQuestion(array $data, string $id)
   {
      return QuizQuestion::where('id', $id)->update([
         ...$data,
         'answer'  => json_encode($data['answer']),
         'options' => json_encode($data['options']),
      ]);
   }

   public function deleteQuestion(string $id): bool
   {
      return QuizQuestion::find($id)->delete();
   }

   public function sortQuestions(array $sortedData)
   {
      foreach ($sortedData as $value) {
         QuizQuestion::where('id', $value['id'])->update([
            'sort' => $value['sort']
         ]);
      }
   }
}
