<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['client_name','description','status','delivery_date'];
    protected $casts = [
        'delivery_date' => 'date:Y-m-d',
    ];
}
