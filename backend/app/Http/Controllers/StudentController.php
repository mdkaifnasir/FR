<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        return Student::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'student_id' => 'required|string|unique:students|max:50',
            'email' => 'required|email|unique:students|max:255',
            'password' => 'required|string|min:8',
            'mobile' => 'nullable|string|max:15',
            'gender' => 'required|in:Male,Female,Other',
            'dob' => 'required|date',

            'college' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'course' => 'required|string|max:255',
            'course_id' => 'nullable|exists:courses,id',
            'semester' => 'required|string|max:50',
            'division' => 'required|string|max:50',
            'academic_year' => 'required|string|max:20',

            'face_descriptor' => 'required|array',
            'consent_given' => 'required|boolean',
        ]);

        $validated['password'] = bcrypt($validated['password']);
        $student = Student::create($validated);

        return response()->json($student, 201);
    }

    public function show(Student $student)
    {
        return $student;
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'name' => 'string',
            'face_descriptor' => 'nullable|array',
        ]);

        $student->update($validated);

        return $student;
    }

    public function destroy(Student $student)
    {
        $student->delete();
        return response()->noContent();
    }
}
