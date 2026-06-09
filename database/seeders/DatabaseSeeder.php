<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Blog\Database\Seeders\BlogDatabaseSeeder;
use Modules\Certificate\Database\Seeders\CertificateDatabaseSeeder;
use Modules\Exam\Database\Seeders\ExamDatabaseSeeder;
use Modules\Language\Database\Seeders\LanguageDatabaseSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SettingsSeeder::class,
            NavbarSeeder::class,
            FooterSeeder::class,
            CategorySeeder::class,
            PageSeeder::class,
            BlogDatabaseSeeder::class,
            LanguageDatabaseSeeder::class,
            CertificateDatabaseSeeder::class,
            ExamDatabaseSeeder::class,
        ]);
    }
}
