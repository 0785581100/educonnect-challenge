<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create admin users
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@educonnect.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'John Instructor',
            'email' => 'john@educonnect.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create student users
        User::create([
            'name' => 'Alice Student',
            'email' => 'alice@educonnect.com',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);

        User::create([
            'name' => 'Bob Student',
            'email' => 'bob@educonnect.com',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);

        User::create([
            'name' => 'Carol Student',
            'email' => 'carol@educonnect.com',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);

        // Create additional random students
        User::factory(10)->create([
            'role' => 'student',
        ]);
    }
}
