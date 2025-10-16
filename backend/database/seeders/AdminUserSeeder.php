<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@docuu.test'],
            [
                'name' => 'Admin Docuu',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );
    }
}

