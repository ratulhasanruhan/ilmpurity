<?php

namespace Modules\Blog\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Blog\Models\BlogCategory;

class BlogDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Default category (existing functionality) - only if it doesn't exist
        BlogCategory::firstOrCreate(
            ['slug' => 'default'],
            [
                'name' => 'Default',
                'icon' => 'recycle',
                'sort' => 1,
                'description' => 'When a specific category is deleted, all blogs in that category will be moved to this default category. So default category cannot be edited or removed.',
                'status' => 'active',
            ]
        );

        // php artisan module:seed Blog --class=BlogDatabaseSeeder
    }
}
