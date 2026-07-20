<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class SlipStorage
{
    private const MAX_BYTES = 5 * 1024 * 1024;

    private const ALLOWED = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    public function save(?UploadedFile $file, int $transactionId, string $username): ?string
    {
        if (! $file) {
            return null;
        }

        if ($file->getSize() > self::MAX_BYTES) {
            throw new \InvalidArgumentException('ไฟล์สลิปต้องไม่เกิน 5 MB');
        }

        $ext = strtolower($file->getClientOriginalExtension() ?: $file->extension());
        if (! in_array($ext, self::ALLOWED, true)) {
            throw new \InvalidArgumentException('รองรับเฉพาะรูป .jpg .png .gif .webp');
        }

        $folder = $this->safeFolder($username);
        $dir = public_path("uploads/slips/{$folder}");
        File::ensureDirectoryExists($dir);

        $name = 'slip-'.$transactionId.'-'.Str::random(8).'.'.$ext;
        $file->move($dir, $name);

        return "/uploads/slips/{$folder}/{$name}";
    }

    public function deleteIfExists(?string $relativePath): void
    {
        if (! $relativePath) {
            return;
        }

        $relative = ltrim(str_replace('\\', '/', $relativePath), '/');
        if (! str_starts_with($relative, 'uploads/slips/')) {
            return;
        }

        $full = public_path($relative);
        if (is_file($full)) {
            @unlink($full);
        }
    }

    public function safeFolder(string $username): string
    {
        $safe = preg_replace('/[^a-zA-Z0-9._-]/', '_', trim($username)) ?: 'unknown';

        return $safe;
    }
}
