<?php
/**
 * Plugin Name: AOS Registration & Approval System
 * Description: Handles employee registration with HR verification and admin approval
 * Version: 1.0.0
 * Author: AOS-Emploi Team
 */

if (!defined('ABSPATH')) {
    exit;
}

define('AOS_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('AOS_PLUGIN_URL', plugin_dir_url(__FILE__));

// Include necessary files
require_once AOS_PLUGIN_PATH . 'includes/database.php';
require_once AOS_PLUGIN_PATH . 'includes/endpoints.php';
require_once AOS_PLUGIN_PATH . 'includes/admin-page.php';
require_once AOS_PLUGIN_PATH . 'includes/email.php';
require_once AOS_PLUGIN_PATH . 'includes/utils.php';

// Activation hook
register_activation_hook(__FILE__, function() {
    aos_create_tables();
});

// Register REST endpoints
add_action('rest_api_init', function() {
    aos_register_endpoints();
});

// Register admin page
add_action('admin_menu', function() {
    aos_register_admin_page();
});

// Enqueue admin scripts
add_action('admin_enqueue_scripts', function($hook) {
    if (strpos($hook, 'aos-approvals') !== false) {
        wp_enqueue_script('aos-admin', AOS_PLUGIN_URL . 'admin/aos-admin.js', ['wp-api'], '1.0.0', true);
        wp_enqueue_style('aos-admin', AOS_PLUGIN_URL . 'admin/aos-admin.css', [], '1.0.0');
        
        // Pass nonce for security
        wp_localize_script('aos-admin', 'aosAdmin', [
            'nonce' => wp_create_nonce('aos-admin'),
            'restUrl' => rest_url('aos/v1/')
        ]);
    }
});
