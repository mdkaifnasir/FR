<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Student extends Model
{
    /** @use HasFactory<\Database\Factories\StudentFactory> */
    use HasFactory, HasApiTokens;

    protected $fillable = [
        'name',
        'student_id',
        'face_descriptor',
        'email',
        'password',
        'mobile',
        'gender',
        'dob',
        'college',
        'department',
        'course',
        'semester',
        'division',
        'academic_year',
        'consent_given'
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'face_descriptor' => 'array', // Automatically cast JSON to array
        'dob' => 'date',
        'consent_given' => 'boolean',
    ];

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}
