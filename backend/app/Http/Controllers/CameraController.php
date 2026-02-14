<?php

namespace App\Http\Controllers;

use App\Models\Camera;
use Illuminate\Http\Request;

class CameraController extends Controller
{
    public function index()
    {
        return Camera::with('course')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'rtsp_url' => 'required|string',
            'location' => 'nullable|string',
            'course_id' => 'nullable|exists:courses,id',
            'status' => 'in:online,offline,maintenance',
        ]);

        $camera = Camera::create($validated);
        return response()->json($camera, 201);
    }

    public function show(Camera $camera)
    {
        return $camera->load('course');
    }

    public function update(Request $request, Camera $camera)
    {
        $validated = $request->validate([
            'name' => 'string',
            'rtsp_url' => 'string',
            'location' => 'nullable|string',
            'course_id' => 'nullable|exists:courses,id',
            'status' => 'in:online,offline,maintenance',
        ]);

        $camera->update($validated);
        return response()->json($camera);
    }

    public function destroy(Camera $camera)
    {
        $camera->delete();
        return response()->noContent();
    }
}
