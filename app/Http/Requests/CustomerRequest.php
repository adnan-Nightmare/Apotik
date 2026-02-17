<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustomerRequest extends FormRequest
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
            // Aturan validasi untuk 'name'
            'name' => 'required|string|max:255',  // Wajib diisi, harus berupa string, dan maksimal 255 karakter.

            // Aturan validasi untuk 'address'
            'address' => 'nullable|string|max:255',  // Tidak wajib diisi, jika ada harus berupa string dan maksimal 255 karakter.

            // Aturan validasi untuk 'phone'
            'phone' => 'nullable|string|max:20',  // Tidak wajib diisi, jika ada harus berupa string dan maksimal 20 karakter.

            // Aturan validasi untuk 'email'
            'email' => 'nullable|email|max:255',  // Tidak wajib diisi, jika ada harus berupa email yang valid dan maksimal 255 karakter.

            // Aturan validasi untuk 'gender'
            'gender' => 'required|in:pria,wanita',  // Wajib diisi, hanya boleh berisi 'pria' atau 'wanita'.
        ];
    }
}
