<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PersediaanObatRequest extends FormRequest
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
            "gambar_obat" => [
                $this->isMethod('post') ? 'required' : 'nullable',
                'image',
                'mimes:jpeg,png,jpg',
                'max:2048',
            ],
            "nama_obat" => 'required|string|max:255',
            'nomor_batch' => 'required|string|max:255',
            'kategori_id' => 'required|exists:kategoris,id',
            'satuan_id' => 'required|exists:satuans,id',
            'stok' => 'required',
            'harga' => 'required',
            'kadaluarsa' => 'required',
        ];
    }
}
