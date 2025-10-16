<?php

use App\Models\Order;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('client_name', 100);
            $table->text('description'); // la capa de validacion aplica el maximo de 500 caracteres
            $table->enum('status', Order::STATUSES)->default('pending');
            $table->date('delivery_date');
            $table->timestamps();

            // Protege contra ordenes duplicadas por cliente y fecha de entrega
            $table->unique(['client_name', 'delivery_date'], 'orders_unique_client_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
