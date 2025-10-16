<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 10);
        // Limita la paginacion para evitar respuestas demasiado grandes
        $perPage = $perPage > 0 ? min($perPage, 100) : 10;

        $query = Order::query();

        $search = $request->string('search')->trim();
        if ($search->isNotEmpty()) {
            // Filtro libre por cliente o descripcion segun el termino ingresado
            $query->where(function ($inner) use ($search) {
                $term = $search->value();
                $inner->where('client_name', 'like', "%{$term}%")
                    ->orWhere('description', 'like', "%{$term}%");
            });
        }

        $clientName = $request->string('client_name')->trim();
        if ($clientName->isNotEmpty()) {
            $query->where('client_name', $clientName->value());
        }

        if ($request->filled('delivery_date')) {
            $query->whereDate('delivery_date', $request->date('delivery_date'));
        }

        $status = $request->string('status')->trim()->value();
        if ($status && in_array($status, Order::STATUSES, true)) {
            $query->where('status', $status);
        }

        if ($request->filled('exclude_id')) {
            // Evita choques en la validacion de duplicados de frontend al comparar contra un registro existente
            $query->where('id', '!=', (int) $request->query('exclude_id'));
        }

        $paginator = $query
            ->orderByDesc('delivery_date')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->appends($request->query());

        $data = $paginator->getCollection()
            // Serializa cada orden con el recurso para mantener consistencia en las respuestas
            ->map(fn ($order) => (new OrderResource($order))->toArray($request))
            ->values();

        return response()->json([
            'data' => $data,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ],
        ]);
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $order = Order::create($request->validated());

        return (new OrderResource($order))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Order $order): JsonResponse
    {
        return (new OrderResource($order))->response();
    }

    public function update(UpdateOrderRequest $request, Order $order): JsonResponse
    {
        $order->update($request->validated());

        return (new OrderResource($order))->response();
    }

    public function destroy(Order $order): JsonResponse
    {
        $order->delete();

        return response()->noContent();
    }
}
