<?php
/**
 * Plugin Name: AOS Admin Management Dashboard
 * Description: Admin interface for managing user approvals, whitelist, and unique keys
 * Version: 1.0
 * Author: Ilyas Sennane
 * 
 * OPTIONAL: This plugin enhances user management but is not required.
 * Use this if you want an easier way to approve users without accessing phpMyAdmin.
 */

if (!defined('ABSPATH')) exit;

// ============ ADD ADMIN MENU ============

add_action('admin_menu', function() {
    add_menu_page(
        'AOS Management',
        'AOS Management',
        'manage_options',
        'aos-management',
        'aos_render_management_page',
        'dashicons-admin-users',
        20
    );

    // Submenu: Pending Users
    add_submenu_page(
        'aos-management',
        'Pending Users',
        'Pending Users',
        'manage_options',
        'aos-pending-users',
        'aos_render_pending_users'
    );

    // Submenu: Approved Users
    add_submenu_page(
        'aos-management',
        'Approved Users',
        'Approved Users',
        'manage_options',
        'aos-approved-users',
        'aos_render_approved_users'
    );

    // Submenu: Whitelist Management
    add_submenu_page(
        'aos-management',
        'Whitelist',
        'Whitelist',
        'manage_options',
        'aos-whitelist',
        'aos_render_whitelist'
    );

    // Submenu: Demandes/Requests
    add_submenu_page(
        'aos-management',
        'Demandes',
        'Demandes',
        'manage_options',
        'aos-demandes',
        'aos_render_demandes'
    );
});

// ============ MAIN DASHBOARD PAGE ============

function aos_render_management_page() {
    global $wpdb;
    
    // Get statistics
    $pending_count = $wpdb->get_var("SELECT COUNT(*) FROM aos_adherents WHERE status = 'pending'");
    $approved_count = $wpdb->get_var("SELECT COUNT(*) FROM aos_adherents WHERE status = 'approved'");
    $whitelist_count = $wpdb->get_var("SELECT COUNT(*) FROM aos_verified_employees");
    $demandes_count = $wpdb->get_var("SELECT COUNT(*) FROM aos_demandes WHERE status = 'pending'");
    ?>
    <div class="wrap">
        <h1>AOS Gestion Adhérents</h1>
        
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0;">
            <div style="border: 1px solid #ccc; padding: 20px; border-radius: 5px; text-align: center;">
                <div style="font-size: 32px; font-weight: bold; color: #ff9800;"><?php echo $pending_count; ?></div>
                <div style="color: #666; margin-top: 5px;">Pending Users</div>
                <a href="<?php echo admin_url('admin.php?page=aos-pending-users'); ?>" class="button" style="margin-top: 10px;">
                    View Details →
                </a>
            </div>

            <div style="border: 1px solid #ccc; padding: 20px; border-radius: 5px; text-align: center;">
                <div style="font-size: 32px; font-weight: bold; color: #4caf50;"><?php echo $approved_count; ?></div>
                <div style="color: #666; margin-top: 5px;">Approved Users</div>
                <a href="<?php echo admin_url('admin.php?page=aos-approved-users'); ?>" class="button" style="margin-top: 10px;">
                    View Details →
                </a>
            </div>

            <div style="border: 1px solid #ccc; padding: 20px; border-radius: 5px; text-align: center;">
                <div style="font-size: 32px; font-weight: bold; color: #2196f3;"><?php echo $whitelist_count; ?></div>
                <div style="color: #666; margin-top: 5px;">Whitelisted Emails</div>
                <a href="<?php echo admin_url('admin.php?page=aos-whitelist'); ?>" class="button" style="margin-top: 10px;">
                    Manage →
                </a>
            </div>

            <div style="border: 1px solid #ccc; padding: 20px; border-radius: 5px; text-align: center;">
                <div style="font-size: 32px; font-weight: bold; color: #f44336;"><?php echo $demandes_count; ?></div>
                <div style="color: #666; margin-top: 5px;">Pending Requests</div>
                <a href="<?php echo admin_url('admin.php?page=aos-demandes'); ?>" class="button" style="margin-top: 10px;">
                    Review →
                </a>
            </div>
        </div>

        <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Quick Guide</h3>
            <ol style="margin: 0; padding-left: 20px;">
                <li><strong>Whitelist:</strong> Add/remove authorized email addresses</li>
                <li><strong>Pending Users:</strong> Review registration requests and approve/reject</li>
                <li><strong>Approved Users:</strong> Generate unique keys for approved users</li>
                <li><strong>Demandes:</strong> Review service requests (Aide, Prêt, Estivage)</li>
            </ol>
        </div>
    </div>
    <?php
}

