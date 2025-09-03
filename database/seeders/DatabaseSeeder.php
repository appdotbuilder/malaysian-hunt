<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test users
        $users = User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Create products with votes and comments
        $products = \App\Models\Product::factory(25)->create();

        // Create votes for products (simulate popularity)
        foreach ($products as $product) {
            $voterCount = fake()->numberBetween(0, min(8, $users->count()));
            $voters = $users->random($voterCount);
            
            foreach ($voters as $voter) {
                try {
                    \App\Models\Vote::create([
                        'user_id' => $voter->id,
                        'product_id' => $product->id,
                        'created_at' => fake()->dateTimeBetween('-3 months', 'now'),
                    ]);
                } catch (\Illuminate\Database\QueryException $e) {
                    // Skip if duplicate vote (unique constraint)
                }
            }
        }

        // Create comments for products
        foreach ($products as $product) {
            $commentCount = fake()->numberBetween(0, 5);
            
            for ($i = 0; $i < $commentCount; $i++) {
                \App\Models\Comment::create([
                    'content' => fake()->paragraph(fake()->numberBetween(1, 3)),
                    'author_id' => $users->random()->id,
                    'product_id' => $product->id,
                    'created_at' => fake()->dateTimeBetween('-2 months', 'now'),
                ]);
            }
        }
    }
}
