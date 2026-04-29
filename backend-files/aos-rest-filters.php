<?php

/**
 * Plugin Name: AOS REST API Filters
 * Description: Ajoute les champs ACF aux réponses REST API pour AOS-Emploi
 * Version: 1.0
 * Author: Ilyas Sennane
 */

if (!defined('ABSPATH')) exit;

/**
 * Filtres REST pour ajouter les champs ACF à chaque réponse
 * Cela expose les champs personnalisés (titre_fr, titre_ar, etc.)
 * aux clients REST (Frontend React)
 */

// ============ SERVICES ============

add_filter('rest_prepare_aos_services', function ($response, $post) {
    $post_id = $post->ID;
    $acf_fields = get_fields($post_id);

    if ($acf_fields) {
        // Ajouter les champs ACF dans la réponse
        $response->data['acf'] = $acf_fields;
    }

    // Ajouter aussi le slug personnalisé pour les URLs
    $response->data['slug'] = isset($acf_fields['slug'])
        ? $acf_fields['slug']
        : sanitize_title($post->post_title);

    // Format la réponse pour le frontend (utilise titre_fr comme fallback)
    $response->data['title_display'] = isset($acf_fields['titre_fr'])
        ? $acf_fields['titre_fr']
        : $post->post_title;

    return $response;
}, 10, 2);

add_filter('rest_insert_aos_services', function ($post, $request) {
    // Permet les réponses pré-modérées
    return $post;
}, 10, 2);

// ============ ACTUALITÉS ============

add_filter('rest_prepare_aos_actualites', function ($response, $post) {
    $post_id = $post->ID;
    $acf_fields = get_fields($post_id);

    if ($acf_fields) {
        $response->data['acf'] = $acf_fields;
    }

    // Ajouter le slug pour les URLs dynamiques
    $response->data['slug'] = isset($acf_fields['slug'])
        ? $acf_fields['slug']
        : sanitize_title($post->post_title);

    // Ajouter la date formatée
    $response->data['date'] = isset($acf_fields['article_date'])
        ? $acf_fields['article_date']
        : get_the_date('Y-m-d', $post_id);

    // Ajouter featured image
    $thumbnail_id = get_post_thumbnail_id($post_id);
    if ($thumbnail_id) {
        $image_url = wp_get_attachment_url($thumbnail_id);
        $response->data['featured_image'] = $image_url;
    }

    return $response;
}, 10, 2);

// ============ CHIFFRES CLÉS ============

add_filter('rest_prepare_aos_chiffres', function ($response, $post) {
    $post_id = $post->ID;
    $acf_fields = get_fields($post_id);

    if ($acf_fields) {
        $response->data['acf'] = $acf_fields;
    }

    // Formatter la valeur pour l'affichage
    $response->data['formatted'] = isset($acf_fields['valeur'])
        ? [
            'value' => (int) $acf_fields['valeur'],
            'suffix' => isset($acf_fields['suffixe']) ? $acf_fields['suffixe'] : '',
            'label_fr' => isset($acf_fields['label_fr']) ? $acf_fields['label_fr'] : '',
            'label_ar' => isset($acf_fields['label_ar']) ? $acf_fields['label_ar'] : '',
        ]
        : null;

    return $response;
}, 10, 2);

// ============ DOCUMENTS ============

add_filter('rest_prepare_aos_documents', function ($response, $post) {
    $post_id = $post->ID;
    $acf_fields = get_fields($post_id);

    if ($acf_fields) {
        $response->data['acf'] = $acf_fields;
    }

    // Formatter les infos document
    $response->data['document_info'] = isset($acf_fields['fichier_pdf'])
        ? [
            'url' => $acf_fields['fichier_pdf'],
            'categorie' => isset($acf_fields['categorie']) ? $acf_fields['categorie'] : 'autre',
            'titre_fr' => isset($acf_fields['titre_fr']) ? $acf_fields['titre_fr'] : '',
            'titre_ar' => isset($acf_fields['titre_ar']) ? $acf_fields['titre_ar'] : '',
            'description_fr' => isset($acf_fields['description_fr']) ? $acf_fields['description_fr'] : '',
            'description_ar' => isset($acf_fields['description_ar']) ? $acf_fields['description_ar'] : '',
        ]
        : null;

    return $response;
}, 10, 2);

// ============ ENREGISTRER LES CHAMPS ACF DANS REST ============

add_filter('acf/settings/rest_api_enabled', '__return_true');

// Exposer tous les champs ACF dans l'API REST
add_action('rest_api_init', function () {
    if (!function_exists('acf_add_options_page')) {
        return;
    }

    // Permettre aux clients REST d'accéder aux champs ACF
    // Cela est souvent géré automatiquement par ACF Pro
    // mais cette ligne le force si nécessaire
    update_option('acf_rest_api_enabled', 1);
});
