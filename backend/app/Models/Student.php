<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Student extends Model
{
    /** @use HasFactory<\Database\Factories\StudentFactory> */
    use HasFactory, HasApiTokens, \Illuminate\Database\Eloquent\SoftDeletes;

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
        'consent_given',
        'user_id',
        'course_id',
        'face_embedding_version',
        'is_active',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'face_descriptor' => 'array', // Automatically cast JSON to array
        'dob' => 'date',
        'consent_given' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function courseRelation() // Renamed to avoid conflict with 'course' string/attribute if any magic getter issues arise, but 'course' is a column name. Let's call it courseModel or just course() if we are careful. Laravel usually handles this, but since 'course' is a string column, $student->course returns the string.
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}
