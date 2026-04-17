<?php
/**
 * REST API Endpoints for AOS Registration
 */

if (!defined('ABSPATH')) {
    exit;
}

function aos_register_endpoints() {
    
    /**
     * POST /wp-json/aos/v1/register
     * User registration endpoint
     */
    register_rest_route('aos/v1', '/register', [
        'methods' => 'POST',
        'callback' => 'aos_register_callback',
        'permission_callback' => '__return_true',
        'args' => [
            'nom' => [
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'aos_sanitize_input'
            ],
            'email' => [
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_email'
            ],
            'lieu_de_travail' => [
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'aos_sanitize_input'
            ],
            'tel' => [
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'aos_sanitize_input'
            ]
        ]
    ]);
    
    /**
     * POST /wp-json/aos/v1/approve/{id}
     * Admin approval endpoint
     */
    register_rest_route('aos/v1', '/approve/(?P<id>\d+)', [
        'methods' => 'POST',
        'callback' => 'aos_approve_callback',
        'permission_callback' => function() {
            return aos_user_can_approve();
        },
        'args' => [
            'id' => [
                'required' => true,
                'type' => 'integer'
            ]
        ]
    ]);
    
    /**
     * POST /wp-json/aos/v1/reject/{id}
     * Admin rejection endpoint
     */
    register_rest_route('aos/v1', '/reject/(?P<id>\d+)', [
        'methods' => 'POST',
        'callback' => 'aos_reject_callback',
        'permission_callback' => function() {
            return aos_user_can_approve();
        },
        'args' => [
            'id' => [
                'required' => true,
                'type' => 'integer'
            ]
        ]
    ]);
    
    /**
     * GET /wp-json/aos/v1/pending
     * Get pending approvals (admin only)
     */
    register_rest_route('aos/v1', '/pending', [
        'methods' => 'GET',
        'callback' => 'aos_pending_callback',
        'permission_callback' => function() {
            return aos_user_can_approve();
        }
    ]);
    
    /**
     * POST /wp-json/aos/v1/signin
     * User sign-in endpoint
     */
    register_rest_route('aos/v1', '/signin', [
        'methods' => 'POST',
        'callback' => 'aos_signin_callback',
        'permission_callback' => '__return_true',
        'args' => [
            'email' => [
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_email'
            ],
            'unique_key' => [
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'aos_sanitize_input'
            ]
        ]
    ]);
}

/**
 * Callback: User Registration
 */
function aos_register_callback($request) {
    $params = $request->get_json_params();
    
    // Validate email format
    if (!aos_validate_email($params['email'])) {
        return new WP_Error('invalid_email', 'Invalid email format', ['status' => 400]);
    }
    
    // Validate phone format
    if (!aos_validate_phone($params['tel'])) {
        return new WP_Error('invalid_phone', 'Invalid phone number format', ['status' => 400]);
    }
    
    // Check if email is in verified employees list
    if (!aos_is_verified_employee($params['email'])) {
        return new WP_Error('email_not_verified', 'Email not in employee list', ['status' => 403]);
    }
    
    // Check if already registered
    $existing = aos_get_adherent($params['email']);
    if ($existing) {
        return new WP_Error('already_registered', 'Email already registered', ['status' => 409]);
    }
    
    // Create adherent record
    $adherent_id = aos_create_adherent([
        'email' => $params['email'],
        'nom' => $params['nom'],
        'lieu_de_travail' => $params['lieu_de_travail'],
        'tel' => $params['tel']
    ]);
    
    if (!$adherent_id) {
        return new WP_Error('database_error', 'Failed to create registration', ['status' => 500]);
    }
    
    // Send admin notification
    aos_send_admin_notification($params);
    
    return new WP_REST_Response([
        'success' => true,
        'message' => 'Registration submitted successfully',
        'adherent_id' => $adherent_id
    ], 201);
}

/**
 * Callback: Admin Approval
 */
function aos_approve_callback($request) {
    $adherent_id = (int) $request['id'];
    $current_user_id = get_current_user_id();
    
    // Get adherent
    $adherent = aos_get_adherent_by_id($adherent_id);
    if (!$adherent) {
        return new WP_Error('not_found', 'Registration not found', ['status' => 404]);
    }
    
    if ($adherent->status !== 'pending') {
        return new WP_Error('invalid_status', 'Can only approve pending registrations', ['status' => 409]);
    }
    
    // Approve and generate key
    $unique_key = aos_approve_adherent($adherent_id, $current_user_id);
    
    // Send user notification with key
    aos_send_approval_notification($adherent, $unique_key);
    
    return new WP_REST_Response([
        'success' => true,
        'message' => 'Registration approved',
        'unique_key' => $unique_key
    ], 200);
}

/**
 * Callback: Admin Rejection
 */
function aos_reject_callback($request) {
    $adherent_id = (int) $request['id'];
    $current_user_id = get_current_user_id();
    
    // Get adherent
    $adherent = aos_get_adherent_by_id($adherent_id);
    if (!$adherent) {
        return new WP_Error('not_found', 'Registration not found', ['status' => 404]);
    }
    
    if ($adherent->status !== 'pending') {
        return new WP_Error('invalid_status', 'Can only reject pending registrations', ['status' => 409]);
    }
    
    // Reject adherent
    aos_reject_adherent($adherent_id, $current_user_id);
    
    // Send rejection notification
    aos_send_rejection_notification($adherent);
    
    return new WP_REST_Response([
        'success' => true,
        'message' => 'Registration rejected'
    ], 200);
}

/**
 * Callback: Get Pending Approvals
 */
function aos_pending_callback($request) {
    $pending = aos_get_pending_approvals();
    
    return new WP_REST_Response([
        'success' => true,
        'count' => count($pending),
        'data' => $pending
    ], 200);
}

/**
 * Callback: User Sign-in
 */
function aos_signin_callback($request) {
    $params = $request->get_json_params();
    
    // Verify credentials
    $adherent = aos_verify_signin($params['email'], $params['unique_key']);
    
    if (!$adherent) {
        return new WP_Error('invalid_credentials', 'Invalid email or access key', ['status' => 401]);
    }
    
    // Create auth token
    $token = aos_create_auth_token($adherent->id, $adherent->email);
    
    return new WP_REST_Response([
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => $adherent->id,
            'nom' => $adherent->nom,
            'email' => $adherent->email,
            'lieu_de_travail' => $adherent->lieu_de_travail,
            'tel' => $adherent->tel
        ]
    ], 200);
}
