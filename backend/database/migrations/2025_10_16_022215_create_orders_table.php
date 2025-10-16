<?php

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
            $table->text('description'); // validamos máx. 500 por request
            $table->enum('status', ['pending','in_progress','completed'])->default('pending');
            $table->date('delivery_date');
            $table->timestamps();

            $table->unique(['client_name','delivery_date'], 'orders_unique_client_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
