<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class TeacherController extends Controller
{
    public function index()
    {
        return Teacher::with('user')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'department' => 'nullable|string',
            'specialization' => 'nullable|string',
            'phone' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'teacher',
            ]);

            $teacher = Teacher::create([
                'user_id' => $user->id,
                'department' => $validated['department'],
                'specialization' => $validated['specialization'],
                'phone' => $validated['phone'],
                'is_active' => true,
            ]);

            DB::commit();
            return response()->json($teacher->load('user'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create teacher'], 500);
        }
    }

    public function show(Teacher $teacher)
    {
        return $teacher->load('user');
    }

    public function update(Request $request, Teacher $teacher)
    {
        $validated = $request->validate([
            'department' => 'nullable|string',
            'specialization' => 'nullable|string',
            'phone' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $teacher->update($validated);

        if ($request->has('name')) {
            $teacher->user->update(['name' => $request->name]);
        }

        return response()->json($teacher->load('user'));
    }

    public function destroy(Teacher $teacher)
    {
        $teacher->user->delete(); // Cascades to teacher
        return response()->noContent();
    }
}
