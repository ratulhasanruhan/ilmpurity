<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCourseWishlistRequest;
use App\Services\Course\CourseWishlistService;

class CourseWishlistController extends Controller
{
    public function __construct(private CourseWishlistService $courseWishlistService) {}


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCourseWishlistRequest $request)
    {
        $this->courseWishlistService->createWishlist($request->validated());

        return back()->with('success', 'Course added to wishlist');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->courseWishlistService->deleteWishlist($id);

        return back()->with('success', 'Course removed from wishlist');
    }
}
