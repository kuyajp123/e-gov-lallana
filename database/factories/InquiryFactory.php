<?php

namespace Database\Factories;

use App\Models\Inquiry;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Inquiry>
 */
class InquiryFactory extends Factory
{
    protected $model = Inquiry::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'subject' => fake()->sentence(4),
            'message' => fake()->paragraph(),
            'ip_address' => fake()->ipv4(),
            'status' => 'pending',
            'admin_notes' => null,
            'resolved_by_id' => null,
            'resolved_at' => null,
        ];
    }

    /**
     * Indicate that the inquiry is resolved.
     */
    public function resolved(?User $admin = null): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'resolved',
            'admin_notes' => 'Addressed and contacted resident.',
            'resolved_by_id' => $admin->id ?? User::factory(),
            'resolved_at' => now(),
        ]);
    }
}
