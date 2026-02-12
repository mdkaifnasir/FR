<?php
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$columns = Schema::getColumnListing('students');
print_r($columns);

// Check if face_descriptor exists
if (in_array('face_descriptor', $columns)) {
    echo "Column 'face_descriptor' exists.\n";
} else {
    echo "Column 'face_descriptor' MISSING!\n";
}
