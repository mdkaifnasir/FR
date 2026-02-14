<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        return Course::with(['teacher', 'cameras'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'code' => 'required|string|unique:courses',
            'teacher_id' => 'required|exists:users,id',
            'department' => 'nullable|string',
            'semester' => 'nullable|string',
            'schedule' => 'nullable|array',
        ]);

        $course = Course::create($validated);

        return response()->json($course, 201);
    }

    public function show(Course $course)
    {
        return $course->load(['teacher', 'cameras', 'students']);
    }

    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'name' => 'string',
            'code' => 'string|unique:courses,code,' . $course->id,
            'teacher_id' => 'exists:users,id',
            'department' => 'nullable|string',
            'semester' => 'nullable|string',
            'schedule' => 'nullable|array',
        ]);

        $course->update($validated);

        return response()->json($course);
    }

    public function destroy(Course $course)
    {
        $course->delete();
        return response()->noContent();
    }
}
