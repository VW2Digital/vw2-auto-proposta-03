<?php

namespace App\Auth;

use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Contracts\Auth\Authenticatable;

/**
 * Usuários importados do Payload guardam salt + hash pbkdf2-sha256
 * (25 000 iterações, 512 bytes). Se a senha confere, vira bcrypt.
 */
class LegacyAwareUserProvider extends EloquentUserProvider
{
    public function validateCredentials(Authenticatable $user, #[\SensitiveParameter] array $credentials): bool
    {
        if ($user->getAuthPassword()) {
            return parent::validateCredentials($user, $credentials);
        }

        $plain = (string) ($credentials['password'] ?? '');
        if ($plain === '' || ! $user->legacy_salt || ! $user->legacy_hash) {
            return false;
        }

        $computed = hash_pbkdf2('sha256', $plain, $user->legacy_salt, 25000, 1024);
        if (! hash_equals(strtolower($user->legacy_hash), $computed)) {
            return false;
        }

        $user->forceFill([
            'password' => $this->hasher->make($plain),
            'legacy_salt' => null,
            'legacy_hash' => null,
        ])->save();

        return true;
    }

    public function rehashPasswordIfRequired(Authenticatable $user, #[\SensitiveParameter] array $credentials, bool $force = false): void
    {
        if ($user->getAuthPassword()) {
            parent::rehashPasswordIfRequired($user, $credentials, $force);
        }
    }
}
