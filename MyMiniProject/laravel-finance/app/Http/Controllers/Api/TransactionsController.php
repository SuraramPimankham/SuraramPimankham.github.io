<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use App\Services\SlipStorage;
use Illuminate\Http\Request;

class TransactionsController extends Controller
{
    public function __construct(private SlipStorage $slips) {}

    public function index(Request $request)
    {
        /** @var User $auth */
        $auth = $request->attributes->get('auth_user');
        $q = Transaction::with('user')->orderByDesc('occurred_at')->orderByDesc('id');

        if (! $auth->isAdmin()) {
            $q->where('user_id', $auth->id);
        } elseif ($request->filled('userId')) {
            $q->where('user_id', (int) $request->query('userId'));
        }

        if ($request->filled('type')) {
            $q->where('type', $request->query('type'));
        }
        if ($request->filled('category')) {
            $q->where('category', 'like', '%'.$request->query('category').'%');
        }

        return response()->json($q->get()->map->toApiArray()->values());
    }

    public function show(Request $request, int $id)
    {
        /** @var User $auth */
        $auth = $request->attributes->get('auth_user');
        $t = Transaction::with('user')->find($id);
        if (! $t) {
            return response()->json(['message' => 'Not found'], 404);
        }
        if (! $auth->isAdmin() && $t->user_id !== $auth->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($t->toApiArray());
    }

    public function store(Request $request)
    {
        return $this->upsert($request, null);
    }

    public function update(Request $request, int $id)
    {
        return $this->upsert($request, $id);
    }

    public function destroy(Request $request, int $id)
    {
        /** @var User $auth */
        $auth = $request->attributes->get('auth_user');
        $t = Transaction::find($id);
        if (! $t) {
            return response()->json(['message' => 'Not found'], 404);
        }
        if (! $auth->isAdmin() && $t->user_id !== $auth->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $this->slips->deleteIfExists($t->slip_path);
        $t->delete();

        return response()->noContent();
    }

    private function upsert(Request $request, ?int $id)
    {
        /** @var User $auth */
        $auth = $request->attributes->get('auth_user');

        $title = trim((string) $request->input('title', ''));
        $category = trim((string) $request->input('category', ''));
        $type = strtolower(trim((string) $request->input('type', '')));
        $amount = (float) $request->input('amount', 0);

        if ($title === '') {
            return response()->json(['message' => 'กรุณาระบุหัวข้อ'], 400);
        }
        if ($category === '') {
            return response()->json(['message' => 'กรุณาระบุหมวดหมู่'], 400);
        }
        if (! in_array($type, ['income', 'expense'], true)) {
            return response()->json(['message' => 'Type ต้องเป็น income หรือ expense'], 400);
        }
        if ($amount <= 0) {
            return response()->json(['message' => 'จำนวนเงินต้องมากกว่า 0'], 400);
        }

        $ownerId = $auth->id;
        if ($auth->isAdmin() && (int) $request->input('userId') > 0) {
            $ownerId = (int) $request->input('userId');
        }

        $owner = User::find($ownerId);
        if (! $owner) {
            return response()->json(['message' => 'ไม่พบผู้ใช้'], 400);
        }

        if ($id) {
            $t = Transaction::with('user')->find($id);
            if (! $t) {
                return response()->json(['message' => 'Not found'], 404);
            }
            if (! $auth->isAdmin() && $t->user_id !== $auth->id) {
                return response()->json(['message' => 'Forbidden'], 403);
            }
        } else {
            $t = new Transaction;
        }

        $t->user_id = $ownerId;
        $t->type = $type;
        $t->category = $category;
        $t->title = $title;
        $t->note = trim((string) $request->input('note', '')) ?: null;
        $t->amount = $amount;
        if ($request->filled('occurredAt')) {
            $t->occurred_at = $request->input('occurredAt');
        } elseif (! $id) {
            $t->occurred_at = now();
        }

        $t->save();

        try {
            $clear = filter_var($request->input('clearSlip'), FILTER_VALIDATE_BOOLEAN);
            if ($clear) {
                $this->slips->deleteIfExists($t->slip_path);
                $t->slip_path = null;
            }

            if ($request->hasFile('slip')) {
                $this->slips->deleteIfExists($t->slip_path);
                $t->slip_path = $this->slips->save($request->file('slip'), $t->id, $owner->username);
            }
            $t->save();
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }

        $t->load('user');

        return response()->json($t->toApiArray(), $id ? 200 : 201);
    }
}
