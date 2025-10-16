<?php

namespace Database\Seeders;

use App\Models\Order;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        // Genera un conjunto inicial de ordenes para pruebas manuales del modulo
        Order::factory()
            ->count(5)
            ->create();
    }
}
