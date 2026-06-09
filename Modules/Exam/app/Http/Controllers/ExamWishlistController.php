<?php

namespace Modules\Exam\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Modules\Exam\Services\ExamWishlistService;
use Modules\Exam\Http\Requests\StoreExamWishlistRequest;

class ExamWishlistController extends Controller
{
   public function __construct(
      protected ExamWishlistService $examWishlist,
   ) {}

   /**
    * Add an exam to wishlist
    */
   public function store(StoreExamWishlistRequest $request)
   {
      $this->examWishlist->createWishlist([
         'user_id' => Auth::user()->id,
         ...$request->validated()
      ]);

      return back()->with('success', 'Exam added to wishlist!');
   }

   /**
    * Remove an exam from wishlist
    */
   public function destroy(string $id)
   {
      $this->examWishlist->deleteWishlist($id);

      return back()->with('success', 'Exam removed from wishlist.');
   }
}
