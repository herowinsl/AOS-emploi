<?php

/**
 * Plugin Name: AOS Custom Post Types & ACF Fields
 * Description: Enregistre les Custom Post Types et champs ACF pour AOS-Emploi
 * Version: 1.0
 * Author: Ilyas Sennane
 */

if (!defined('ABSPATH')) exit;

// ============ CUSTOM POST TYPES ============

add_action('init', function () {

    /**
     * CPT: Services
     * Prestations offertes par l'association (Aide, Prêt, Estivage)
     */
    register_post_type('aos_services', [
        'label'                 => 'Services',
        'singular_label'        => 'Service',
        'public'                => true,
        'hierarchical'          => false,
        'show_in_rest'          => true,
        'rest_base'             => 'services',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        'supports'              => ['title', 'editor', 'custom-fields', 'thumbnail'],
        'rewrite'               => ['slug' => 'service'],
        'menu_icon'             => 'dashicons-briefcase',
        'show_in_menu'          => true,
        'has_archive'           => true,
    ]);

    /**
     * CPT: Actualités
     * Articles d'information et actualités de l'association
     */
    register_post_type('aos_actualites', [
        'label'                 => 'Actualités',
        'singular_label'        => 'Actualité',
        'public'                => true,
        'hierarchical'          => false,
        'show_in_rest'          => true,
        'rest_base'             => 'actualites',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        'supports'              => ['title', 'editor', 'custom-fields', 'thumbnail'],
        'rewrite'               => ['slug' => 'actualite'],
        'menu_icon'             => 'dashicons-newspaper',
        'show_in_menu'          => true,
        'has_archive'           => true,
    ]);

    /**
     * CPT: Chiffres Clés
     * Statistiques et chiffres clés (5000+ membres, etc.)
     */
    register_post_type('aos_chiffres', [
        'label'                 => 'Chiffres Clés',
        'singular_label'        => 'Chiffre',
        'public'                => true,
        'hierarchical'          => false,
        'show_in_rest'          => true,
        'rest_base'             => 'chiffres',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        'supports'              => ['title', 'custom-fields'],
        'menu_icon'             => 'dashicons-chart-bar',
        'show_in_menu'          => true,
        'has_archive'           => false,
    ]);

    /**
     * CPT: Documents
     * Documents accessibles (Statuts, Règlement, Rapports)
     */
    register_post_type('aos_documents', [
        'label'                 => 'Documents',
        'singular_label'        => 'Document',
        'public'                => true,
        'hierarchical'          => false,
        'show_in_rest'          => true,
        'rest_base'             => 'documents',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        'supports'              => ['title', 'custom-fields'],
        'menu_icon'             => 'dashicons-media-document',
        'show_in_menu'          => true,
        'has_archive'           => false,
    ]);
});

// ============ ACF FIELD GROUPS ============

