<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        $status = $this->faker->randomElement(Order::STATUSES);
        // Asegura que las fechas generadas sean futuras para cumplir validaciones
        $deliveryDate = Carbon::now()->addDays($this->faker->numberBetween(0, 30));

        return [
            'client_name' => $this->faker->unique()->company(),
            'description' => $this->faker->sentences(3, true),
            'status' => $status,
            'delivery_date' => $deliveryDate->toDateString(),
        ];
    }
}
