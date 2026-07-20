<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    public function index()
    {
        $users = User::orderBy('id')->get()->map->toApiArray()->values();

        return response()->json($users);
    }

    public function show(int $id)
    {
        $user = User::find($id);
        if (! $user) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($user->toApiArray());
    }

    public function store(Request $request)
    {
        $username = trim((string) $request->input('username', ''));
        $password = (string) $request->input('password', '');

        if ($username === '' || $password === '') {
            return response()->json(['message' => 'Username และ Password จำเป็น'], 400);
        }

        if (User::where('username', $username)->exists()) {
            return response()->json(['message' => 'Username นี้มีอยู่แล้ว'], 409);
        }

        $role = $request->input('role');
        $role = in_array($role, ['admin', 'user'], true) ? $role : 'user';

        $user = User::create([
            'username' => $username,
            'password' => $password,
            'full_name' => trim((string) ($request->input('fullName') ?: $username)),
            'email' => trim((string) $request->input('email', '')),
            'role' => $role,
            'is_active' => true,
        ]);

        return response()->json($user->toApiArray(), 201);
    }

    public function update(Request $request, int $id)
    {
        $user = User::find($id);
        if (! $user) {
            return response()->json(['message' => 'Not found'], 404);
        }

        if ($request->filled('fullName')) {
            $user->full_name = trim((string) $request->input('fullName'));
        }
        if ($request->has('email')) {
            $user->email = trim((string) $request->input('email', ''));
        }
        $role = $request->input('role');
        if (in_array($role, ['admin', 'user'], true)) {
            $user->role = $role;
        }
        if ($request->has('isActive')) {
            $user->is_active = filter_var($request->input('isActive'), FILTER_VALIDATE_BOOLEAN);
        }
        if ($request->filled('password')) {
            $user->password = $request->input('password');
        }

        $user->save();

        return response()->json($user->toApiArray());
    }

    public function destroy(int $id)
    {
        $user = User::find($id);
        if (! $user) {
            return response()->json(['message' => 'Not found'], 404);
        }

        if ($user->username === 'admin') {
            return response()->json(['message' => 'ห้ามลบบัญชี admin หลัก'], 400);
        }

        $user->delete();

        return response()->noContent();
    }
}
