<?php

namespace App\Http\Requests;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determina si el usuario esta autorizado para enviar esta solicitud.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Obtiene las reglas de validacion que aplican a la solicitud.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'client_name'   => ['required', 'string', 'max:100',
                // Garantiza que el par cliente-fecha sea unico en la tabla
                Rule::unique('orders')->where(fn ($q) =>
                    $q->where('client_name', $this->client_name)
                        ->where('delivery_date', $this->delivery_date)
                ),
            ],
            'description'   => ['required', 'string', 'max:500'],
            'status'        => ['required', Rule::in(Order::STATUSES)],
            'delivery_date' => ['required', 'date', 'after_or_equal:today'],
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
