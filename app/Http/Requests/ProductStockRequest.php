<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductStockRequest extends FormRequest
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
            'medicines_id' => 'required|exists:medicines,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'stock_quantity' => 'required|integer|min:1',
            'nomor_batch' => 'required|string|max:255',
            'harga_beli' => 'required',
            'kadaluarsa' => 'required|date',
            'received_at' => 'required|date',
        ];
    }
}
