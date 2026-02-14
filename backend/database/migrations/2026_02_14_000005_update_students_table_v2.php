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
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null'); // Link to user login if needed
            $table->foreignId('course_id')->nullable()->constrained('courses')->onDelete('set null');
            $table->string('face_embedding_version')->nullable()->default('v1');
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['course_id']);
            $table->dropColumn(['user_id', 'course_id', 'face_embedding_version', 'is_active', 'deleted_at']);
        });
    }
};
