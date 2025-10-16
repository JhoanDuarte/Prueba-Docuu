<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::query();

        if ($request->filled('client_name')) {
            $query->where('client_name', $request->client_name);
        }
        if ($request->filled('delivery_date')) {
            $query->whereDate('delivery_date', $request->delivery_date);
        }

        $orders = $query->orderByDesc('id')->paginate(10);

        return response()->json([
            'data' => $orders->items(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'per_page'     => $orders->perPage(),
                'total'        => $orders->total(),
                'last_page'    => $orders->lastPage(),
            ],
        ]);
    }

    public function store(StoreOrderRequest $request)
    {
        $order = Order::create($request->validated());

        return response()->json([
            'data' => $order,
        ], 201);
    }

    public function show(Order $order)
    {
        return response()->json(['data' => $order]);
    }

    public function update(UpdateOrderRequest $request, Order $order)
    {
        $order->update($request->validated());

        return response()->json(['data' => $order]);
    }

    public function destroy(Order $order)
    {
        $order->delete();
        return response()->json([], 204);
    }
}
