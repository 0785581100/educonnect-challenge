<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    /**
     * List courses with pagination.
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $courses = Course::with('instructor')
            ->where('status', 'active')
            ->paginate($perPage);

        // Add instructor names to each course
        $courses->getCollection()->transform(function ($course) {
            $course->instructor_name = $course->instructor ? $course->instructor->name : 'Unknown Instructor';
            return $course;
        });

        return response()->json($courses);
    }

    /**
     * Show course details.
     */
    public function show($id)
    {
        $course = Course::with('instructor', 'enrollments.user')
            ->where('status', 'active')
            ->find($id);

        if (! $course) {
            return response()->json(['message' => 'Course not found.'], 404);
        }

        // Add instructor name to the course object
        $course->instructor_name = $course->instructor ? $course->instructor->name : 'Unknown Instructor';

        return response()->json($course);
    }

    /**
     * Enroll the authenticated user in a course.
     */
    public function enroll(Request $request, $id)
    {
        $user = $request->user();
        $course = Course::where('status', 'active')->find($id);

        if (! $course) {
            return response()->json(['message' => 'Course not found.'], 404);
        }

        // Prevent duplicate enrollment
        $alreadyEnrolled = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->exists();
        if ($alreadyEnrolled) {
            return response()->json(['message' => 'Already enrolled in this course.'], 409);
        }

        $enrollment = Enrollment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'progress_percentage' => 0,
            'enrolled_at' => now(),
        ]);

        return response()->json([
            'message' => 'Enrolled successfully.',
            'enrollment' => $enrollment,
        ]);
    }

    /**
     * List the authenticated user's enrolled courses.
     */
    public function myCourses(Request $request)
    {
        $user = $request->user();
        $enrollments = Enrollment::with('course.instructor')
            ->where('user_id', $user->id)
            ->get();

        $courses = $enrollments->map(function ($enrollment) {
            $course = $enrollment->course;
            $course->progress_percentage = $enrollment->progress_percentage;
            $course->enrolled_at = $enrollment->enrolled_at;
            // Add instructor name to the course object
            $course->instructor_name = $course->instructor ? $course->instructor->name : 'Unknown Instructor';
            return $course;
        });

        return response()->json($courses);
    }
}
