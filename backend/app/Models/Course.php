<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    /** @use HasFactory<\Database\Factories\CourseFactory> */
    use HasFactory;

    protected $fillable = ['name', 'code', 'teacher_id', 'department', 'semester', 'schedule'];

    protected $casts = [
        'schedule' => 'array',
    ];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function cameras()
    {
        return $this->hasMany(Camera::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }
}
