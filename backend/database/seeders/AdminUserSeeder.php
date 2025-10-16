<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin Docuu',
                'email' => 'admin@docuu.test',
                'password' => 'admin123',
                'role' => 'admin',
            ],
            [
                'name' => 'Operator Docuu',
                'email' => 'operator@docuu.test',
                'password' => 'operator123',
                'role' => 'operator',
            ],
            [
                'name' => 'Viewer Docuu',
                'email' => 'viewer@docuu.test',
                'password' => 'viewer123',
                'role' => 'viewer',
            ],
        ];

        foreach ($users as $user) {
            // Crea o actualiza los usuarios base con contrasenas cifradas y roles definidos
            User::updateOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'password' => Hash::make($user['password']),
                    'role' => $user['role'],
                ]
            );
        }
    }
}
