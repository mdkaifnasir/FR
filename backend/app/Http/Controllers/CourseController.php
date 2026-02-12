<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        return Course::with('teacher')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'code' => 'required|string|unique:courses',
            'teacher_id' => 'required|exists:users,id',
        ]);

        $course = Course::create($validated);

        return response()->json($course, 201);
    }

    public function show(Course $course)
    {
        return $course->load('teacher');
    }

    // Additional methods as needed
}
