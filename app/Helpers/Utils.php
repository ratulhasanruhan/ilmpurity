<?php

use App\Enums\UserType;
use App\Models\TempStore;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

function isAdmin(): bool
{
    return Auth::user()->role === UserType::ADMIN->value ? true : false;
}

function setTempStore(array $data): TempStore
{
    $userTemp = TempStore::where('user_id', $data['user_id'])->first();

    if ($userTemp) {
        $userTemp->delete();
    }

    return TempStore::create($data);
}

function getTempStore(string $user_id, ?string $key = null): ?TempStore
{
    return TempStore::where('user_id', $user_id)
        ->when($key, function ($query) use ($key) {
            return $query->where('key', $key);
        })
        ->first();
}

function deleteTempStore(string $user_id, ?string $key = null): bool
{
    return TempStore::where('user_id', $user_id)
        ->when($key, function ($query) use ($key) {
            return $query->where('key', $key);
        })
        ->delete();
}

function sortTableRows(string $table, array $sortedData): bool
{
    return DB::transaction(function () use ($table, $sortedData) {
        // Recompute sort = 1..N by the order of IDs we receive
        $ids = array_column($sortedData, 'id');
        $caseParts = [];
        foreach (array_values($ids) as $index => $id) {
            $sort = $index + 1; // 1-based sequence
            $caseParts[] = "WHEN {$id} THEN {$sort}";
        }
        $caseSql = implode(' ', $caseParts);
        $idsCsv = implode(',', $ids);

        // Use backticks for table name; assumes $table is a trusted table identifier
        DB::update("UPDATE `{$table}` SET `sort` = CASE `id` {$caseSql} END, `updated_at` = ? WHERE `id` IN ({$idsCsv})", [now()]);

        return true;
    });
}

function removeNullProperties(array $array): array
{
    foreach ($array as $key => $value) {
        if (is_array($value)) {
            $array[$key] = removeNullProperties($value);

            // Remove empty arrays after processing
            if ($array[$key] === []) {
                unset($array[$key]);
            }
        } elseif ($value === null) {
            unset($array[$key]);
        }
    }

    return $array;
}

function calculateGrade(float $percentage): string
{
    if ($percentage >= 90) return 'A+';
    if ($percentage >= 85) return 'A';
    if ($percentage >= 80) return 'A-';
    if ($percentage >= 75) return 'B+';
    if ($percentage >= 70) return 'B';
    if ($percentage >= 65) return 'B-';
    if ($percentage >= 60) return 'C+';
    if ($percentage >= 55) return 'C';
    if ($percentage >= 50) return 'C-';
    if ($percentage >= 45) return 'D';
    return 'F';
}