// ============ PENDING USERS PAGE ============

function aos_render_pending_users() {
    global $wpdb;
    
    // Handle approval/rejection
    if ($_POST && isset($_POST['action']) && isset($_POST['user_id'])) {
        check_admin_referer('aos_nonce');
        
        $user_id = intval($_POST['user_id']);
        $action = sanitize_text_field($_POST['action']);
        
        if ($action === 'approve') {
            // Generate unique key
            $unique_key = 'AOS-' . date('Y') . '-' . strtoupper(substr(md5(uniqid()), 0, 6));
            
            $wpdb->update('aos_adherents',
                ['status' => 'approved', 'unique_key' => $unique_key, 'approved_at' => current_time('mysql')],
                ['id' => $user_id]
            );
            
            echo '<div class="notice notice-success"><p>User approved! Unique key: <strong>' . $unique_key . '</strong></p></div>';
        } elseif ($action === 'reject') {
            $wpdb->update('aos_adherents',
                ['status' => 'rejected'],
                ['id' => $user_id]
            );
            echo '<div class="notice notice-warning"><p>User rejected.</p></div>';
        }
    }
    
    // Get pending users
    $pending_users = $wpdb->get_results(
        "SELECT * FROM aos_adherents WHERE status = 'pending' ORDER BY created_at DESC"
    );
    
    ?>
    <div class="wrap">
        <h1>Pending User Registrations</h1>
        
        <?php if (empty($pending_users)) { ?>
            <div class="notice notice-info"><p>No pending registrations.</p></div>
        <?php } else { ?>
            <table class="wp-list-table widefat striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Work Location</th>
                        <th>Submitted</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($pending_users as $user) { ?>
                        <tr>
                            <td><?php echo htmlspecialchars($user->nom); ?></td>
                            <td><?php echo htmlspecialchars($user->email); ?></td>
                            <td><?php echo htmlspecialchars($user->telephone); ?></td>
                            <td><?php echo htmlspecialchars($user->lieu_travail); ?></td>
                            <td><?php echo date('Y-m-d H:i', strtotime($user->created_at)); ?></td>
                            <td>
                                <form method="POST" style="display: inline;">
                                    <?php wp_nonce_field('aos_nonce'); ?>
                                    <input type="hidden" name="user_id" value="<?php echo $user->id; ?>">
                                    <button type="submit" name="action" value="approve" class="button button-primary">Approve</button>
                                    <button type="submit" name="action" value="reject" class="button button-secondary">Reject</button>
                                </form>
                            </td>
                        </tr>
                    <?php } ?>
                </tbody>
            </table>
        <?php } ?>
    </div>
    <?php
}

// ============ APPROVED USERS PAGE ============

