<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function show(Request $request)
    {
        /** @var User $auth */
        $auth = $request->attributes->get('auth_user');
        $q = Transaction::with('user');

        if (! $auth->isAdmin()) {
            $q->where('user_id', $auth->id);
        } elseif ($request->filled('userId')) {
            $q->where('user_id', (int) $request->query('userId'));
        }

        $all = $q->get();
        $income = $all->where('type', 'income');
        $expense = $all->where('type', 'expense');

        $totalIncome = (float) $income->sum('amount');
        $totalExpense = (float) $expense->sum('amount');

        $byCategory = $all
            ->groupBy(fn ($t) => $t->category.'|'.$t->type)
            ->map(function ($group) {
                $first = $group->first();

                return [
                    'category' => $first->category,
                    'type' => $first->type,
                    'total' => (float) $group->sum('amount'),
                ];
            })
            ->sortByDesc('total')
            ->values()
            ->all();

        $byMonth = $all
            ->groupBy(fn ($t) => optional($t->occurred_at)?->format('Y-m') ?: 'unknown')
            ->sortKeys()
            ->map(function ($group, $month) {
                return [
                    'month' => $month,
                    'income' => (float) $group->where('type', 'income')->sum('amount'),
                    'expense' => (float) $group->where('type', 'expense')->sum('amount'),
                ];
            })
            ->values()
            ->all();

        $recent = $all
            ->sortByDesc(fn ($t) => [$t->occurred_at, $t->id])
            ->take(8)
            ->values()
            ->map->toApiArray()
            ->all();

        return response()->json([
            'totalIncome' => $totalIncome,
            'totalExpense' => $totalExpense,
            'balance' => $totalIncome - $totalExpense,
            'incomeCount' => $income->count(),
            'expenseCount' => $expense->count(),
            'byCategory' => $byCategory,
            'byMonth' => $byMonth,
            'recent' => $recent,
        ]);
    }
}
