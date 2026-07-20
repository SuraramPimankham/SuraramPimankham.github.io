<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Services\JwtService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JwtAuth
{
    public function __construct(private JwtService $jwt) {}

    public function handle(Request $request, Closure $next, ?string $role = null): Response
    {
        $header = $request->header('Authorization', '');
        $token = null;
        if (preg_match('/Bearer\s+(\S+)/i', $header, $m)) {
            $token = $m[1];
        }

        $userId = $this->jwt->parseUserId($token);
        if (! $userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = User::find($userId);
        if (! $user || ! $user->is_active) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if ($role && $user->role !== $role) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->attributes->set('auth_user', $user);
        $request->setUserResolver(fn () => $user);

        return $next($request);
    }
}
