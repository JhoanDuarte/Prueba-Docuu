<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'client_name'   => ['required','string','max:100',
                // Regla de no-duplicados por (client_name, delivery_date)
                Rule::unique('orders')->where(fn($q) =>
                    $q->where('client_name', $this->client_name)
                      ->where('delivery_date', $this->delivery_date)
                ),
            ],
            'description'   => ['required','string','max:500'],
            'status'        => ['required', Rule::in(['pending','in_progress','completed'])],
            'delivery_date' => ['required','date','after_or_equal:today'],
        ];
    }
}
