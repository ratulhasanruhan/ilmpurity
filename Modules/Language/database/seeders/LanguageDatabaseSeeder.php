<?php

namespace Modules\Language\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Language\Models\Language;
use Modules\Language\Models\LanguageProperty;

class LanguageDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $groups = [
            'auth' => require storage_path('app/lang/groups/auth.php'),
            'button' => require storage_path('app/lang/groups/button.php'),
            'common' => require storage_path('app/lang/groups/common.php'),
            'dashboard' => require storage_path('app/lang/groups/dashboard.php'),
            'frontend' => require storage_path('app/lang/groups/frontend.php'),
            'input' => require storage_path('app/lang/groups/input.php'),
            'table' => require storage_path('app/lang/groups/table.php'),
            'settings' => require storage_path('app/lang/groups/settings.php'),
        ];

        $language = Language::firstOrCreate(
            ['code' => 'en'],
            [
                'name' => 'English',
                'nativeName' => 'English',
                'is_active' => true,
                'is_default' => true,
            ]
        );

        foreach ($groups as $key => $group) {
            foreach ($group as $value) {
                LanguageProperty::firstOrCreate(
                    ['slug' => $value['slug']],
                    [
                        ...$value,
                        'group' => $key,
                        'language_id' => $language->id
                    ]
                );
            }
        }
    }
}
