<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;

class MediaService extends BaseService
{
    public function getMediaByName(Model $model, string $name): string | null
    {
        $media = $model->getMedia('*', ['name' => $name])->first();

        return $media ? $media->getFullUrl() : null;
    }

    public function addNewDeletePrev(Model $model, $image, ?string $name): string
    {
        if ($name) {
            $prevMedia = $model->getMedia('*', ['name' => $name])->first();
            if ($prevMedia) {
                $prevMedia->delete();
            }

            $newMedia = $model
                ->addMedia($image)
                ->withCustomProperties(['name' => $name])
                ->toMediaCollection();
        } else {
            if ($model->hasMedia()) {
                $model->getMedia()->first()->delete();
            }

            $newMedia = $model
                ->addMedia($image)
                ->toMediaCollection();
        }

        return $newMedia->getFullUrl();
    }

    public function addSingleFile(Model $model, $image, ?string $name)
    {
        if ($name) {
            $newMedia = $model
                ->addMedia($image)
                ->withCustomProperties(['name' => $name])
                ->toMediaCollection();
        } else {
            $newMedia = $model
                ->addMedia($image)
                ->toMediaCollection();
        }

        return $newMedia->getFullUrl();
    }
}
