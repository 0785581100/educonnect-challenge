<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $adminUsers = User::where('role', 'admin')->get();

        $courses = [
            [
                'title' => 'Introduction to Web Development',
                'description' => 'Learn the basics of HTML, CSS, and JavaScript to build modern websites.',
                'price' => 99.99,
                'instructor_id' => $adminUsers->first()->id,
                'status' => 'active',
            ],
            [
                'title' => 'Advanced Laravel Development',
                'description' => 'Master Laravel framework with advanced concepts and best practices.',
                'price' => 149.99,
                'instructor_id' => $adminUsers->first()->id,
                'status' => 'active',
            ],
            [
                'title' => 'React Native Mobile Development',
                'description' => 'Build cross-platform mobile apps using React Native and Expo.',
                'price' => 129.99,
                'instructor_id' => $adminUsers->last()->id,
                'status' => 'active',
            ],
            [
                'title' => 'Database Design Fundamentals',
                'description' => 'Learn database design principles, normalization, and SQL optimization.',
                'price' => 79.99,
                'instructor_id' => $adminUsers->last()->id,
                'status' => 'active',
            ],
            [
                'title' => 'DevOps and CI/CD',
                'description' => 'Master DevOps practices, Docker, and continuous integration/deployment.',
                'price' => 199.99,
                'instructor_id' => $adminUsers->first()->id,
                'status' => 'draft',
            ],
        ];

        foreach ($courses as $courseData) {
            Course::create($courseData);
        }
    }
}
