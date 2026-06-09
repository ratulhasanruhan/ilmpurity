<?php

namespace App\Services;

use App\Models\Footer;
use App\Models\FooterItem;
use App\Models\Navbar;
use App\Models\NavbarItem;
use App\Models\Page;
use App\Models\Setting;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class SettingsService extends MediaService
{
    public function getSetting(array $params)
    {
        return DB::transaction(function () use ($params) {
            $settings = Setting::when(array_key_exists('type', $params), function ($query) use ($params) {
                return $query->where('type', $params['type']);
            })
                ->when(array_key_exists('sub_type', $params), function ($query) use ($params) {
                    return $query->where('sub_type', $params['sub_type']);
                })
                ->first();

            return $settings;
        }, 5);
    }

    public function getSettings(array $params)
    {
        return DB::transaction(function () use ($params) {
            $settings = Setting::when(array_key_exists('type', $params), function ($query) use ($params) {
                return $query->where('type', $params['type']);
            })
                ->when(array_key_exists('sub_type', $params), function ($query) use ($params) {
                    return $query->where('sub_type', $params['sub_type']);
                })
                ->get();

            return $settings;
        }, 5);
    }

    public function systemUpdate(array $data, string $id)
    {
        return DB::transaction(function () use ($data, $id) {
            $setting = Setting::find($id);

            if (array_key_exists('new_logo_dark', $data) && $data['new_logo_dark']) {
                $data['logo_dark'] = $this->addNewDeletePrev($setting, $data['new_logo_dark'], "logo_dark");
            }

            if (array_key_exists('new_logo_light', $data) && $data['new_logo_light']) {
                $data['logo_light'] = $this->addNewDeletePrev($setting, $data['new_logo_light'], "logo_light");
            }

            if (array_key_exists('new_favicon', $data) && $data['new_favicon']) {
                $data['favicon'] = $this->addNewDeletePrev($setting, $data['new_favicon'], "favicon");
            }

            if (array_key_exists('new_banner', $data) && $data['new_banner']) {
                $data['banner'] = $this->addNewDeletePrev($setting, $data['new_banner'], "banner");
            }

            // Remove multiple fields at once
            $filteredData = Arr::except($data, [
                'new_logo',
                'new_favicon',
                'new_banner'
            ]);

            $setting->update(['fields' => $filteredData]);

            return $setting;
        }, 5);
    }

    public function paymentUpdate(array $data, string $id)
    {
        return DB::transaction(function () use ($data, $id) {
            return Setting::find($id)->update(['fields' => $data]);
        }, 5);
    }

    public function smtpUpdate(array $data, string $id)
    {
        return DB::transaction(function () use ($data, $id) {
            testSmtpConnection($data);

            return Setting::find($id)->update(['fields' => $data]);
        }, 5);
    }

    public function storageUpdate(array $data, string $id)
    {
        return DB::transaction(function () use ($data, $id) {
            return Setting::find($id)->update(['fields' => $data]);
        }, 5);
    }

    public function authUpdate(array $data, string $id)
    {
        return DB::transaction(function () use ($data, $id) {
            return Setting::find($id)->update(['fields' => $data]);
        }, 5);
    }

    public function zoomConfigUpdate(array $data, string $id)
    {
        return DB::transaction(function () use ($data, $id) {
            return Setting::find($id)->update(['fields' => $data]);
        }, 5);
    }

    public function homePagesSelect(array $data, string $id)
    {
        return DB::transaction(function () use ($data, $id) {
            return Setting::find($id)->update(['fields' => $data]);
        }, 5);
    }

    public function customPagesCreate(array $data)
    {
        return DB::transaction(function () use ($data) {
            return Page::create($data);
        }, 5);
    }

    public function customPagesUpdate(array $data, string $id)
    {
        return DB::transaction(function () use ($data, $id) {
            return Page::find($id)->update($data);
        }, 5);
    }

    public function customPagesDestroy(string $id)
    {
        return DB::transaction(function () use ($id) {
            return Page::find($id)->delete();
        }, 5);
    }

    public function getNavbar(string $slug)
    {
        return DB::transaction(function () use ($slug) {
            return Navbar::where('slug', $slug)
                ->where('active', true)
                ->with('navbarItems')
                ->first();
        }, 5);
    }

    public function getFooter(string $slug)
    {
        return DB::transaction(function () use ($slug) {
            return Footer::where('slug', $slug)
                ->where('active', true)
                ->with('footerItems')
                ->first();
        }, 5);
    }

    /**
     * Create a new navbar item.
     */
    public function createNavbarItem(Navbar $navbar, array $data)
    {
        return DB::transaction(function () use ($navbar, $data) {
            // Handle different types of navbar items
            if ($data['type'] === 'dropdown') {
                // For dropdown items, filter out empty items and keep as array (Laravel will auto-convert to JSON)
                if (isset($data['items']) && is_array($data['items']) && !empty($data['items'])) {
                    // Filter out empty items
                    $filteredItems = array_filter($data['items'], function ($item) {
                        return !empty($item['title']) && !empty($item['url']);
                    });
                    $data['items'] = array_values($filteredItems);
                } else {
                    $data['items'] = [];
                }
                $data['value'] = null; // Dropdowns don't use value field
            } elseif ($data['type'] === 'action') {
                // For action types, clear both value and items fields
                $data['value'] = null;
                $data['items'] = null;
            } else {
                // For URL types, clear items field
                $data['items'] = null;
            }

            $navbarItem = NavbarItem::create([
                'navbar_id' => $navbar->id,
                ...$data,
            ]);

            return $navbarItem;
        }, 5);
    }

    /**
     * Update a navbar item.
     */
    public function updateNavbarItem(NavbarItem $item, array $data)
    {
        return DB::transaction(function () use ($item, $data) {
            // Handle different types of navbar items
            if ($data['type'] === 'dropdown') {
                // For dropdown items, filter out empty items and keep as array (Laravel will auto-convert to JSON)
                if (isset($data['items']) && is_array($data['items']) && !empty($data['items'])) {
                    // Filter out empty items
                    $filteredItems = array_filter($data['items'], function ($item) {
                        return !empty($item['title']) && !empty($item['url']);
                    });
                    $data['items'] = array_values($filteredItems);
                } else {
                    $data['items'] = [];
                }
                $data['value'] = null; // Dropdowns don't use value field
            } elseif ($data['type'] === 'action') {
                // For action types, clear both value and items fields
                $data['value'] = null;
                $data['items'] = null;
            } else {
                // For URL types, clear items field
                $data['items'] = null;
            }

            $item->update($data);

            return $item->fresh();
        }, 5);
    }

    /**
     * Delete a navbar item.
     */
    public function deleteNavbarItem(NavbarItem $item)
    {
        return DB::transaction(function () use ($item) {
            return $item->delete();
        }, 5);
    }

    /**
     * Reorder navbar items.
     */
    public function reorderNavbarItems(array $sortedData)
    {
        foreach ($sortedData as $value) {
            NavbarItem::where('id', $value['id'])->update([
                'sort' => $value['sort']
            ]);
        }
    }

    /**
     * Move a navbar item up or down.
     */
    public function moveNavbarItem(NavbarItem $item, string $direction)
    {
        return DB::transaction(function () use ($item, $direction) {
            $currentSort = $item->sort;
            $navbar = $item->navbar;

            if ($direction === 'up') {
                // Find the item with the next lower sort value
                $targetItem = NavbarItem::where('navbar_id', $navbar->id)
                    ->where('sort', '<', $currentSort)
                    ->orderBy('sort', 'desc')
                    ->first();
            } else { // down
                // Find the item with the next higher sort value
                $targetItem = NavbarItem::where('navbar_id', $navbar->id)
                    ->where('sort', '>', $currentSort)
                    ->orderBy('sort', 'asc')
                    ->first();
            }

            if ($targetItem) {
                // Swap the sort values
                $targetSort = $targetItem->sort;

                $targetItem->update(['sort' => $currentSort]);
                $item->update(['sort' => $targetSort]);
            }

            return true;
        }, 5);
    }

    /**
     * Get navbar with items, optionally filtered by type.
     */
    public function getNavbarWithItems(string $slug, ?string $type = null)
    {
        return DB::transaction(function () use ($slug, $type) {
            $query = Navbar::where('slug', $slug)
                ->where('active', true)
                ->with(['navbarItems' => function ($query) use ($type) {
                    $query->where('active', true)
                        ->when($type, function ($q) use ($type) {
                            return $q->where('type', $type);
                        })
                        ->orderBy('sort', 'asc');
                }]);

            return $query->first();
        }, 5);
    }

    /**
     * Toggle navbar item active status.
     */
    public function toggleNavbarItemStatus(NavbarItem $item)
    {
        return DB::transaction(function () use ($item) {
            $item->update(['active' => !$item->active]);
            return $item->fresh();
        }, 5);
    }

    /**
     * Duplicate a navbar item.
     */
    public function duplicateNavbarItem(NavbarItem $item)
    {
        return DB::transaction(function () use ($item) {
            $maxSort = NavbarItem::where('navbar_id', $item->navbar_id)->max('sort');

            return NavbarItem::create([
                'navbar_id' => $item->navbar_id,
                'type' => $item->type,
                'slug' => $item->slug . '_copy',
                'title' => $item->title . ' (Copy)',
                'value' => $item->value,
                'items' => $item->items,
                'sort' => $maxSort + 1,
                'active' => true,
            ]);
        }, 5);
    }

    /**
     * Create a new footer item.
     */
    public function createFooterItem(Footer $footer, array $data)
    {
        return DB::transaction(function () use ($footer, $data) {
            // Handle different types of footer items
            if ($data['type'] === 'list') {
                // For list items, filter out empty items and keep as array (Laravel will auto-convert to JSON)
                if (isset($data['items']) && is_array($data['items']) && !empty($data['items'])) {
                    // Filter out empty items
                    $filteredItems = array_filter($data['items'], function ($item) {
                        return !empty($item['title']) && (!isset($item['url']) || !empty($item['url']));
                    });
                    $data['items'] = array_values($filteredItems);
                } else {
                    $data['items'] = [];
                }
            } elseif ($data['type'] === 'social_media') {
                // For social media items, ensure icon and url are provided
                if (isset($data['items']) && is_array($data['items']) && !empty($data['items'])) {
                    $filteredItems = array_filter($data['items'], function ($item) {
                        return !empty($item['title']) && !empty($item['url']) && !empty($item['icon']);
                    });
                    $data['items'] = array_values($filteredItems);
                } else {
                    $data['items'] = [];
                }
            } elseif ($data['type'] === 'payment_methods') {
                // For payment methods, ensure image is provided
                if (isset($data['items']) && is_array($data['items']) && !empty($data['items'])) {
                    $filteredItems = array_filter($data['items'], function ($item) {
                        return !empty($item['image']);
                    });
                    $data['items'] = array_values($filteredItems);
                } else {
                    $data['items'] = [];
                }
            } elseif ($data['type'] === 'copyright') {
                // For copyright type, clear items field
                $data['items'] = [];
            } else {
                // For other types, keep items as is or empty array
                if (!isset($data['items']) || !is_array($data['items'])) {
                    $data['items'] = [];
                }
            }

            $footerItem = FooterItem::create([
                'footer_id' => $footer->id,
                ...$data,
            ]);

            return $footerItem;
        }, 5);
    }

    /**
     * Update an existing footer item.
     */
    public function updateFooterItem(FooterItem $item, array $data)
    {
        return DB::transaction(function () use ($item, $data) {
            // Handle different types of footer items
            if ($data['type'] === 'list') {
                // For list items, filter out empty items and keep as array (Laravel will auto-convert to JSON)
                if (isset($data['items']) && is_array($data['items']) && !empty($data['items'])) {
                    // Filter out empty items
                    $filteredItems = array_filter($data['items'], function ($item) {
                        return !empty($item['title']) && (!isset($item['url']) || !empty($item['url']));
                    });
                    $data['items'] = array_values($filteredItems);
                } else {
                    $data['items'] = [];
                }
            } elseif ($data['type'] === 'social_media') {
                // For social media items, ensure icon and url are provided
                if (isset($data['items']) && is_array($data['items']) && !empty($data['items'])) {
                    $filteredItems = array_filter($data['items'], function ($item) {
                        return !empty($item['title']) && !empty($item['url']) && !empty($item['icon']);
                    });
                    $data['items'] = array_values($filteredItems);
                } else {
                    $data['items'] = [];
                }
            } elseif ($data['type'] === 'payment_methods') {
                // For payment methods, ensure image is provided
                if (isset($data['items']) && is_array($data['items']) && !empty($data['items'])) {
                    $filteredItems = array_filter($data['items'], function ($item) {
                        return !empty($item['image']);
                    });
                    $data['items'] = array_values($filteredItems);
                } else {
                    $data['items'] = [];
                }
            } elseif ($data['type'] === 'copyright') {
                // For copyright type, clear items field
                $data['items'] = [];
            } else {
                // For other types, keep items as is or empty array
                if (!isset($data['items']) || !is_array($data['items'])) {
                    $data['items'] = [];
                }
            }

            $item->update($data);

            return $item->fresh();
        }, 5);
    }

    /**
     * Delete a footer item.
     */
    public function deleteFooterItem(FooterItem $item)
    {
        return DB::transaction(function () use ($item) {
            return $item->delete();
        }, 5);
    }

    /**
     * Reorder footer items.
     */
    public function reorderFooterItems(array $sortedData)
    {
        return DB::transaction(function () use ($sortedData) {
            foreach ($sortedData as $itemData) {
                FooterItem::where('id', $itemData['id'])->update([
                    'sort' => $itemData['sort']
                ]);
            }
        }, 5);
    }

    /**
     * Get footer with items, optionally filtered by type.
     */
    public function getFooterWithItems(string $slug, ?string $type = null)
    {
        return DB::transaction(function () use ($slug, $type) {
            $query = Footer::where('slug', $slug)
                ->where('active', true)
                ->with(['footerItems' => function ($query) use ($type) {
                    $query->where('active', true)
                        ->when($type, function ($q) use ($type) {
                            return $q->where('type', $type);
                        })
                        ->orderBy('sort', 'asc');
                }]);

            return $query->first();
        }, 5);
    }

    /**
     * Toggle footer item active status.
     */
    public function toggleFooterItemStatus(FooterItem $item)
    {
        return DB::transaction(function () use ($item) {
            $item->update(['active' => !$item->active]);
            return $item->fresh();
        }, 5);
    }
}
