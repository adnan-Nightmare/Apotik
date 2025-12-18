<?php

use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\KategoriController;
use App\Http\Controllers\Admin\PersediaanObat;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SatuanController;
use App\Http\Controllers\Admin\TransaksiController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\logoutController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    // Cek jika pengguna sudah login
    if (Auth::check()) {
        // Jika sudah login, arahkan ke admin/dashboard
        return redirect()->route('admin.dashboard');
    }
    // Jika belum login, arahkan ke halaman login 
    return redirect()->to('/admin/login');
});

Route::controller(LoginController::class)->middleware('guest')->group(function () {
    Route::get('/admin/login', 'index')->name('login');
    Route::post('/admin/login', 'store')->name('login.store');
});

// logout
Route::post('/logout', logoutController::class);

Route::prefix('admin')->middleware('auth')->name('admin.')->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard')->middleware('permission:dashboard.index');

    $resources = [
        'roles' => [
            'controller' => RoleController::class,
            'permissions' => 'roles.index|roles.create|roles.edit|roles.delete',
            'names' => 'roles'
        ],
        'users' => [
            'controller' => UserController::class,
            'permissions' => 'users.index|users.create|users.edit|users.delete',
            'names' => 'users'
        ],
        'customers' => [
            'controller' => CustomerController::class,
            'permissions' => 'customers.index|customers.create|customers.edit|customers.delete',
        ],
        'kategori' => [
            'controller' => KategoriController::class,
            'permissions' => 'kategori.index|kategori.create|kategori.edit|kategori.delete',
            'name' => 'kategori'
        ],
        'satuan' => [
            'controller' => SatuanController::class,
            'permissions' => 'satuan.index|satuan.create|satuan.edit|satuan.delete',
            'name' => 'satuan'
        ],
        'medicine' => [
            'controller' => PersediaanObat::class,
            'permissions' => 'persediaan-obat.index|persediaan-obat.create|persediaan-obat.edit|persediaan-obat.delete',
            'name' => 'medicine'
        ],
    ];

    foreach ($resources as $name => $resource) {
        $route = Route::resource($name, $resource['controller'])
            ->middleware("permission:{$resource['permissions']}");
        if (isset($resource['names'])) {
            $route->names($resource['names']);
        }
    }

    Route::prefix('transaksi')->name('transaksi.')->middleware('permission:transaksi.index')->group(function () {
        Route::get('/', [TransaksiController::class, 'index'])->name('index');
        Route::post('/add-product', [TransaksiController::class, 'addProductToCart'])->name('add-product');
        Route::delete('/delete-from-cart/{id}', [TransaksiController::class, 'deleteFromCart'])->name('delete-from-cart');
        Route::post('/process-payment', [TransaksiController::class, 'processPayment'])->name('process-payment');
        Route::post('/get-snap-token', [TransaksiController::class, 'getSnapToken'])->name('get-snap-token');
    });

     Route::prefix('report')->name('report.')->middleware('permission:laporan.index')->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('index');
        Route::get('/generate', [ReportController::class, 'generate'])->name('generate');
    });
});