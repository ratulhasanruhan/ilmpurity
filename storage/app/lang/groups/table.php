<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Table Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines are used in table components, headers,
    | pagination, and data display throughout the application.
    |
    */

    // Common Table Elements
    [
        'name' => 'Common Elements',
        'slug' => 'common_elements',
        'properties' => [
            'type' => 'Type',
            'csv' => 'CSV',
            'resume' => 'Resume',
            'view_resume' => 'View Resume',
            'img_placeholder' => 'IMG',
            'no_data' => 'No data available',
            'go_to_page' => 'Go to page:',
            'previous' => 'Prev',
            'showing_results' => 'Showing results',
            'total_results' => 'Total results',
            'delete_instructor_warning' => 'After deleting the instructor, the admin will be the assign as a new instructor, of this instructor all the courses.',
            'delete_course_warning' => 'After deleting the course, all the related data, like, course sections, lessons, quizzes, enrollments, etc will be deleted automatically.',
        ]
    ],

    // Table Headers Management
    [
        'name' => 'Table Headers Management',
        'slug' => 'table_headers_management',
        'properties' => [
            'name' => 'Name',
            'email' => 'Email',
            'role' => 'Role',
            'slug' => 'Slug',
            'title' => 'Title',
            'use_case' => 'Use Case',
            'sections' => 'Sections',
            'creator' => 'Creator',
            'enrolled_course' => 'Enrolled Course',
            'enrolled_date' => 'Enrolled Date',
            'expiry_date' => 'Expiry Date',
            'payout_amount' => 'Payout amount',
            'payout_method' => 'Payout Method',
            'processed_date' => 'Processed Date',
            'payout_date' => 'Payout Date',
            'enrollments' => 'Enrollments',
            'course_title' => 'Course Title',
            'number_of_course' => 'Number Of Course',
            'category_name' => 'Category Name',
            'category_child' => 'Category Child',
            'meta_description' => 'Meta Description',
            'meta_keywords' => 'Meta Keywords',
        ]
    ],

    // Table Action Labels
    [
        'name' => 'Table Action Labels',
        'slug' => 'table_action_labels',
        'properties' => [
            'action' => 'Action',
            'status' => 'Status',
            'custom_pages' => 'Custom Pages',
            'add_custom_page' => 'Add Custom Page',
        ]
    ],

    // Table Actions & Status
    [
        'name' => 'Table Actions & Status',
        'slug' => 'table_actions_status',
        'properties' => [
            'pay' => 'Pay',
            'print' => 'Print',
            'select' => 'Select',
            'selected' => 'Selected',
            'edit_page' => 'Edit Page',
            'copy_url' => 'Copy URL',
            'preview_page' => 'Preview Page',
            'lifetime_access' => 'Lifetime access',
        ]
    ],

    // Content Text (table-specific)
    [
        'name' => 'Content Text Table Specific',
        'slug' => 'content_text_table_specific',
        'properties' => [
            'url_copied' => 'URL copied to clipboard',
            'best_single_instructor' => 'Best for Single Instructor',
            'best_multiple_instructors' => 'Best for Multiple Instructors',
        ]
    ],
];
