<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Enrollment;
use Illuminate\Support\Facades\DB;

class CheckOrphanedEnrollments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'enrollments:check-orphaned';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for orphaned enrollment records';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Checking for orphaned enrollments...');

        // Check for enrollments with non-existent users
        $orphanedUsers = Enrollment::whereNotExists(function($query) {
            $query->select(DB::raw(1))
                  ->from('users')
                  ->whereRaw('users.id = enrollments.user_id');
        })->count();

        // Check for enrollments with non-existent courses
        $orphanedCourses = Enrollment::whereNotExists(function($query) {
            $query->select(DB::raw(1))
                  ->from('courses')
                  ->whereRaw('courses.id = enrollments.course_id');
        })->count();

        $this->info("Enrollments with deleted users: {$orphanedUsers}");
        $this->info("Enrollments with deleted courses: {$orphanedCourses}");

        if ($orphanedUsers > 0 || $orphanedCourses > 0) {
            $this->warn('Found orphaned enrollments! This indicates foreign key constraints are not working properly.');
            return 1;
        } else {
            $this->info('No orphaned enrollments found. Foreign key constraints are working correctly.');
            return 0;
        }
    }
} 