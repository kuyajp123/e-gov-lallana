<?php

namespace Database\Factories;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Announcement>
 */
class AnnouncementFactory extends Factory
{
    protected $model = Announcement::class;

    public function definition(): array
    {
        $title = fake()->sentence(5);

        return [
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->randomNumber(4),
            'excerpt' => fake()->paragraph(2),
            'content' => '<p>'.fake()->paragraph(5).'</p>',
            'category' => fake()->randomElement(['Advisory', 'Event', 'Meeting', 'Emergency']),
            'is_published' => true,
            'published_at' => now(),
            'author_id' => User::factory(),
            'banner_file_id' => null,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn () => [
            'is_published' => false,
            'published_at' => null,
        ]);
    }

    public function advisory(): static
    {
        return $this->state(fn () => [
            'category' => 'Advisory',
        ]);
    }

    public function event(): static
    {
        return $this->state(fn () => [
            'category' => 'Event',
        ]);
    }

    public function meeting(): static
    {
        return $this->state(fn () => [
            'category' => 'Meeting',
        ]);
    }

    public function emergency(): static
    {
        return $this->state(fn () => [
            'category' => 'Emergency',
        ]);
    }
}
