<?php

namespace Modules\Language\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Language\Services\LanguageService;
use Modules\Language\Http\Requests\StoreLanguageRequest;
use Modules\Language\Http\Requests\UpdateLanguageRequest;
use Modules\Language\Models\Language;
use Modules\Language\Models\LanguageProperty;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class LanguageController extends Controller
{
    public function __construct(
        public LanguageService $languageService
    ) {}

    public function index()
    {
        $langs = Language::orderBy('is_default', 'desc')->get();

        return Inertia::render('dashboard/settings/translation/index', compact('langs'));
    }

    public function store(StoreLanguageRequest $request)
    {
        $this->languageService->storeLanguage($request->validated());

        return back()->with('success', "New language added successfully");
    }

    public function update(UpdateLanguageRequest $request, string $id)
    {
        $this->languageService->updateLanguage($id, $request->validated());

        return back()->with('success', "Language updated successfully");
    }

    public function edit(string $local)
    {
        $language = Language::where('code', $local)->with(['properties'])->firstOrFail();

        return Inertia::render('dashboard/settings/translation/update', compact('local', 'language'));
    }

    public function destroy(string $id)
    {
        $this->languageService->deleteLanguage($id);

        return back()->with('success', "Language deleted successfully");
    }

    public function edit_property(string $id)
    {
        $property = LanguageProperty::where('id', $id)->with(['language:id,code'])->firstOrFail();

        return Inertia::render('dashboard/settings/translation/properties', compact('property'));
    }

    public function update_property(Request $request, $id)
    {
        $property = LanguageProperty::findOrFail($id);
        $property->update(['properties' => $request->all()]);

        return back()->with('success', $property->name . ' translation successfully updated');
    }

    public function change_direction(Request $request)
    {
        $cookie = Cookie::forever('direction', $request->direction);

        return back()->withCookie($cookie);
    }

    public function change_lang(Request $request)
    {
        Cache::forget($this->languageService->cacheKey);
        $cookie = Cookie::forever('locale', $request->locale);

        return back()->withCookie($cookie);
    }

    public function default(Request $request, $id)
    {
        $this->languageService->defaultLanguage($id);

        return back()->with('success', "Default language set successfully");
    }

    public function status(Request $request, $local)
    {
        $langFilePath = base_path("lang/$local/active.txt");
        if (is_file($langFilePath)) {
            unlink($langFilePath);
        } else {
            file_put_contents($langFilePath, true);
        }

        return back();
    }
}
