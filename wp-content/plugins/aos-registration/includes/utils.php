<?php
/**
 * Utility functions for AOS Registration
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Generate unique 8-character alphanumeric key
 * Format: AOS-XXXX-XXXX
 */
function aos_generate_unique_key() {
    global $wpdb;
    $table = $wpdb->prefix . 'aos_adherents';
    
    do {
        $key = 'AOS-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 4)) . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 4));
        $exists = $wpdb->get_var($wpdb->prepare("SELECT id FROM $table WHERE unique_key = %s", $key));
    } while ($exists);
    
    return $key;
}

/**
 * Validate email format
 */
function aos_validate_email($email) {
    return is_email($email);
}

/**
 * Validate phone format
 */
function aos_validate_phone($phone) {
    // Basic validation - at least 10 digits
    $digits = preg_replace('/[^0-9]/', '', $phone);
    return strlen($digits) >= 10;
}

/**
 * Create JWT token for authentication
 */
function aos_create_auth_token($adherent_id, $email) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode([
        'id' => $adherent_id,
        'email' => $email,
        'iat' => time(),
        'exp' => time() + (30 * 24 * 60 * 60) // 30 days expiration
    ]);
    
    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
    
    $signature = hash_hmac('sha256', $base64UrlHeader . '.' . $base64UrlPayload, wp_salt('auth'), true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    return $base64UrlHeader . '.' . $base64UrlPayload . '.' . $base64UrlSignature;
}

/**
 * Verify and decode JWT token
 */
function aos_verify_auth_token($token) {
    $parts = explode('.', $token);
    
    if (count($parts) !== 3) {
        return false;
    }
    
    list($header64, $payload64, $signature64) = $parts;
    
    $signature = hash_hmac('sha256', $header64 . '.' . $payload64, wp_salt('auth'), true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    if ($base64UrlSignature !== $signature64) {
        return false;
    }
    
    $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $payload64)), true);
    
    // Check expiration
    if ($payload['exp'] < time()) {
        return false;
    }
    
    return $payload;
}

/**
 * Check if user has AOS admin capability
 */
function aos_user_can_approve() {
    return current_user_can('manage_options');
}

/**
 * Sanitize string input
 */
function aos_sanitize_input($input) {
    return sanitize_text_field(trim($input));
}
