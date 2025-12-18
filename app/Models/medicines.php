<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class medicines extends Model
{
    protected $guarded = [];

    public function kategori(){
        return $this->belongsTo(kategori::class);
    }

    public function satuan(){
        return $this->belongsTo(satuan::class);
    }
}
