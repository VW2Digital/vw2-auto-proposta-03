<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

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

        // Conteúdo: importa do Payload se o banco antigo estiver disponível.
        if (File::exists(config('cms.payload_db'))) {
            Artisan::call('cms:import-payload', ['--fresh' => true], $this->command?->getOutput());
        }
    }
}
