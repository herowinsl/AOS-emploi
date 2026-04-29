<?php
/**
 * Plugin Name: AOS-Emploi Backend System (Final)
 * Description: Ultimate API for AOS-Emploi. Handles Auth, Registration, and Demandes.
 * Version: 1.3
 */

if (!defined('ABSPATH')) exit;

// --- 1. CORS CONFIGURATION ---
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *'); // Change to your frontend domain in production
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With');
        return $value;
    });
}, 15);

// --- 2. AUTHENTICATION HELPER ---
function aos_get_authenticated_user() {
    global $wpdb;
    $auth_header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (empty($auth_header)) return null;

    $token = str_replace('Bearer ', '', $auth_header);
    
    // Check token validity and expiry
    $user = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM aos_adherents WHERE token = %s AND token_expiry > NOW() AND status = 'approved'",
        $token
    ));

    return $user;
}

// --- 3. API ROUTES ---
add_action('rest_api_init', function () {
    $ns = 'aos/v1';

    // Public
    register_rest_route($ns, '/register', [
        'methods' => 'POST',
        'callback' => 'aos_api_register',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route($ns, '/login', [
        'methods' => 'POST',
        'callback' => 'aos_api_login',
        'permission_callback' => '__return_true',
    ]);

    // Private (Requires Token)
    register_rest_route($ns, '/me', [
        'methods' => 'GET',
        'callback' => 'aos_api_get_me',
        'permission_callback' => 'aos_check_token_auth',
    ]);

    register_rest_route($ns, '/demandes', [
        'methods' => ['GET', 'POST'],
        'callback' => 'aos_api_handle_demandes',
        'permission_callback' => 'aos_check_token_auth',
    ]);

    register_rest_route($ns, '/documents', [
        'methods' => 'GET',
        'callback' => 'aos_api_get_documents',
        'permission_callback' => 'aos_check_token_auth',
    ]);
});

function aos_check_token_auth() {
    return aos_get_authenticated_user() !== null;
}

// --- 4. CALLBACK FUNCTIONS ---

/**
 * Registration: Checks whitelist and creates pending adherent.
 */
function aos_api_register($request) {
    global $wpdb;
    $p = $request->get_json_params();
    $email = sanitize_email($p['email']);

    // 1. Check Whitelist
    $is_verified = $wpdb->get_var($wpdb->prepare("SELECT id FROM aos_verified_employees WHERE email = %s", $email));
    if (!$is_verified) {
        return new WP_Error('access_denied', "Email non autorisé.", ['status' => 403]);
    }

    // 2. Check if already exists
    $exists = $wpdb->get_var($wpdb->prepare("SELECT id FROM aos_adherents WHERE email = %s", $email));
    if ($exists) {
        return new WP_Error('conflict', "Une demande existe déjà.", ['status' => 409]);
    }

    $wpdb->insert('aos_adherents', [
        'nom' => sanitize_text_field($p['nom']),
        'email' => $email,
        'telephone' => sanitize_text_field($p['telephone']),
        'lieu_travail' => sanitize_text_field($p['lieu_travail']),
        'status' => 'pending'
    ]);

    return ['success' => true, 'message' => 'Demande envoyée.'];
}

/**
 * Login: Verifies unique_key and generates session token.
 */
function aos_api_login($request) {
    global $wpdb;
    $p = $request->get_json_params();
    $email = sanitize_email($p['email']);
    $key = sanitize_text_field($p['unique_key']);

    $user = $wpdb->get_row($wpdb->prepare("SELECT * FROM aos_adherents WHERE email = %s", $email));

    if (!$user || $user->unique_key !== $key) {
        return new WP_Error('auth_failed', 'Identifiants incorrects.', ['status' => 401]);
    }

    if ($user->status !== 'approved') {
        return new WP_Error('pending', 'Compte en attente de validation.', ['status' => 403]);
    }

    // Generate 24h Session
    $token = bin2hex(random_bytes(32));
    $expiry = date('Y-m-d H:i:s', strtotime('+24 hours'));

    $wpdb->update('aos_adherents', 
        ['token' => $token, 'token_expiry' => $expiry], 
        ['id' => $user->id]
    );

    return [
        'token' => $token,
        'user' => [
            'id' => $user->id,
            'nom' => $user->nom,
            'email' => $user->email,
            'lieu_travail' => $user->lieu_travail,
            'unique_key' => $user->unique_key
        ]
    ];
}

/**
 * Get Profile Info
 */
function aos_api_get_me() {
    $user = aos_get_authenticated_user();
    return [
        'nom' => $user->nom,
        'email' => $user->email,
        'lieu_travail' => $user->lieu_travail,
        'unique_key' => $user->unique_key,
        'status' => 'approved'
    ];
}

/**
 * Handle Demandes (POST to create, GET to list)
 */
function aos_api_handle_demandes($request) {
    global $wpdb;
    $user = aos_get_authenticated_user();

    if ($request->get_method() === 'POST') {
        $p = $request->get_json_params();
        $type = $p['type'] ?? 'autre';
        unset($p['type']);

        $wpdb->insert('aos_demandes', [
            'adherent_id' => $user->id,
            'type_demande' => $type,
            'sujet' => "Demande " . strtoupper($type),
            'form_data' => json_encode($p, JSON_UNESCAPED_UNICODE),
            'status' => 'pending'
        ]);

        return ['success' => true];
    }

    // GET: List History
    $results = $wpdb->get_results($wpdb->prepare(
        "SELECT id, type_demande as type, status, created_at as date FROM aos_demandes WHERE adherent_id = %d ORDER BY created_at DESC",
        $user->id
    ));

    foreach ($results as &$res) {
        $res->id = "REQ-" . str_pad($res->id, 3, "0", STR_PAD_LEFT);
    }

    return $results;
}

/**
 * Get Documents (Fetch from WP Media Library or Custom logic)
 */
function aos_api_get_documents() {
    // This example returns a structured list. 
    // Supervisor can adapt this to fetch from a specific WP folder or CPT.
    return [
        ['id' => 1, 'title' => "Statuts de l'AOS", 'type' => 'PDF', 'size' => '1.2 MB', 'downloadLink' => site_url('/documents/statuts.pdf')],
        ['id' => 2, 'title' => "Règlement Intérieur", 'type' => 'PDF', 'size' => '850 KB', 'downloadLink' => site_url('/documents/reglement.pdf')],
    ];
}
