<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $order = $this->route('order'); // Model binding: App\Models\Order

        return [
            'client_name'   => ['sometimes','required','string','max:100',
                // Unicidad compuesta (client_name, delivery_date) ignorando el registro actual
                Rule::unique('orders')
                    ->ignoreModel($order)
                    ->where(fn($q) => $q->where('client_name', $this->client_name ?? $order->client_name)
                                         ->where('delivery_date', $this->delivery_date ?? $order->delivery_date)),
            ],
            'description'   => ['sometimes','required','string','max:500'],
            'status'        => ['sometimes','required', Rule::in(['pending','in_progress','completed'])],
            'delivery_date' => ['sometimes','required','date','after_or_equal:today'],
        ];
    }
}
