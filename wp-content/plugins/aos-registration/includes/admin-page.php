<?php
/**
 * WordPress Admin Page for AOS Registration Approvals
 */

if (!defined('ABSPATH')) {
    exit;
}

function aos_register_admin_page() {
    add_menu_page(
        'AOS Approvals',
        'AOS Approvals',
        'manage_options',
        'aos-approvals',
        'aos_admin_page_html',
        'dashicons-clipboard',
        25
    );
}

function aos_admin_page_html() {
    // Check user capabilities
    if (!current_user_can('manage_options')) {
        wp_die(__('You do not have sufficient permissions to access this page.'));
    }
    
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        
        <div id="aos-admin-app"></div>
        
        <style>
            .aos-admin-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            
            .aos-admin-table th,
            .aos-admin-table td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            
            .aos-admin-table th {
                background-color: #f5f5f5;
                font-weight: bold;
            }
            
            .aos-admin-table tr:hover {
                background-color: #f9f9f9;
            }
            
            .aos-admin-actions {
                display: flex;
                gap: 10px;
            }
            
            .aos-approve-btn,
            .aos-reject-btn {
                padding: 6px 12px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }
            
            .aos-approve-btn {
                background-color: #28a745;
                color: white;
            }
            
            .aos-approve-btn:hover {
                background-color: #218838;
            }
            
            .aos-reject-btn {
                background-color: #dc3545;
                color: white;
            }
            
            .aos-reject-btn:hover {
                background-color: #c82333;
            }
            
            .aos-loading {
                color: #999;
                font-style: italic;
            }
            
            .aos-message {
                padding: 12px;
                margin-bottom: 20px;
                border-radius: 4px;
            }
            
            .aos-message.success {
                background-color: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            
            .aos-message.error {
                background-color: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
            
            .aos-badge {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: bold;
            }
            
            .aos-badge.pending {
                background-color: #fff3cd;
                color: #856404;
            }
        </style>
    </div>
    
    <script>
    (function() {
        const nonce = '<?php echo wp_create_nonce("aos-admin"); ?>';
        const restUrl = '<?php echo rest_url("aos/v1/"); ?>';
        
        function loadPending() {
            const messageEl = document.getElementById('aos-message');
            const tableEl = document.getElementById('aos-pending-table');
            const container = document.getElementById('aos-admin-app');
            
            fetch(restUrl + 'pending', {
                headers: {
                    'X-WP-Nonce': nonce
                }
            })
            .then(r => r.json())
            .then(data => {
                if (!data.success) {
                    showMessage('Error loading pending approvals', 'error');
                    return;
                }
                
                if (data.count === 0) {
                    container.innerHTML = '<p>No pending approvals</p>';
                    return;
                }
                
                let html = `
                    <table class="aos-admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Location</th>
                                <th>Phone</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                data.data.forEach(item => {
                    html += `
                        <tr>
                            <td>${escapeHtml(item.nom)}</td>
                            <td>${escapeHtml(item.email)}</td>
                            <td>${escapeHtml(item.lieu_de_travail)}</td>
                            <td>${escapeHtml(item.tel)}</td>
                            <td>${new Date(item.created_at).toLocaleDateString()}</td>
                            <td>
                                <div class="aos-admin-actions">
                                    <button class="aos-approve-btn" onclick="approveAdherent(${item.id})">
                                        Approve
                                    </button>
                                    <button class="aos-reject-btn" onclick="rejectAdherent(${item.id})">
                                        Reject
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                });
                
                html += `
                        </tbody>
                    </table>
                `;
                
                container.innerHTML = html;
            })
            .catch(err => {
                console.error(err);
                showMessage('Error loading pending approvals', 'error');
            });
        }
        
        window.approveAdherent = function(id) {
            if (!confirm('Are you sure you want to approve this registration?')) return;
            
            fetch(restUrl + 'approve/' + id, {
                method: 'POST',
                headers: {
                    'X-WP-Nonce': nonce,
                    'Content-Type': 'application/json'
                }
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    showMessage('Registration approved successfully', 'success');
                    setTimeout(loadPending, 1000);
                } else {
                    showMessage(data.message || 'Error approving registration', 'error');
                }
            })
            .catch(err => {
                console.error(err);
                showMessage('Error approving registration', 'error');
            });
        };
        
        window.rejectAdherent = function(id) {
            if (!confirm('Are you sure you want to reject this registration?')) return;
            
            fetch(restUrl + 'reject/' + id, {
                method: 'POST',
                headers: {
                    'X-WP-Nonce': nonce,
                    'Content-Type': 'application/json'
                }
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    showMessage('Registration rejected successfully', 'success');
                    setTimeout(loadPending, 1000);
                } else {
                    showMessage(data.message || 'Error rejecting registration', 'error');
                }
            })
            .catch(err => {
                console.error(err);
                showMessage('Error rejecting registration', 'error');
            });
        };
        
        function showMessage(msg, type) {
            const container = document.getElementById('aos-admin-app');
            const messageEl = document.createElement('div');
            messageEl.className = 'aos-message ' + type;
            messageEl.textContent = msg;
            container.insertBefore(messageEl, container.firstChild);
            
            setTimeout(() => messageEl.remove(), 5000);
        }
        
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        // Load pending on page load
        document.addEventListener('DOMContentLoaded', loadPending);
    })();
    </script>
    <?php
}
