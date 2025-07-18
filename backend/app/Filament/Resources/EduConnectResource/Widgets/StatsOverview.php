<?php

namespace App\Filament\Resources\EduConnectResource\Widgets;

use App\Models\User;
use App\Models\Course;
use App\Models\Enrollment;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Card;
use Filament\Widgets\StatsOverviewWidget\Chart;
use Illuminate\Support\Facades\DB;

class StatsOverview extends BaseWidget
{
    protected function getCards(): array
    {
        $enrollmentTrends = $this->getEnrollmentTrends();
        $topCourses = $this->getTopCourses();
        return [
            Card::make('Total Users', User::count())
                ->description('All registered users')
                ->descriptionIcon('heroicon-s-users')
                ->color('success'),
            Card::make('Total Courses', Course::count())
                ->description('All available courses')
                ->descriptionIcon('heroicon-s-academic-cap')
                ->color('primary'),
            Card::make('Total Enrollments', Enrollment::count())
                ->description('All course enrollments')
                ->descriptionIcon('heroicon-s-user-group')
                ->color('warning'),
            Card::make('Active Students', User::where('role', 'student')->count())
                ->description('Students only')
                ->descriptionIcon('heroicon-s-user')
                ->color('info'),
            Card::make('Enrollments (Last 6 Months)', array_sum($enrollmentTrends['data']))
                ->description('Monthly trend')
                ->chart($enrollmentTrends['data'])
                ->color('secondary'),
            Card::make('Top Courses', $topCourses['labels'][0] ?? 'N/A')
                ->description(implode(', ', array_map(fn($label, $count) => "$label ($count)", $topCourses['labels'], $topCourses['data'])))
                ->color('success'),
        ];
    }

    protected function getEnrollmentTrends(): array
    {
        $months = collect(range(0, 5))->map(function ($i) {
            return now()->subMonths($i)->format('Y-m');
        })->reverse()->values();

        $data = DB::table('enrollments')
            ->select(DB::raw("DATE_FORMAT(enrolled_at, '%Y-%m') as month, COUNT(*) as count"))
            ->where('enrolled_at', '>=', now()->subMonths(5)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month');

        $trendData = $months->map(fn($month) => $data[$month] ?? 0)->toArray();
        return ['labels' => $months->toArray(), 'data' => $trendData];
    }

    protected function getTopCourses(): array
    {
        $top = DB::table('enrollments')
            ->join('courses', 'enrollments.course_id', '=', 'courses.id')
            ->select('courses.title', DB::raw('COUNT(enrollments.id) as enroll_count'))
            ->groupBy('courses.title')
            ->orderByDesc('enroll_count')
            ->limit(3)
            ->get();
        return [
            'labels' => $top->pluck('title')->toArray(),
            'data' => $top->pluck('enroll_count')->toArray(),
        ];
    }
}