function aos_render_approved_users() {
    global $wpdb;
    
    // Handle unique key generation
    if ($_POST && isset($_POST['generate_key']) && isset($_POST['user_id'])) {
        check_admin_referer('aos_nonce');
        
        $user_id = intval($_POST['user_id']);
        $unique_key = 'AOS-' . date('Y') . '-' . strtoupper(substr(md5(uniqid()), 0, 6));
        
        $wpdb->update('aos_adherents',
            ['unique_key' => $unique_key],
            ['id' => $user_id]
        );
        
        echo '<div class="notice notice-success"><p>Unique key generated: <strong>' . htmlspecialchars($unique_key) . '</strong></p></div>';
    }
    
    // Get approved users
    $approved_users = $wpdb->get_results(
        "SELECT * FROM aos_adherents WHERE status = 'approved' ORDER BY approved_at DESC"
    );
    
    ?>
    <div class="wrap">
        <h1>Approved Users</h1>
        
        <?php if (empty($approved_users)) { ?>
            <div class="notice notice-info"><p>No approved users yet.</p></div>
        <?php } else { ?>
            <table class="wp-list-table widefat striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Unique Key</th>
                        <th>Approved</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($approved_users as $user) { ?>
                        <tr>
                            <td><?php echo htmlspecialchars($user->nom); ?></td>
                            <td><?php echo htmlspecialchars($user->email); ?></td>
                            <td>
                                <?php if ($user->unique_key) { ?>
                                    <code><?php echo htmlspecialchars($user->unique_key); ?></code>
                                <?php } else { ?>
                                    <em style="color: #999;">Not generated</em>
                                <?php } ?>
                            </td>
                            <td><?php echo date('Y-m-d', strtotime($user->approved_at)); ?></td>
                            <td>
                                <form method="POST" style="display: inline;">
                                    <?php wp_nonce_field('aos_nonce'); ?>
                                    <input type="hidden" name="user_id" value="<?php echo $user->id; ?>">
                                    <button type="submit" name="generate_key" value="1" class="button button-primary">
                                        <?php echo $user->unique_key ? 'Regenerate Key' : 'Generate Key'; ?>
                                    </button>
                                </form>
                            </td>
                        </tr>
                    <?php } ?>
                </tbody>
            </table>
        <?php } ?>
    </div>
    <?php
}

// ============ WHITELIST MANAGEMENT PAGE ============

function aos_render_whitelist() {
    global $wpdb;
    
    // Handle adding/removing from whitelist
    if ($_POST) {
        check_admin_referer('aos_nonce');
        
        if (isset($_POST['add_email']) && !empty($_POST['email'])) {
            $email = sanitize_email($_POST['email']);
            $nom = sanitize_text_field($_POST['nom'] ?? '');
            
            $exists = $wpdb->get_var($wpdb->prepare(
                "SELECT id FROM aos_verified_employees WHERE email = %s",
                $email
            ));
            
            if ($exists) {
                echo '<div class="notice notice-warning"><p>This email is already in the whitelist.</p></div>';
            } else {
                $wpdb->insert('aos_verified_employees', [
                    'email' => $email,
                    'nom' => $nom,
                    'type' => 'actif'
                ]);
                echo '<div class="notice notice-success"><p>Email added to whitelist.</p></div>';
            }
        }
        
        if (isset($_POST['remove_id'])) {
            $wpdb->delete('aos_verified_employees', ['id' => intval($_POST['remove_id'])]);
            echo '<div class="notice notice-success"><p>Email removed from whitelist.</p></div>';
        }
    }
    
    // Get whitelist
    $whitelist = $wpdb->get_results("SELECT * FROM aos_verified_employees ORDER BY nom ASC");
    
    ?>
    <div class="wrap">
        <h1>Email Whitelist</h1>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Add Email to Whitelist</h3>
            <form method="POST" style="display: flex; gap: 10px; flex-wrap: wrap;">
                <?php wp_nonce_field('aos_nonce'); ?>
                <input type="email" name="email" placeholder="Email address" required style="padding: 8px; border: 1px solid #ddd; border-radius: 3px; flex: 1; min-width: 250px;">
                <input type="text" name="nom" placeholder="Name (optional)" style="padding: 8px; border: 1px solid #ddd; border-radius: 3px; flex: 1; min-width: 200px;">
                <button type="submit" name="add_email" value="1" class="button button-primary">Add to Whitelist</button>
            </form>
        </div>
        
        <?php if (empty($whitelist)) { ?>
            <div class="notice notice-info"><p>No emails in whitelist yet.</p></div>
        <?php } else { ?>
            <table class="wp-list-table widefat striped">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Added</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($whitelist as $entry) { ?>
                        <tr>
                            <td><?php echo htmlspecialchars($entry->email); ?></td>
                            <td><?php echo htmlspecialchars($entry->nom); ?></td>
                            <td><span style="background: #e8f5e9; padding: 3px 8px; border-radius: 3px; font-size: 12px;">
                                <?php echo ucfirst($entry->type); ?>
                            </span></td>
                            <td><?php echo date('Y-m-d', strtotime($entry->imported_at)); ?></td>
                            <td>
                                <form method="POST" style="display: inline;">
                                    <?php wp_nonce_field('aos_nonce'); ?>
                                    <input type="hidden" name="remove_id" value="<?php echo $entry->id; ?>">
                                    <button type="submit" class="button button-secondary" onclick="return confirm('Remove this email?')">Remove</button>
                                </form>
                            </td>
                        </tr>
                    <?php } ?>
                </tbody>
            </table>
        <?php } ?>
    </div>
    <?php
}

