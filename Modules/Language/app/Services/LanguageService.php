<?php

namespace Modules\Language\Services;

use App\Services\MediaService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Lang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\File;
use Modules\Language\Models\Language;
use Modules\Language\Models\LanguageProperty;
use Exception;

class LanguageService extends MediaService
{
   public string $cacheKey;

   public function __construct(Request $request)
   {
      $this->cacheKey = 'language_properties';
   }

   function storeLanguage($data)
   {
      $langPath = base_path('lang');
      $langDir = $langPath . "/" . $data['code'];
      $appLangPath = storage_path('app/lang/default');

      if (is_dir($langDir)) {
         throw new Exception("Language already exist");
      }

      $groups = [
         'auth' => require storage_path('app/lang/groups/auth.php'),
         'button' => require storage_path('app/lang/groups/button.php'),
         'common' => require storage_path('app/lang/groups/common.php'),
         'dashboard' => require storage_path('app/lang/groups/dashboard.php'),
         'frontend' => require storage_path('app/lang/groups/frontend.php'),
         'input' => require storage_path('app/lang/groups/input.php'),
         'settings' => require storage_path('app/lang/groups/settings.php'),
      ];

      $languages = Language::create($data);

      foreach ($groups as $key => $group) {
         foreach ($group as $value) {
            LanguageProperty::create([
               ...$value,
               'group' => $key,
               'language_id' => $languages->id,
            ]);
         }
      }

      File::makeDirectory($langDir, 0777, true, true);
      File::copyDirectory($appLangPath, $langDir);
   }

   function updateLanguage($id, $data)
   {
      Language::find($id)->update($data);
   }

   function defaultLanguage($id)
   {
      Language::where('is_default', true)->update(['is_default' => false]);
      Language::where('id', $id)->update(['is_default' => true]);
   }

   function setLanguageProperties(string $locale): void
   {
      $cached = Cache::rememberForever($this->cacheKey, function () use ($locale) {
         $language = Language::where('code', $locale)
            ->with('properties')
            ->first();

         $groups = [];
         foreach ($language->properties as $property) {
            $groups[$property->group] = array_merge($groups[$property->group] ?? [], $property->properties);
         }

         $translations = [];
         foreach ($groups as $group => $properties) {
            foreach ($properties as $key => $value) {
               $translations[$group . '.' . $key] = $value;
            }
         }

         return $translations;
      });

      Lang::addLines($cached, $locale);
   }

   function deleteLanguage($id)
   {
      $lang = Language::find($id);
      $langPath = base_path('lang');
      $langDir = $langPath . "/" . $lang->code;

      if ($lang->is_default) {
         throw new Exception("Default language can't be deleted");
      }

      if (is_dir($langDir)) {
         File::deleteDirectory($langDir);
      }

      $lang->delete();
   }
}
