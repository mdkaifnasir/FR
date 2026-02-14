<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Student; // Ensure Student model is imported
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Attendance::with(['student', 'course']);

        if ($request->has('course_id') && $request->course_id) {
            $query->where('course_id', $request->course_id);
        }
        if ($request->has('date') && $request->date) {
            $query->whereDate('detected_at', $request->date);
        }
        if ($request->has('student_id') && $request->student_id) {
            $query->where('student_id', $request->student_id);
        }
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        return $query->latest('detected_at')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'course_id' => 'required|exists:courses,id',
            'status' => 'required|in:present,absent,late',
            'method' => 'required|in:auto,manual',
            'detected_at' => 'required|date',
        ]);

        // Prevent duplicate attendance for the same student, course, and day (roughly)
        // Or maybe strictly same timestamp if auto?
        // Let's implement unique per class per day for now, or allow multiple if strictly different times.
        // For simplicity, just log it.

        $attendance = Attendance::create($validated);

        return response()->json($attendance, 201);
    }

    // Helper to mark present from face recognition data
    public function markPresent(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'course_id' => 'required|exists:courses,id',
        ]);

        // Check if already marked present today for this course
        $existing = Attendance::where('student_id', $validated['student_id'])
            ->where('course_id', $validated['course_id'])
            ->whereDate('detected_at', now()->toDateString())
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Already marked present', 'data' => $existing], 200);
        }

        $attendance = Attendance::create([
            'student_id' => $validated['student_id'],
            'course_id' => $validated['course_id'],
            'detected_at' => now(),
            'status' => 'present',
            'method' => 'auto'
        ]);

        return response()->json($attendance, 201);
    }

    public function stats()
    {
        $today = now()->toDateString();

        $totalStudents = Student::count();
        $presentToday = Attendance::whereDate('detected_at', $today)
            ->where('status', 'present')
            ->distinct('student_id')
            ->count('student_id');

        $lateToday = Attendance::whereDate('detected_at', $today)
            ->where('status', 'late')
            ->count();

        $absentToday = $totalStudents - $presentToday; // Simplified logic

        // Recent 5 activities
        $recentActivity = Attendance::with('student')
            ->latest('detected_at')
            ->take(5)
            ->get();

        // Weekly Trend (Last 7 days)
        $trend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            $count = Attendance::whereDate('detected_at', $date)
                ->where('status', 'present')
                ->distinct('student_id')
                ->count('student_id');
            $trend[] = [
                'date' => $date,
                'count' => $count,
                'day' => now()->subDays($i)->format('D')
            ];
        }

        return response()->json([
            'total_students' => $totalStudents,
            'present_today' => $presentToday,
            'absent_today' => max(0, $absentToday),
            'late_today' => $lateToday,
            'recent_activity' => $recentActivity,
            'attendance_trend' => $trend
        ]);
    }
}
