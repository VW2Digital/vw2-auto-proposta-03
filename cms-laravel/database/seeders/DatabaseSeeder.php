<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin local/inicial (ADMIN_EMAIL / ADMIN_PASSWORD no .env).
        $email = config('cms.admin_email') ?: env('ADMIN_EMAIL');
        $password = config('cms.admin_password') ?: env('ADMIN_PASSWORD');

        if ($email && $password) {
            User::query()->updateOrCreate(
                ['email' => $email],
                ['name' => 'Admin', 'password' => $password],
            );
        }
    }
}