// ============ DEMANDES/REQUESTS PAGE ============

function aos_render_demandes() {
    global $wpdb;
    
    // Handle status update
    if ($_POST && isset($_POST['demande_id']) && isset($_POST['status'])) {
        check_admin_referer('aos_nonce');
        
        $demande_id = intval($_POST['demande_id']);
        $status = sanitize_text_field($_POST['status']);
        
        $wpdb->update('aos_demandes',
            ['status' => $status],
            ['id' => $demande_id]
        );
        
        echo '<div class="notice notice-success"><p>Request status updated.</p></div>';
    }
    
    // Get pending demandes
    $demandes = $wpdb->get_results(
        "SELECT d.*, a.nom, a.email FROM aos_demandes d 
         LEFT JOIN aos_adherents a ON d.adherent_id = a.id 
         WHERE d.status != 'rejected' 
         ORDER BY d.created_at DESC"
    );
    
    ?>
    <div class="wrap">
        <h1>Service Requests (Demandes)</h1>
        
        <?php if (empty($demandes)) { ?>
            <div class="notice notice-info"><p>No requests to review.</p></div>
        <?php } else { ?>
            <table class="wp-list-table widefat striped">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>User</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($demandes as $demande) { ?>
                        <tr>
                            <td><code><?php echo htmlspecialchars($demande->type_demande); ?></code></td>
                            <td><?php echo htmlspecialchars($demande->nom ?? 'Unknown'); ?></td>
                            <td><?php echo htmlspecialchars($demande->email ?? 'Unknown'); ?></td>
                            <td>
                                <span style="padding: 3px 8px; border-radius: 3px; font-size: 12px; 
                                    background: <?php echo $demande->status === 'pending' ? '#fff3cd' : '#d4edda'; ?>;">
                                    <?php echo ucfirst($demande->status); ?>
                                </span>
                            </td>
                            <td><?php echo date('Y-m-d H:i', strtotime($demande->created_at)); ?></td>
                            <td>
                                <form method="POST" style="display: inline;">
                                    <?php wp_nonce_field('aos_nonce'); ?>
                                    <input type="hidden" name="demande_id" value="<?php echo $demande->id; ?>">
                                    <select name="status" style="padding: 5px;">
                                        <option value="pending" <?php selected($demande->status, 'pending'); ?>>Pending</option>
                                        <option value="approved">Approve</option>
                                        <option value="en_traitement">In Progress</option>
                                        <option value="rejected">Reject</option>
                                    </select>
                                    <button type="submit" class="button button-primary">Update</button>
                                </form>
                            </td>
                        </tr>
                    <?php } ?>
                </tbody>
            </table>
        <?php } ?>
    </div>
    <?php
}
