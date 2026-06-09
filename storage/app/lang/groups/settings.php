<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Settings Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines are used by the settings pages to display
    | various messages and content to the user.
    |
    */

    // Settings Configuration & Management
    [
        'name' => 'Settings Configuration & Management',
        'slug' => 'settings_configuration_management',
        'properties' => [
            'social_links' => 'Social Links',
            'system_settings' => 'System Settings',
            'page_settings' => 'Page Settings',
            'live_class_settings' => 'Live Class Settings',
            'payment_gateways' => 'Payment Gateways',
            'custom_global_style' => 'Custom Global Style',
            'account_settings' => 'Account Settings',
            'smtp_settings' => 'SMTP Settings',
            'storage_settings' => 'Storage Settings',
            'language_settings' => 'Language Settings',
            'language_properties' => 'Language Properties',
            'translate_language_properties' => 'Translate Language Properties',
        ]
    ],

    // Common Settings
    [
        'name' => 'Common Settings',
        'slug' => 'common_settings',
        'properties' => [
            'account_settings' => 'Account Settings',
            'live_class_settings' => 'Live Class Settings',
            'configure_zoom' => 'Configure Zoom Server-to-Server OAuth Credentials',
            'smtp_settings' => 'SMTP Settings',
            'email_settings_description' => 'Configure your email sending settings',
            'storage_settings' => 'Storage Settings',
            'storage_settings_description' => 'Configure your storage settings',
        ]
    ],

    // Common Application Terms
    [
        'name' => 'Common Application Terms',
        'slug' => 'common_application_terms',
        'properties' => [
            'application_update' => 'Application Update',
            'application_backup' => 'Application Backup',
            'application_updated' => 'Application updated successfully',
            'updating_application' => 'Updating application...',
        ]
    ],

    // Common Backup Terms
    [
        'name' => 'Common Backup Terms',
        'slug' => 'common_backup_terms',
        'properties' => [
            'backup_name' => 'Backup Name',
            'backup_date' => 'Backup Date',
            'backup_size' => 'Size',
            'backup_status' => 'Status',
            'backup_actions' => 'Actions',
            'backup_history' => 'Backup History',
            'backup_created' => 'Backup created successfully',
            'backup_deleted' => 'Backup deleted successfully',
            'backup_restored' => 'Backup restored successfully',
            'backup_failed' => 'Backup creation failed. Please try again.',
            'backup_recommendation' => 'We strongly recommend creating a backup before updating.',
        ]
    ],

    // Common Descriptions
    [
        'name' => 'Common Descriptions',
        'slug' => 'common_descriptions',
        'properties' => [
            'maintenance_description' => 'Update, backup and restore your application safely and automatically.',
            'update_description' => 'Upload and install application updates safely',
            'backup_description' => 'Create a complete backup of your application including files and database',
            'backup_history_description' => 'View and manage your application backups',
            'home_pages_description' => 'List of all home pages in the system',
            'custom_pages_description' => 'Manage your custom pages',
            'css_description' => 'Write custom CSS that will be applied globally to the site.',
            'email_settings_description' => 'Configure your email sending settings',
            'storage_settings_description' => 'Configure your storage settings',
            'system_settings_description' => 'Manage your system\'s core settings',
            'translation_description' => 'Translate Language Properties',
            'edit_custom_page' => 'Edit Custom Page',
            'translation_update' => 'Translation Update',
            'elements' => 'Elements',
            'configure_zoom' => 'Configure Zoom Server-to-Server OAuth Credentials',
            'available_home_pages' => 'Available Home Pages',
            'css_description' => 'Write custom CSS that will be applied globally to the site.',
        ]
    ],

    // Application Update
    [
        'name' => 'Application Update',
        'slug' => 'application_update',
        'properties' => [
            'confirm_application_update' => 'Confirm Application Update',
            'updating_application' => 'Updating application...',
            'do_not_close_window' => 'Please do not close this window',
            'update_application_with' => 'Are you sure you want to update the application with :filename?',
            'this_update_will' => 'This update will:',
            'put_site_maintenance' => 'Put the site in maintenance mode',
            'replace_application_files' => 'Replace all application files',
            'run_database_migrations' => 'Run database migrations',
            'process_may_take_minutes' => 'Process may take several minutes',
            'backup_first_warning' => 'Make sure you have created a backup first! This action cannot be undone.',
            'select_zip_file' => 'Select File (.zip only)',
            'selected_file' => 'Selected file:',
            'file_selected_successfully' => 'File selected successfully. Click "Update Application" to proceed.',
            'update_application' => 'Update Application',
            'uploading' => 'Uploading...',
            'important_update_guidelines' => 'Important Update Guidelines',
            'refresh_server_guideline' => 'Every time refresh server before updating',
            'backup_first_guideline' => 'Always create a backup before updating',
            'file_format_guideline' => 'Upload must be a valid ZIP file',
            'maintenance_mode_guideline' => 'Site will be temporarily unavailable during update',
            'migrations_guideline' => 'Database migrations will be automatically applied',
            'downtime_guideline' => 'Update process may take several minutes',
            'browser_guideline' => 'Do not refresh or close browser during update',
            'compatibility_guideline' => 'Ensure the update is compatible with your system',
            'refresh_server' => 'Refresh Server',
            'backup_first' => 'Backup First',
            'file_format' => 'File Format',
            'maintenance_mode' => 'Maintenance Mode',
            'migrations' => 'Migrations',
            'downtime' => 'Downtime',
            'browser' => 'Browser',
            'compatibility' => 'Compatibility',
            'application_update_title' => 'Application Update',
            'upload_install_description' => 'Upload and install the latest version of your application',
            'refresh_server_button' => 'Refresh Server',
            'updating_application_button' => 'Updating Application...',
        ]
    ],

    // Payment Gateway Settings
    [
        'name' => 'Payment Gateway Settings',
        'slug' => 'payment_gateway_settings',
        'properties' => [
            'paypal_settings' => 'PayPal Settings',
            'stripe_settings' => 'Stripe Settings',
            'mollie_settings' => 'Mollie Settings',
            'paystack_settings' => 'Paystack Settings',
            'razorpay_settings' => 'Razorpay Settings',
            'sslcommerz_settings' => 'SSLCommerz Settings',
            'paytm_settings' => 'Paytm Settings',
            'configure_payment_gateway' => 'Configure :gateway payment gateway',
        ]
    ],

    // Environment Settings
    [
        'name' => 'Environment Settings',
        'slug' => 'environment_settings',
        'properties' => [
            'test_mode' => 'Test Mode',
            'using_test_environment' => 'Using Test Environment',
            'using_live_environment' => 'Using Live Environment',
            'using_sandbox_environment' => 'Using Sandbox Environment',
            'using_production_environment' => 'Using Production Environment',
            'using_staging_environment' => 'Using Staging Environment',
            'using_test_keys' => 'Using Test Keys',
            'using_live_keys' => 'Using Live Keys',
        ]
    ],

    // Credential Sections
    [
        'name' => 'Credential Sections',
        'slug' => 'credential_sections',
        'properties' => [
            'api_credentials' => 'API Credentials',
            'test_credentials' => 'Test Credentials',
            'live_credentials' => 'Live Credentials',
            'sandbox_credentials' => 'Sandbox Credentials',
            'production_credentials' => 'Production Credentials',
        ]
    ],

    // Helper Messages
    [
        'name' => 'Helper Messages',
        'slug' => 'helper_messages',
        'properties' => [
            'use_test_mode_key' => 'Use your test mode :key',
            'use_live_mode_key' => 'Use your live mode :key',
            'use_staging_key' => 'Use your staging :key',
            'use_production_key' => 'Use your production :key',
        ]
    ],

    // Common Warnings
    [
        'name' => 'Common Warnings',
        'slug' => 'common_warnings',
        'properties' => [
            'delete_backup_warning' => 'Are you sure you want to delete this backup? This action cannot be undone.',
            'restore_backup_warning' => 'Are you sure you want to restore from this backup? This will:',
            'system_type_warning' => 'Are you sure you want to change the system type? This action will affect the entire application behavior.',
            'update_system_type_warning' => 'Are you sure to update system type?',
            'update_warning' => 'This update will:',
        ]
    ],

    // Common Error Messages
    [
        'name' => 'Common Error Messages',
        'slug' => 'common_error_messages',
        'properties' => [
            'update_failed' => 'Update failed. Please try again.',
            'restore_failed' => 'Backup restoration failed. Please try again.',
            'delete_failed' => 'Backup deletion failed. Please try again.',
            'server_refreshed' => 'Server refreshed successfully',
        ]
    ],

    // Common Configuration
    [
        'name' => 'Common Configuration',
        'slug' => 'common_configuration',
        'properties' => [
            'config_not_found' => 'Configuration not found.',
            'footer_config_not_found' => 'Footer configuration not found.',
            'navbar_config_not_found' => 'Navbar configuration not found.',
            'configuration' => 'Configuration: Environment and config files',
        ]
    ],

    // General Settings
    [
        'name' => 'General Settings',
        'slug' => 'general_settings',
        'properties' => [
            'manage_core_settings' => 'Manage your system\'s core settings',
            'app_maintenance' => 'App Maintenance',
            'app_version' => 'App Version',
            'current_version' => 'Current Version:',
        ]
    ],

    // Navbar & Footer
    [
        'name' => 'Navbar & Footer',
        'slug' => 'navbar_footer',
        'properties' => [
            'live_navbar_preview' => 'Live Navbar Preview',
            'live_footer_preview' => 'Live Footer Preview',
            'interactive_preview' => 'Interactive preview of',
            'before_login' => 'Before Login',
            'after_login' => 'After Login',
        ]
    ],

    // Pages
    [
        'name' => 'Pages',
        'slug' => 'pages',
        'properties' => [
            'available_home_pages' => 'Available Home Pages',
            'collaborative' => 'Collaborative',
            'administrative' => 'Administrative',
            'custom_pages' => 'Custom Pages',
        ]
    ],

    // Maintenance
    [
        'name' => 'Maintenance',
        'slug' => 'maintenance',
        'properties' => [
            'note' => 'Note',
            'what_backed_up' => 'What will be backed up?',
            'source_code' => 'Source Code: All application files and code',
            'database' => 'Database: Complete MySQL database dump',
            'assets' => 'Assets: Uploaded media and public files',
            'refresh_note' => 'Note: Every time refresh server before backup.',
            'what_backed_up' => 'What will be backed up?',
            'source_code' => 'Source Code: All application files and code',
            'database' => 'Database: Complete MySQL database dump',
            'configuration' => 'Configuration: Environment and config files',
        ]
    ],

    // Backup Management
    [
        'name' => 'Backup Management',
        'slug' => 'backup_management',
        'properties' => [
            'deleting_backup' => 'Deleting backup...',
            'restoring_backup' => 'Restoring backup...',
            'do_not_close' => 'Please do not close this window',
            'restore_backup_confirmation' => 'Are you sure you want to restore the backup ":backup_name"?',
            'backup_details' => 'Backup Details',
            'permanently_delete_files' => 'Permanently delete the backup files from storage',
            'remove_backup_record' => 'Remove the backup record from the database',
            'cannot_be_undone' => 'Cannot be undone or recovered',
            'replace_current_files' => 'Overwrite all current application files',
            'restore_database_state' => 'Replace the entire database with backup data',
            'current_data_lost' => 'All current data and files will be lost',
            'action_cannot_undone' => 'This action cannot be undone',
            'critical_warning' => 'Critical Warning',
            'restore_process_time' => 'Process may take several minutes',
            'maintenance_mode_enabled' => 'Put the site in maintenance mode',
        ]
    ],

    // Application Update
    [
        'name' => 'Application Update',
        'slug' => 'application_update',
        'properties' => [
            'confirm_application_update' => 'Confirm Application Update',
            'update_application_with' => 'Are you sure you want to update the application with ":filename"?',
            'updating_application' => 'Updating application...',
            'select_update_file' => 'Select Update File',
            'drag_drop_update_file' => 'Drag and drop your update file here, or click to browse',
            'update_file_requirements' => 'Only .zip files are allowed. Maximum file size: 500MB',
            'no_file_selected' => 'No file selected',
            'file_selected' => 'File selected',
            'browse_files' => 'Browse Files',
            'update_application' => 'Update Application',
        ]
    ],

    // Website Settings
    [
        'name' => 'Website Settings',
        'slug' => 'website_settings',
        'properties' => [
            'website_information' => 'Website Information',
            'contact_information' => 'Contact Information',
            'media_settings' => 'Media Settings',
            'logo_favicon' => 'Logo & Favicon',
            'social_media_links' => 'Social Media Links',
        ]
    ],

    // Payment Gateway Settings
    [
        'name' => 'Payment Gateway Settings',
        'slug' => 'payment_gateway_settings',
        'properties' => [
            'mollie_settings' => 'Mollie Settings',
            'paypal_settings' => 'PayPal Settings',
            'stripe_settings' => 'Stripe Settings',
            'paystack_settings' => 'Paystack Settings',
            'razorpay_settings' => 'Razorpay Settings',
            'sslcommerz_settings' => 'SSLCommerz Settings',
            'paytm_settings' => 'Paytm Settings',
            'configure_payment_gateway' => 'Configure :gateway payment gateway',
            'api_credentials' => 'API Credentials',
            'test_credentials' => 'Test Credentials',
            'live_credentials' => 'Live Credentials',
            'sandbox_credentials' => 'Sandbox Credentials',
            'production_credentials' => 'Production Credentials',
            'test_mode' => 'Test Mode',
            'using_test_environment' => 'Using Test Environment',
            'using_live_environment' => 'Using Live Environment',
            'using_sandbox_environment' => 'Using Sandbox Environment',
            'using_production_environment' => 'Using Production Environment',
            'using_test_keys' => 'Using Test Keys',
            'using_live_keys' => 'Using Live Keys',
            'using_staging_environment' => 'Using Staging Environment',
            'use_test_mode_key' => 'Use your test mode :key',
            'use_live_mode_key' => 'Use your live mode :key',
            'use_staging_key' => 'Use your staging :key',
            'use_production_key' => 'Use your production :key',
        ]
    ],
    // Update Process
    [
        'name' => 'Update Process',
        'slug' => 'update_process',
        'properties' => [
            'maintenance_mode' => 'Put the site in maintenance mode',
            'replace_files' => 'Replace all application files',
            'run_migrations' => 'Run database migrations',
            'process_update' => 'Process the update automatically',
            'do_not_close' => 'Please do not close this window',
        ]
    ],

    // Backup Management
    [
        'name' => 'Backup Management',
        'slug' => 'backup_management',
        'properties' => [
            'deleting_backup' => 'Deleting backup...',
            'restoring_backup' => 'Restoring backup...',
            'no_backups' => 'No backups found',
            'no_backups_description' => 'You haven\'t created any backups yet. Create your first backup to get started.',
            'replace_current_files' => 'Replace all current application files',
            'restore_database' => 'Restore the database to the backup state',
            'overwrite_changes' => 'Overwrite any changes made since the backup',
        ]
    ],

    // Live Class Settings
    [
        'name' => 'Live Class Settings',
        'slug' => 'live_class_settings',
        'properties' => [
            'configure_zoom' => 'Configure Zoom Server-to-Server OAuth Credentials',
            'zoom_setup_guide' => 'Zoom Setup Guide',
            'setup_instructions' => 'Follow these steps to set up Zoom integration:',
            'create_zoom_app' => 'Create a Server-to-Server OAuth app in Zoom Marketplace',
            'get_credentials' => 'Get your Account ID, Client ID, and Client Secret',
            'configure_scopes' => 'Configure the required scopes for your app',
        ]
    ],
];
