<?php

namespace App\Services;

use App\Models\User;

class JwtService
{
    public function createToken(User $user): string
    {
        $header = $this->b64(['alg' => 'HS256', 'typ' => 'JWT']);
        $payload = $this->b64([
            'sub' => (string) $user->id,
            'role' => $user->role,
            'username' => $user->username,
            'iat' => time(),
            'exp' => time() + 60 * 60 * 24 * 7,
        ]);
        $sig = $this->sign("$header.$payload");

        return "$header.$payload.$sig";
    }

    public function parseUserId(?string $token): ?int
    {
        if (! $token) {
            return null;
        }

        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$header, $payload, $sig] = $parts;
        if (! hash_equals($this->sign("$header.$payload"), $sig)) {
            return null;
        }

        $data = json_decode($this->ub64($payload), true);
        if (! is_array($data)) {
            return null;
        }

        if (($data['exp'] ?? 0) < time()) {
            return null;
        }

        return isset($data['sub']) ? (int) $data['sub'] : null;
    }

    private function sign(string $data): string
    {
        return rtrim(strtr(base64_encode(hash_hmac('sha256', $data, $this->secret(), true)), '+/', '-_'), '=');
    }

    private function secret(): string
    {
        return (string) config('app.key');
    }

    private function b64(array $data): string
    {
        return rtrim(strtr(base64_encode(json_encode($data)), '+/', '-_'), '=');
    }

    private function ub64(string $data): string
    {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }

        return (string) base64_decode(strtr($data, '-_', '+/'));
    }
}
