<?php
use App\Models\Student;
use Illuminate\Support\Facades\Log;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $descriptor = array_fill(0, 128, 0.12345); // Dummy 128 float array

    $data = [
        'name' => 'Test Student ' . time(),
        'student_id' => 'TEST-' . time(),
        'email' => 'test' . time() . '@example.com',
        'mobile' => '1234567890',
        'gender' => 'Male',
        'dob' => '2000-01-01',
        'college' => 'Test College',
        'department' => 'CS',
        'course' => 'B.Tech',
        'semester' => '1',
        'division' => 'A',
        'academic_year' => '2025-26',
        'face_descriptor' => $descriptor,
        'consent_given' => true
    ];

    $student = Student::create($data);
    echo "Student created successfully: ID " . $student->id . "\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
