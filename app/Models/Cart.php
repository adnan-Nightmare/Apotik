<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $guarded = [];

    public function medicines()
    {
        return $this->belongsTo(medicines::class);
    }
}
