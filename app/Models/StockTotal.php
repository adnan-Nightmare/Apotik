<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockTotal extends Model
{
    protected $guarded = [];
    public function medicines()
    {
        return $this->belongsTo(medicines::class, 'medicines_id');
    }
}