add_action('acf/init', function () {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    /**
     * Field Group: Champs du Service
     */
    acf_add_local_field_group([
        'key'      => 'group_aos_services',
        'title'    => 'Champs du Service',
        'fields'   => [
            [
                'key'           => 'field_service_titre_fr',
                'name'          => 'titre_fr',
                'label'         => 'Titre (Français)',
                'type'          => 'text',
                'required'      => 1,
                'placeholder'   => 'Ex: Aide d\'Urgence',
            ],
            [
                'key'           => 'field_service_titre_ar',
                'name'          => 'titre_ar',
                'label'         => 'Titre (العربية)',
                'type'          => 'text',
                'required'      => 1,
                'placeholder'   => 'مساعدة الطوارئ',
            ],
            [
                'key'           => 'field_service_desc_fr',
                'name'          => 'description_fr',
                'label'         => 'Description Courte (Français)',
                'type'          => 'textarea',
                'rows'          => 4,
                'placeholder'   => 'Brève description pour la carte service',
            ],
            [
                'key'           => 'field_service_desc_ar',
                'name'          => 'description_ar',
                'label'         => 'Description Courte (العربية)',
                'type'          => 'textarea',
                'rows'          => 4,
                'placeholder'   => 'وصف قصير لبطاقة الخدمة',
            ],
            [
                'key'           => 'field_service_icon',
                'name'          => 'icone_url',
                'label'         => 'URL de l\'Icône (SVG)',
                'type'          => 'url',
                'placeholder'   => 'https://example.com/icons/service.svg',
            ],
            [
                'key'           => 'field_service_slug',
                'name'          => 'slug',
                'label'         => 'Slug (URL-friendly)',
                'type'          => 'text',
                'placeholder'   => 'aide-urgence',
                'instructions'  => 'Utilisé pour générer l\'URL /services/aide-urgence',
            ],
        ],
        'location' => [
            [
                ['param' => 'post_type', 'operator' => '==', 'value' => 'aos_services']
            ]
        ],
        'style'    => 'seamless',
        'position' => 'normal',
    ]);

    /**
     * Field Group: Champs de l'Actualité
     */
    acf_add_local_field_group([
        'key'      => 'group_aos_actualites',
        'title'    => 'Champs de l\'Actualité',
        'fields'   => [
            [
                'key'           => 'field_actualite_titre_fr',
                'name'          => 'titre_fr',
                'label'         => 'Titre (Français)',
                'type'          => 'text',
                'required'      => 1,
                'placeholder'   => 'Ex: Assemblée générale 2026',
            ],
            [
                'key'           => 'field_actualite_titre_ar',
                'name'          => 'titre_ar',
                'label'         => 'Titre (العربية)',
                'type'          => 'text',
                'required'      => 1,
                'placeholder'   => 'الجمعية العامة 2026',
            ],
            [
                'key'           => 'field_actualite_extrait_fr',
                'name'          => 'extrait_fr',
                'label'         => 'Extrait (Français)',
                'type'          => 'textarea',
                'rows'          => 3,
                'placeholder'   => 'Résumé court affiché dans le flux',
            ],
            [
                'key'           => 'field_actualite_extrait_ar',
                'name'          => 'extrait_ar',
                'label'         => 'Extrait (العربية)',
                'type'          => 'textarea',
                'rows'          => 3,
                'placeholder'   => 'ملخص قصير معروض في التدفق',
            ],
            [
                'key'           => 'field_actualite_slug',
                'name'          => 'slug',
                'label'         => 'Slug (URL-friendly)',
                'type'          => 'text',
                'placeholder'   => 'assemblee-generale-2026',
                'instructions'  => 'Utilisé pour générer l\'URL /actualites/slug',
            ],
            [
                'key'           => 'field_actualite_author',
                'name'          => 'author_name',
                'label'         => 'Auteur',
                'type'          => 'text',
                'placeholder'   => 'Nom de l\'auteur',
            ],
            [
                'key'           => 'field_actualite_date',
                'name'          => 'article_date',
                'label'         => 'Date d\'article',
                'type'          => 'date_picker',
                'return_format' => 'Y-m-d',
            ],
        ],
        'location' => [
            [
                ['param' => 'post_type', 'operator' => '==', 'value' => 'aos_actualites']
            ]
        ],
        'style'    => 'seamless',
        'position' => 'normal',
    ]);

    /**
     * Field Group: Chiffres Clés
     */
    acf_add_local_field_group([
        'key'      => 'group_aos_chiffres',
        'title'    => 'Champs Chiffres Clés',
        'fields'   => [
            [
                'key'           => 'field_chiffre_valeur',
                'name'          => 'valeur',
                'label'         => 'Valeur Numérique',
                'type'          => 'number',
                'required'      => 1,
                'placeholder'   => '5000',
            ],
            [
                'key'           => 'field_chiffre_suffixe',
                'name'          => 'suffixe',
                'label'         => 'Suffixe (%, +, M, ans, etc.)',
                'type'          => 'text',
                'placeholder'   => '+',
            ],
            [
                'key'           => 'field_chiffre_label_fr',
                'name'          => 'label_fr',
                'label'         => 'Label (Français)',
                'type'          => 'text',
                'required'      => 1,
                'placeholder'   => 'Membres Actifs',
            ],
            [
                'key'           => 'field_chiffre_label_ar',
                'name'          => 'label_ar',
                'label'         => 'Label (العربية)',
                'type'          => 'text',
                'required'      => 1,
                'placeholder'   => 'أعضاء نشطون',
            ],
        ],
        'location' => [
            [
                ['param' => 'post_type', 'operator' => '==', 'value' => 'aos_chiffres']
            ]
        ],
        'style'    => 'seamless',
        'position' => 'normal',
    ]);

    /**
     * Field Group: Champs Document
     */
    acf_add_local_field_group([
        'key'      => 'group_aos_documents',
        'title'    => 'Champs Document',
        'fields'   => [
            [
                'key'           => 'field_doc_fichier',
                'name'          => 'fichier_pdf',
                'label'         => 'Fichier PDF',
                'type'          => 'file',
                'required'      => 1,
                'return_format' => 'url',
                'library'       => 'uploadedTo',
                'mime_types'    => 'pdf',
            ],
            [
                'key'           => 'field_doc_categorie',
                'name'          => 'categorie',
                'label'         => 'Catégorie',
                'type'          => 'select',
                'choices'       => [
                    'statuts'    => 'Statuts',
                    'reglement'  => 'Règlement Intérieur',
                    'rapports'   => 'Rapports',
                    'autre'      => 'Autre',
                ],
                'default_value' => 'autre',
            ],
            [
                'key'           => 'field_doc_titre_fr',
                'name'          => 'titre_fr',
                'label'         => 'Titre (Français)',
                'type'          => 'text',
                'required'      => 1,
                'placeholder'   => 'Statuts de l\'Association',
            ],
            [
                'key'           => 'field_doc_titre_ar',
                'name'          => 'titre_ar',
                'label'         => 'Titre (العربية)',
                'type'          => 'text',
                'required'      => 1,
                'placeholder'   => 'قواعد الجمعية',
            ],
            [
                'key'           => 'field_doc_description_fr',
                'name'          => 'description_fr',
                'label'         => 'Description (Français)',
                'type'          => 'textarea',
                'rows'          => 2,
                'placeholder'   => 'Description du document',
            ],
            [
                'key'           => 'field_doc_description_ar',
                'name'          => 'description_ar',
                'label'         => 'Description (العربية)',
                'type'          => 'textarea',
                'rows'          => 2,
                'placeholder'   => 'وصف الوثيقة',
            ],
        ],
        'location' => [
            [
                ['param' => 'post_type', 'operator' => '==', 'value' => 'aos_documents']
            ]
        ],
        'style'    => 'seamless',
        'position' => 'normal',
    ]);
});
