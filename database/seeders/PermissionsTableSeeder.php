<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $resources = [
            'dashboard' => ['index','view_persediaan_obat' , 'view_sales', 'view_transactions', 'view_products', 'view_customers'],
            'users' => ['index', 'create', 'edit', 'delete'],
            'roles' => ['index', 'create', 'edit', 'delete'],
            'persediaan-obat' => ['index', 'create', 'edit', 'delete'],
            'satuan' => ['index', 'create', 'edit', 'delete'],
            'kategori' => ['index', 'create', 'edit', 'delete'],
            'customers' => ['index', 'create', 'edit', 'delete'],
            'stocks' => ['index', 'create', 'edit', 'delete'],
            'transaksi' => ['index'],
            'laporan' => ['index'],
        ];

        foreach ($resources as $resource => $actions) {
            foreach ($actions as $action) {
                $permissionName = "{$resource}.{$action}";

                Permission::firstOrCreate(['name' => $permissionName, 'guard_name' => 'web']);
            }
        }
    }
}
