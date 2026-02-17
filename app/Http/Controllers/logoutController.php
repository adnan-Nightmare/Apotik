<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class logoutController extends Controller
{
    /**
     * Menangani proses logout pengguna.
     *
     * Method ini akan:
     * - Melakukan logout pengguna
     * - Mengarahkan pengguna ke halaman login
     */
    public function __invoke(Request $request){
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
