<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin local (ADMIN_EMAIL / ADMIN_PASSWORD no .env).
        if (env('ADMIN_EMAIL') && env('ADMIN_PASSWORD')) {
            User::query()->updateOrCreate(
                ['email' => env('ADMIN_EMAIL')],
                ['name' => 'Admin', 'password' => env('ADMIN_PASSWORD')],
            );
        }
    }
}
