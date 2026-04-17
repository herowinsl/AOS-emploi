<?php
/**
 * Script to seed verified_employees table with sample data
 * 
 * Usage: 
 * 1. Upload this file to WordPress admin
 * 2. Go to Tools > CSV Importer
 * 3. Or run via WordPress CLI:
 *    wp eval-file /path/to/seed-verified-employees.php
 */

if (!defined('ABSPATH')) {
    exit;
}

require_once ABSPATH . 'wp-load.php';

// Check if user is admin
if (!current_user_can('manage_options')) {
    wp_die('You do not have permission to run this script.');
}

global $wpdb;
$table = $wpdb->prefix . 'aos_verified_employees';

// Sample employee data
$employees = [
    [
        'email' => 'john.doe@company.com',
        'nom' => 'John Doe',
        'lieu_de_travail' => 'Paris',
    ],
    [
        'email' => 'jane.smith@company.com',
        'nom' => 'Jane Smith',
        'lieu_de_travail' => 'Lyon',
    ],
    [
        'email' => 'ahmed.hassan@company.com',
        'nom' => 'Ahmed Hassan',
        'lieu_de_travail' => 'Marseille',
    ],
    [
        'email' => 'marie.bernard@company.com',
        'nom' => 'Marie Bernard',
        'lieu_de_travail' => 'Toulouse',
    ],
    [
        'email' => 'pierre.martin@company.com',
        'nom' => 'Pierre Martin',
        'lieu_de_travail' => 'Nice',
    ],
];

$inserted = 0;
$skipped = 0;

foreach ($employees as $employee) {
    // Check if email already exists
    $exists = $wpdb->get_var($wpdb->prepare(
        "SELECT id FROM $table WHERE email = %s",
        $employee['email']
    ));
    
    if ($exists) {
        echo "Skipped: {$employee['email']} (already exists)\n";
        $skipped++;
        continue;
    }
    
    // Insert employee
    $result = $wpdb->insert($table, [
        'email' => $employee['email'],
        'nom' => $employee['nom'],
        'lieu_de_travail' => $employee['lieu_de_travail'],
    ], ['%s', '%s', '%s']);
    
    if ($result) {
        echo "Inserted: {$employee['email']}\n";
        $inserted++;
    } else {
        echo "Error: Failed to insert {$employee['email']}\n";
    }
}

echo "\n=== Results ===\n";
echo "Inserted: $inserted\n";
echo "Skipped: $skipped\n";
echo "Total: " . count($employees) . "\n";
