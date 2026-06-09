<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course\CourseCategory;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CourseCategory::create([
            'title' => 'Default',
            'slug' => 'default',
            'sort' => 1,
            'status' => 1,
        ]);
    }
}
