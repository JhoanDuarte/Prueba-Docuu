<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    public const STATUSES = ['pending', 'in_progress', 'completed'];

    protected $fillable = [
        'client_name',
        'description',
        'status',
        'delivery_date',
    ];

    protected $casts = [
        'delivery_date' => 'date',
    ];
}
