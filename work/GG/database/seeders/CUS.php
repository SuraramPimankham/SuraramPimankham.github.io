<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class CUS extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $adduser = [
            [
                'name' => 'admin_name',
                'email' => 'admin@admin.com',
                'is_admin' => '1',
                'username' => 'admin01',
                'password' => bcrypt('12345678'),
            ],
            [
                'name' => 'user_normal_name',
                'email' => 'user@user.com',
                'is_admin' => '0',
                'username' => 'user01',
                'password' => bcrypt('12345678'),
            ]
        ];
        foreach($adduser as $key => $value)
        {
            User::create($value);
        }
    }
}
