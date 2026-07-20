<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'category',
        'title',
        'note',
        'amount',
        'occurred_at',
        'slip_path',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'occurred_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function toApiArray(): array
    {
        return [
            'id' => $this->id,
            'userId' => $this->user_id,
            'userName' => $this->user?->full_name,
            'type' => $this->type,
            'category' => $this->category,
            'title' => $this->title,
            'note' => $this->note,
            'amount' => (float) $this->amount,
            'occurredAt' => optional($this->occurred_at)?->toIso8601String(),
            'slipPath' => $this->slip_path,
            'createdAt' => optional($this->created_at)?->toIso8601String(),
        ];
    }
}
