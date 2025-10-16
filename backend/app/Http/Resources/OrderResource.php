<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transforma el recurso en un arreglo.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Expone las fechas en formato consistente para el frontend
        return [
            'id' => $this->id,
            'client_name' => $this->client_name,
            'description' => $this->description,
            'status' => $this->status,
            'delivery_date' => $this->delivery_date?->toDateString(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
