<?php

namespace Database\Seeders;

use App\Models\Announcement;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        $announcements = [
            [
                'title' => 'Launch of the Barangay Lallana E-Government Portal',
                'slug' => 'launch-of-barangay-lallana-e-gov-portal',
                'excerpt' => 'Barangay Lallana officially rolls out its digital platform for fast and paperless document requesting and household profiling.',
                'content' => '<p>We are proud to announce the official launch of the <strong>Barangay Lallana E-Government Web-Based Information System</strong>.</p><p>Residents can now submit online requests for Barangay Clearances, Residency Certificates, and Indigency Certificates, as well as register their household profiles digitally.</p>',
                'category' => 'Advisory',
                'is_published' => true,
                'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'General Community Assembly & Health Caravan',
                'slug' => 'general-community-assembly-and-health-caravan',
                'excerpt' => 'Join us this Saturday at the Barangay Hall Multi-Purpose Covered Court for free medical checkups, dental services, and community dialogue.',
                'content' => '<p>All residents of Barangay Lallana are cordially invited to attend our upcoming <strong>Community Assembly and Free Health Caravan</strong>.</p><p>Services include general medical consultations, blood pressure screening, free vitamins distribution, and registration assistance for senior citizens and PWDs.</p>',
                'category' => 'Event',
                'is_published' => true,
                'published_at' => now()->subDay(),
            ],
            [
                'title' => 'Scheduled Clean-Up Drive and Anti-Dengue Fogging Operations',
                'slug' => 'scheduled-clean-up-drive-and-anti-dengue-fogging',
                'excerpt' => 'Barangay health workers and sanitation volunteers will conduct anti-dengue misting and clean-up operations across all Puroks.',
                'content' => '<p>In line with our continuous efforts to maintain a clean and disease-free community, Barangay Lallana will be conducting synchronized clean-up drives and misting operations across Purok 1 to Purok 6.</p>',
                'category' => 'Advisory',
                'is_published' => true,
                'published_at' => now(),
            ],
        ];

        foreach ($announcements as $item) {
            Announcement::updateOrCreate(['slug' => $item['slug']], $item);
        }
    }
}
