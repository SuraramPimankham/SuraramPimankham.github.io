<?php

namespace Database\Seeders;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (User::exists()) {
            return;
        }

        $admin = User::create([
            'username' => 'admin',
            'password' => 'admin123',
            'full_name' => 'ผู้ดูแลระบบ',
            'email' => 'admin@finance.local',
            'role' => 'admin',
            'is_active' => true,
        ]);

        $user = User::create([
            'username' => 'user',
            'password' => 'user123',
            'full_name' => 'สมชาย ใจดี',
            'email' => 'user@finance.local',
            'role' => 'user',
            'is_active' => true,
        ]);

        $now = now();

        Transaction::insert([
            [
                'user_id' => $user->id,
                'type' => 'income',
                'category' => 'เงินเดือน',
                'title' => 'เงินเดือนประจำเดือน',
                'note' => 'โอนเข้าบัญชี',
                'amount' => 35000,
                'occurred_at' => $now->copy()->subDays(20),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'user_id' => $user->id,
                'type' => 'income',
                'category' => 'ฟรีแลนซ์',
                'title' => 'งานออกแบบเว็บ',
                'note' => null,
                'amount' => 8000,
                'occurred_at' => $now->copy()->subDays(10),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'user_id' => $user->id,
                'type' => 'expense',
                'category' => 'อาหาร',
                'title' => 'ค่าอาหารกลางวัน',
                'note' => 'ร้านใกล้ที่ทำงาน',
                'amount' => 250,
                'occurred_at' => $now->copy()->subDays(3),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'user_id' => $user->id,
                'type' => 'expense',
                'category' => 'เดินทาง',
                'title' => 'เติมน้ำมัน',
                'note' => null,
                'amount' => 1200,
                'occurred_at' => $now->copy()->subDays(5),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'user_id' => $user->id,
                'type' => 'expense',
                'category' => 'ช้อปปิ้ง',
                'title' => 'ซื้อของใช้ในบ้าน',
                'note' => null,
                'amount' => 890,
                'occurred_at' => $now->copy()->subDays(1),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'user_id' => $admin->id,
                'type' => 'expense',
                'category' => 'สำนักงาน',
                'title' => 'ค่าโดเมน',
                'note' => null,
                'amount' => 450,
                'occurred_at' => $now->copy()->subDays(7),
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}
