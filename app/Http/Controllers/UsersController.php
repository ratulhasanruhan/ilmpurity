<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UsersController extends Controller
{
    public function __construct(protected UserService $userService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $users = $this->userService->getUsers([
            ...$request->all(),
            'paginate' => true,
        ]);

        return Inertia::render('dashboard/users/index', compact('users'));
    }

    /**
     * Update the user's account.
     */
    public function update(UpdateUserRequest $request, string $id)
    {
        $this->userService->updateUser($id, $request->validated());

        return redirect()->back()->with('success', 'User updated successfully');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request, string $id): RedirectResponse
    {
        if (isAdmin()) {
            User::find($id)->delete();

            return redirect()->back()->with('success', 'User account deleted successfully');
        }

        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
