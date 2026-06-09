<?php

namespace Modules\Updater\Database\Seeders;

use Illuminate\Database\Seeder;

class UpdaterDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            PagesDataSeeder::class,
            SettingsDataSeeder::class,
        ]);

        // php artisan module:seed Updater --class=UpdaterDatabaseSeeder
    }
}
