<?php

namespace Database\Seeders;

use App\Models\Enrollment;
use App\Models\User;
use App\Models\Course;
use Illuminate\Database\Seeder;

class EnrollmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $students = User::where('role', 'student')->get();
        $courses = Course::where('status', 'active')->get();

        // Create some sample enrollments
        $enrollments = [
            [
                'user_id' => $students->first()->id,
                'course_id' => $courses->first()->id,
                'progress_percentage' => 75.50,
                'enrolled_at' => now()->subDays(30),
            ],
            [
                'user_id' => $students->first()->id,
                'course_id' => $courses->get(1)->id,
                'progress_percentage' => 25.00,
                'enrolled_at' => now()->subDays(15),
            ],
            [
                'user_id' => $students->get(1)->id,
                'course_id' => $courses->first()->id,
                'progress_percentage' => 100.00,
                'enrolled_at' => now()->subDays(45),
            ],
            [
                'user_id' => $students->get(1)->id,
                'course_id' => $courses->get(2)->id,
                'progress_percentage' => 50.00,
                'enrolled_at' => now()->subDays(20),
            ],
            [
                'user_id' => $students->get(2)->id,
                'course_id' => $courses->get(3)->id,
                'progress_percentage' => 10.00,
                'enrolled_at' => now()->subDays(5),
            ],
        ];

        foreach ($enrollments as $enrollmentData) {
            Enrollment::firstOrCreate([
                'user_id' => $enrollmentData['user_id'],
                'course_id' => $enrollmentData['course_id'],
            ], $enrollmentData);
        }

        // Create some random enrollments
        for ($i = 0; $i < 15; $i++) {
            $student = $students->random();
            $course = $courses->random();
            
            Enrollment::firstOrCreate([
                'user_id' => $student->id,
                'course_id' => $course->id,
            ], [
                'progress_percentage' => rand(0, 100),
                'enrolled_at' => now()->subDays(rand(1, 60)),
            ]);
        }
    }
}
