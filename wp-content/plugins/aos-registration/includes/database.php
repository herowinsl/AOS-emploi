<?php
/**
 * Database table creation and management
 */

if (!defined('ABSPATH')) {
    exit;
}

function aos_create_tables() {
    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();
    
    // Create verified_employees table
    $verified_employees_table = $wpdb->prefix . 'aos_verified_employees';
    $verified_sql = "CREATE TABLE IF NOT EXISTS $verified_employees_table (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL UNIQUE,
        nom VARCHAR(255) NOT NULL,
        lieu_de_travail VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY email (email)
    ) $charset_collate;";
    
    // Create aos_adherents table
    $adherents_table = $wpdb->prefix . 'aos_adherents';
    $adherents_sql = "CREATE TABLE IF NOT EXISTS $adherents_table (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL UNIQUE,
        nom VARCHAR(255) NOT NULL,
        lieu_de_travail VARCHAR(255),
        tel VARCHAR(20),
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        unique_key VARCHAR(50) UNIQUE,
        approved_by BIGINT(20) UNSIGNED,
        approved_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY email (email),
        KEY status (status),
        KEY unique_key (unique_key)
    ) $charset_collate;";
    
    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta($verified_sql);
    dbDelta($adherents_sql);
    
    // Store that tables were created
    update_option('aos_tables_created', time());
}

/**
 * Check if email is verified employee
 */
function aos_is_verified_employee($email) {
    global $wpdb;
    $table = $wpdb->prefix . 'aos_verified_employees';
    $result = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE email = %s", $email));
    return $result !== null;
}

/**
 * Get verified employee data
 */
function aos_get_verified_employee($email) {
    global $wpdb;
    $table = $wpdb->prefix . 'aos_verified_employees';
    return $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE email = %s", $email));
}

/**
 * Create adherent record
 */
function aos_create_adherent($data) {
    global $wpdb;
    $table = $wpdb->prefix . 'aos_adherents';
    
    $wpdb->insert(
        $table,
        [
            'email' => $data['email'],
            'nom' => $data['nom'],
            'lieu_de_travail' => $data['lieu_de_travail'],
            'tel' => $data['tel'],
            'status' => 'pending'
        ],
        ['%s', '%s', '%s', '%s', '%s']
    );
    
    return $wpdb->insert_id;
}

/**
 * Get adherent by email
 */
function aos_get_adherent($email) {
    global $wpdb;
    $table = $wpdb->prefix . 'aos_adherents';
    return $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE email = %s", $email));
}

/**
 * Get adherent by ID
 */
function aos_get_adherent_by_id($id) {
    global $wpdb;
    $table = $wpdb->prefix . 'aos_adherents';
    return $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE id = %d", $id));
}

/**
 * Approve adherent and generate unique key
 */
function aos_approve_adherent($adherent_id, $approved_by) {
    global $wpdb;
    $table = $wpdb->prefix . 'aos_adherents';
    $unique_key = aos_generate_unique_key();
    
    $wpdb->update(
        $table,
        [
            'status' => 'approved',
            'unique_key' => $unique_key,
            'approved_by' => $approved_by,
            'approved_at' => current_time('mysql')
        ],
        ['id' => $adherent_id],
        ['%s', '%s', '%d', '%s'],
        ['%d']
    );
    
    return $unique_key;
}

/**
 * Reject adherent
 */
function aos_reject_adherent($adherent_id, $rejected_by) {
    global $wpdb;
    $table = $wpdb->prefix . 'aos_adherents';
    
    $wpdb->update(
        $table,
        [
            'status' => 'rejected',
            'approved_by' => $rejected_by,
            'approved_at' => current_time('mysql')
        ],
        ['id' => $adherent_id],
        ['%s', '%d', '%s'],
        ['%d']
    );
}

/**
 * Get pending approvals
 */
function aos_get_pending_approvals() {
    global $wpdb;
    $table = $wpdb->prefix . 'aos_adherents';
    return $wpdb->get_results("
        SELECT * FROM $table 
        WHERE status = 'pending' 
        ORDER BY created_at DESC
    ");
}

/**
 * Verify sign-in credentials
 */
function aos_verify_signin($email, $unique_key) {
    global $wpdb;
    $table = $wpdb->prefix . 'aos_adherents';
    
    return $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM $table WHERE email = %s AND unique_key = %s AND status = 'approved'",
        $email,
        $unique_key
    ));
}
