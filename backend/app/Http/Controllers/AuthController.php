<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|in:admin,teacher', // Simple role management
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        // If we want to store role, we need to add it to the DB.
        // For MVP, let's add a migration for 'role' to users table next.

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        // 1. Try User Login (Admin/Teacher)
        if (Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']])) {
            $user = User::where('email', $credentials['email'])->firstOrFail();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
            ]);
        }

        // 2. Try Student Login (using student_id or email)
        $student = Student::where('student_id', $credentials['email'])
            ->orWhere('email', $credentials['email'])
            ->first();

        if ($student && Hash::check($credentials['password'], $student->password)) {
            $token = $student->createToken('auth_token')->plainTextToken;

            // Normalize student object for frontend expectation if needed, or just return it
            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'id' => $student->id,
                    'name' => $student->name,
                    'email' => $student->email,
                    'role' => 'student',
                    'student_id' => $student->student_id
                ],
            ]);
        }

        return response()->json([
            'message' => 'Invalid ID or password'
        ], 401);
    }

    public function loginByFace(Request $request)
    {
        $request->validate([
            'face_descriptor' => 'required|array',
        ]);

        $inputDescriptor = $request->input('face_descriptor');
        $students = Student::all(); // In production, use a vector database or limited query

        $bestMatch = null;
        $minDistance = 0.6; // Threshold for face-api.js

        foreach ($students as $student) {
            $dbDescriptor = $student->face_descriptor;
            if (!$dbDescriptor)
                continue;

            $distance = $this->euclideanDistance($inputDescriptor, $dbDescriptor);
            if ($distance < $minDistance) {
                $minDistance = $distance;
                $bestMatch = $student;
            }
        }

        if ($bestMatch) {
            $token = $bestMatch->createToken('auth_token')->plainTextToken;
            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'id' => $bestMatch->id,
                    'name' => $bestMatch->name,
                    'email' => $bestMatch->email,
                    'role' => 'student',
                    'student_id' => $bestMatch->student_id
                ],
            ]);
        }

        return response()->json([
            'message' => 'Face not recognized'
        ], 401);
    }

    private function euclideanDistance($a, $b)
    {
        $sum = 0;
        for ($i = 0; $i < count($a); $i++) {
            $sum += pow($a[$i] - $b[$i], 2);
        }
        return sqrt($sum);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function user(Request $request)
    {
        return $request->user();
    }
}
