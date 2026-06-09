<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class UserService
{
    public function getUsers(array $data): LengthAwarePaginator|Collection
    {
        $page = array_key_exists('per_page', $data) ? intval($data['per_page']) : 10;

        $users = User::where('role', '!=', 'admin')
            ->where('role', '!=', 'instructor')
            ->when(array_key_exists('search', $data), function ($query) use ($data) {
                return $query->where('name', 'LIKE', '%' . $data['search'] . '%')
                    ->orWhere('email', 'LIKE', '%' . $data['search'] . '%');
            })
            ->orderBy('created_at', 'desc');

        if (array_key_exists('paginate', $data) && $data['paginate']) {
            return $users->paginate($page);
        }

        return $users->get();
    }

    public function updateUser(int | string $id, array $data): void
    {
        DB::transaction(function () use ($data, $id) {
            User::find($id)->update($data);
        }, 5);
    }
}
