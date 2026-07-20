<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\JwtService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function __construct(private JwtService $jwt) {}

    public function login(Request $request)
    {
        $username = trim((string) $request->input('username', ''));
        $password = (string) $request->input('password', '');

        if ($username === '' || $password === '') {
            return response()->json(['message' => 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน'], 400);
        }

        $user = User::where('username', $username)->first();
        if (! $user || ! $user->is_active || ! Hash::check($password, $user->password)) {
            return response()->json(['message' => 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'], 401);
        }

        return response()->json([
            'token' => $this->jwt->createToken($user),
            'user' => $user->toApiArray(),
        ]);
    }

    public function me(Request $request)
    {
        /** @var User $user */
        $user = $request->attributes->get('auth_user');

        return response()->json($user->toApiArray());
    }
}
