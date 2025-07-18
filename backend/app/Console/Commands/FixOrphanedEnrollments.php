<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Enrollment;
use Illuminate\Support\Facades\DB;

class FixOrphanedEnrollments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'enrollments:fix-orphaned {--dry-run : Show what would be deleted without actually deleting}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix orphaned enrollment records by deleting them';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $dryRun = $this->option('dry-run');
        
        if ($dryRun) {
            $this->info('DRY RUN MODE - No records will be deleted');
        }

        $this->info('Finding orphaned enrollments...');

        // Find enrollments with non-existent users
        $orphanedUsers = Enrollment::whereNotExists(function($query) {
            $query->select(DB::raw(1))
                  ->from('users')
                  ->whereRaw('users.id = enrollments.user_id');
        })->get();

        // Find enrollments with non-existent courses
        $orphanedCourses = Enrollment::whereNotExists(function($query) {
            $query->select(DB::raw(1))
                  ->from('courses')
                  ->whereRaw('courses.id = enrollments.course_id');
        })->get();

        $totalOrphaned = $orphanedUsers->count() + $orphanedCourses->count();

        if ($totalOrphaned === 0) {
            $this->info('No orphaned enrollments found.');
            return 0;
        }

        $this->warn("Found {$totalOrphaned} orphaned enrollments:");
        $this->warn("- {$orphanedUsers->count()} with deleted users");
        $this->warn("- {$orphanedCourses->count()} with deleted courses");

        if ($dryRun) {
            $this->info('These records would be deleted in normal mode.');
            return 0;
        }

        if ($this->confirm('Do you want to delete these orphaned enrollments?')) {
            // Delete orphaned enrollments
            $deletedUsers = $orphanedUsers->count();
            $deletedCourses = $orphanedCourses->count();

            $orphanedUsers->each(function($enrollment) {
                $enrollment->delete();
            });

            $orphanedCourses->each(function($enrollment) {
                $enrollment->delete();
            });

            $this->info("Successfully deleted {$deletedUsers} enrollments with deleted users");
            $this->info("Successfully deleted {$deletedCourses} enrollments with deleted courses");
            $this->info("Total deleted: " . ($deletedUsers + $deletedCourses));
        } else {
            $this->info('Operation cancelled.');
        }

        return 0;
    }
} 