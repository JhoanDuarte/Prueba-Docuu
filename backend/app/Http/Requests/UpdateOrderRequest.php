<?php

namespace App\Http\Requests;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;

class UpdateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        /** @var \App\Models\Order|null $order */
        $order = $this->route('order');

        $clientName = $this->input('client_name', $order?->client_name);
        $deliveryDate = $this->input(
            'delivery_date',
            $order?->delivery_date?->toDateString()
        );

        return [
            'client_name' => [
                'sometimes',
                'required',
                'string',
                'max:100',
                // Asegura que al actualizar no exista otra orden con el mismo cliente y fecha objetivo
                Rule::unique('orders')
                    ->ignoreModel($order)
                    ->where(fn ($q) => $q
                        ->where('client_name', $clientName)
                        ->where('delivery_date', $deliveryDate)),
            ],
            'description' => ['sometimes', 'required', 'string', 'max:500'],
            'status' => ['sometimes', 'required', Rule::in(Order::STATUSES)],
            'delivery_date' => [
                'sometimes',
                'required',
                'date',
                'after_or_equal:today',
                // Evita duplicar fechas para el mismo cliente al actualizar solo la fecha
                Rule::unique('orders')
                    ->ignoreModel($order)
                    ->where(fn ($q) => $q->where('client_name', $clientName)),
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('client_name')) {
            $this->merge(['client_name' => trim((string) $this->client_name)]);
        }

        if ($this->has('description')) {
            $this->merge(['description' => trim((string) $this->description)]);
        }

        if ($this->has('status')) {
            $this->merge(['status' => trim((string) $this->status)]);
        }

        if ($this->has('delivery_date')) {
            try {
                $normalized = Carbon::parse($this->delivery_date)->toDateString();
                $this->merge(['delivery_date' => $normalized]);
            } catch (\Throwable) {
                // conserva el valor original para que el validador pueda marcar el error
            }
        }
    }
}
