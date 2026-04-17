<?php
/**
 * Email notification system for AOS Registration
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Send admin notification when new registration is submitted
 */
function aos_send_admin_notification($user_data) {
    $admin_email = get_option('admin_email');
    $site_name = get_bloginfo('name');
    
    $subject = "[AOS-Emploi] Nouvelle inscription à approuver";
    
    $message = sprintf(
        "Bonjour,\n\n" .
        "Une nouvelle inscription à AOS-Emploi a été soumise.\n\n" .
        "Détails de l'inscription:\n" .
        "Nom: %s\n" .
        "Email: %s\n" .
        "Lieu de travail: %s\n" .
        "Téléphone: %s\n\n" .
        "Pour approuver cette inscription, veuillez consulter le tableau de bord d'administration:\n" .
        "%s\n\n" .
        "Cordialement,\n%s",
        $user_data['nom'],
        $user_data['email'],
        $user_data['lieu_de_travail'],
        $user_data['tel'],
        admin_url('admin.php?page=aos-approvals'),
        $site_name
    );
    
    $headers = ['Content-Type: text/plain; charset=UTF-8'];
    
    wp_mail($admin_email, $subject, $message, $headers);
}

/**
 * Send approval notification to user with access key
 */
function aos_send_approval_notification($adherent, $unique_key) {
    $site_name = get_bloginfo('name');
    $site_url = get_site_url();
    
    $subject = "[AOS-Emploi] Votre clé d'accès";
    
    $message = sprintf(
        "Bonjour %s,\n\n" .
        "Votre inscription à AOS-Emploi a été approuvée!\n\n" .
        "Votre clé d'accès unique est:\n" .
        "%s\n\n" .
        "Pour vous connecter, veuillez utiliser votre email et cette clé d'accès:\n" .
        "%s/signin\n\n" .
        "Cette clé est personnelle et ne doit pas être partagée.\n\n" .
        "Cordialement,\n%s",
        $adherent->nom,
        $unique_key,
        $site_url,
        $site_name
    );
    
    $headers = ['Content-Type: text/plain; charset=UTF-8'];
    
    wp_mail($adherent->email, $subject, $message, $headers);
}

/**
 * Send rejection notification to user
 */
function aos_send_rejection_notification($adherent) {
    $site_name = get_bloginfo('name');
    $site_url = get_site_url();
    
    $subject = "[AOS-Emploi] Décision concernant votre inscription";
    
    $message = sprintf(
        "Bonjour %s,\n\n" .
        "Nous avons examiné votre demande d'inscription à AOS-Emploi.\n\n" .
        "Malheureusement, votre inscription a été rejetée à ce stade.\n\n" .
        "Si vous pensez qu'il y a une erreur, veuillez contacter l'administration.\n\n" .
        "Cordialement,\n%s",
        $adherent->nom,
        $site_name
    );
    
    $headers = ['Content-Type: text/plain; charset=UTF-8'];
    
    wp_mail($adherent->email, $subject, $message, $headers);
}
