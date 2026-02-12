<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            // Identity
            $table->string('email')->unique()->nullable();
            $table->string('mobile')->nullable();
            $table->enum('gender', ['Male', 'Female', 'Other'])->nullable();
            $table->date('dob')->nullable();

            // Academic
            $table->string('college')->nullable();     // e.g. "College of Engineering"
            $table->string('department')->nullable();  // e.g. "Computer Science"
            $table->string('course')->nullable();      // e.g. "B.Tech"
            $table->string('semester')->nullable();    // e.g. "Sem 1"
            $table->string('division')->nullable();    // e.g. "A"
            $table->string('academic_year')->nullable(); // e.g. "2025-26"

            // Consent
            $table->boolean('consent_given')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'email',
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
            ]);
        });
    }
};
