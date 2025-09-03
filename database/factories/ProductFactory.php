<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $projectTypes = ['startup', 'company', 'personal', 'community'];
        $locations = ['Kuala Lumpur', 'Penang', 'Johor', 'Selangor', 'Sabah', 'Sarawak', 'Perak', 'Kedah'];
        $tagOptions = ['tech', 'finance', 'education', 'food', 'creative', 'health', 'travel', 'ecommerce'];

        return [
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(3),
            'url' => fake()->url(),
            'tags' => fake()->randomElements($tagOptions, fake()->numberBetween(1, 4)),
            'project_type' => fake()->randomElement($projectTypes),
            'location' => fake()->randomElement($locations),
            'is_made_in_my' => true,
            'author_id' => User::factory(),
            'created_at' => fake()->dateTimeBetween('-6 months', 'now'),
        ];
    }

    /**
     * Indicate that the product is a startup.
     */
    public function startup(): static
    {
        return $this->state(fn (array $attributes) => [
            'project_type' => 'startup',
            'tags' => ['tech', 'startup', 'innovation'],
        ]);
    }

    /**
     * Indicate that the product is from a company.
     */
    public function company(): static
    {
        return $this->state(fn (array $attributes) => [
            'project_type' => 'company',
        ]);
    }

    /**
     * Indicate that the product is a personal project.
     */
    public function personal(): static
    {
        return $this->state(fn (array $attributes) => [
            'project_type' => 'personal',
        ]);
    }
}