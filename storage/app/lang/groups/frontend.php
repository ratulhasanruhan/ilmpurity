<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Frontend Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines are used by the frontend pages to display
    | various messages and content to the user.
    |
    */

    // Status & Error Messages
    [
        'name' => 'Status & Error Messages',
        'slug' => 'status_error_messages',
        'properties' => [
            'replies' => 'Replies',
            'posting' => 'Posting...',
            'replying' => 'Replying...',
            'something_went_wrong' => 'Something went wrong. Please try again.',
            'network_error' => 'Network error. Please check your connection.',
            'invalid_file_type' => 'Invalid file type. Please select a valid file.',
            'no_element_available' => 'No element available',
            'delete_warning' => 'Are you sure to delete?',
        ]
    ],

    // Common Views
    [
        'name' => 'Common Views',
        'slug' => 'common_views',
        'properties' => [
            'all' => 'All',
            'grid_view' => 'Grid View',
            'list_view' => 'List View',
            'notification_list' => 'Notification List',
            'no_unread_notifications' => 'No unread notifications',
            'closed' => 'Closed',
            'company_fallback' => 'TechCorp Inc.',
            'join_class' => 'Join Class',
            'no_lesson_found' => 'No lesson found',
            'section' => 'Section',
            'section_properties' => 'Section Properties',
        ]
    ],

    // Common Success Messages
    [
        'name' => 'Common Success Messages',
        'slug' => 'common_success_messages',
        'properties' => [
            'job_circulars' => 'Job Circulars',
            'profile_updated' => 'Profile updated successfully',
            'email_changed' => 'Email changed successfully',
            'password_changed' => 'Password changed successfully',
            'application_submitted' => 'Application submitted successfully',
            'comment_posted' => 'Comment posted successfully',
            'reply_posted' => 'Reply posted successfully',
            'email_not_verified' => 'Your email is not verified yet. Please verify your email address by clicking on the link we just emailed to you.',
            'verification_link_sent' => 'A new verification link has been sent to the email address you provided during registration.',
        ]
    ],

    // Navigation & Pagination
    [
        'name' => 'Navigation & Pagination',
        'slug' => 'navigation_pagination',
        'properties' => [
            'privacy_policy' => 'Privacy Policy',
            'terms_of_service' => 'Terms of Service',
            'student_dashboard' => 'Student Dashboard',
            'first_page' => 'First page',
            'last_page' => 'Last page',
            'sort_by' => 'Sort by',
            'showing_results' => 'Showing :from to :to of :total results',
        ]
    ],

    // Course Lists
    [
        'name' => 'Course Lists',
        'slug' => 'course_lists',
        'properties' => [
            'star' => 'Star',
            'stars' => 'Stars',
            'edit_review' => 'Edit Review',
            'review' => 'Review',
            'submit_review' => 'Submit Review',
            'you_rated_this' => 'You rated this',
            'characters' => 'Characters',
            'no_courses_found' => 'No courses found',
            'no_wishlist_items' => 'No wishlist items found',
        ]
    ],

    // Job Circulars
    [
        'name' => 'Job Circulars',
        'slug' => 'job_circulars',
        'properties' => [
            'day_left' => '1 day left',
            'days_left' => ':days days left',
            'negotiable' => 'Negotiable',
            'experience_level' => 'Experience Level',
            'job_type' => 'Job Type',
            'work_type' => 'Work Type',
            'location' => 'Location',
            'positions_available' => 'Positions Available',
            'application_deadline' => 'Application Deadline',
            'contact_email' => 'Contact Email',
            'skills_required' => 'Skills Required',
            'job_description' => 'Job Description',
            'quick_apply' => 'Quick Apply',
            'send_application' => 'Send your application directly to our team',
            'apply_via_email' => 'Apply via Email',
            'job_statistics' => 'Job Statistics',
            'posted' => 'Posted',
            'last_updated' => 'Last updated',
        ]
    ],

    // Shopping Cart
    [
        'name' => 'Shopping Cart',
        'slug' => 'shopping_cart',
        'properties' => [
            'tax' => 'Tax',
            'total' => 'Total',
            'cart_items' => 'Cart items',
            'your_cart_is_empty' => 'Your cart is empty',
            'payment_summary' => 'Payment summary',
            'sub_total' => 'Sub total',
            'discount' => 'Discount',
        ]
    ],

    // Blog System
    [
        'name' => 'Blog System',
        'slug' => 'blog_system',
        'properties' => [
            'all_blogs' => 'All Blogs',
            'latest_blog_posts' => 'Latest Blog Posts',
            'post_a_comment' => 'Post A Comment',
            'no_comments_yet' => 'No comments yet. Be the first to comment!',
            'like' => 'like',
            'dislike' => 'dislike',
            'blog_banner_alt' => 'Blog banner',
            'blog_thumbnail_alt' => 'Blog thumbnail',
            'author_alt' => 'Author',
            'author_initials_fallback' => 'AU',
            'blog_list_alt' => 'Blog List',
            'blog_page_description' => 'Read :total+ articles and tutorials from our instructors and team. Stay updated with insights, news, and how‑to guides.',
            'blog_page_keywords' => 'blogs, articles, tutorials, news, posts, learning, education',
            'default_site_name' => 'Mentor Learning Management System',
        ]
    ],

    // Zoom Live Class
    [
        'name' => 'Zoom Live Class',
        'slug' => 'zoom_live_class',
        'properties' => [
            'loading_zoom_sdk' => 'Loading Zoom SDK...',
            'joining_meeting' => 'Joining Meeting...',
            'unable_to_join_meeting' => 'Unable to Join Meeting',
            'you_can_join_directly' => 'You can join directly using:',
            'open_in_zoom_app' => 'Open in Zoom App',
            'try_again' => 'Try Again',
            'zoom_sdk_not_configured' => 'Zoom SDK not configured. Please contact administrator.',
            'meeting_information_not_found' => 'Meeting information not found.',
            'failed_to_get_meeting_configuration' => 'Failed to get meeting configuration',
            'zoom_sdk_not_loaded' => 'Zoom SDK not loaded',
            'failed_to_initialize_meeting' => 'Failed to initialize meeting',
            'failed_to_join_meeting' => 'Failed to join meeting',
        ]
    ],

    // Certificate
    [
        'name' => 'Certificate',
        'slug' => 'certificate',
        'properties' => [
            'course_certificate_download' => 'Course Certificate Download',
            'download_official_certificate' => 'Download your official course completion certificate',
            'certificate_of_completion' => 'Certificate of Completion',
            'certificate_description' => 'This certificate is proudly presented to acknowledge the successful completion of all course requirements and demonstrates a strong commitment to professional development and learning excellence. This is to certify that',
            'has_successfully_completed' => 'has successfully completed the course',
            'completed_on' => 'Completed on: :date',
            'authorized_certificate' => 'Authorized Certificate of Achievement',
            'download_format' => 'Download Format',
            'png_certificate_saved' => 'Your PNG certificate has been saved to your downloads folder.',
            'pdf_certificate_saved' => 'Your PDF certificate has been saved to your downloads folder.',
        ]
    ],

    // Quiz Viewer
    [
        'name' => 'Quiz Viewer',
        'slug' => 'quiz_viewer',
        'properties' => [
            'summery' => 'Summery',
            'duration' => 'Duration',
            'total_questions' => 'Total Questions',
            'total_marks' => 'Total Marks',
            'pass_marks' => 'Pass Marks',
            'retake' => 'Retake',
            'result' => 'Result',
            'retake_attempts' => 'Retake Attempts',
            'correct_answers' => 'Correct Answers',
            'incorrect_answers' => 'Incorrect Answers',
            'passed' => 'Passed',
            'not_passed' => 'Not Passed',
            'quiz_submitted' => 'Quiz Submitted',
            'start_quiz' => 'Start Quiz',
            'retake_quiz' => 'Retake Quiz',
            'true' => 'True',
            'false' => 'False',
            'hours' => 'Hours',
            'minutes' => 'Minutes',
            'seconds' => 'Seconds',
        ]
    ],

    // Document Viewer
    [
        'name' => 'Document Viewer',
        'slug' => 'document_viewer',
        'properties' => [
            'pdf_document' => 'PDF Document',
            'text_document' => 'Text Document',
            'document' => 'Document',
            'open_in_new_tab' => 'Open in new tab',
            'download_document' => 'Download document',
            'unsupported_document_format' => 'Unsupported Document Format',
            'document_format_cannot_be_previewed' => 'This document format (.{extension}) cannot be previewed directly. You can download it to view with an appropriate application.',
            'open_in_new_tab_button' => 'Open in New Tab',
            'download' => 'Download',
        ]
    ],

    // Course Details
    [
        'name' => 'Course Details',
        'slug' => 'course_details',
        'properties' => [
            'learn_comprehensive_course' => 'Learn with our comprehensive course',
            'online_course_learning_lms' => 'online course, learning, LMS',
            'default_author' => 'UiLib',
            'course_certificate' => 'Course Certificate',
            'enrolled_students' => 'Enrolled Students',
            'student_reviews' => 'Student Reviews',
            'no_reviews_found' => 'No reviews found.',
            'course_curriculum' => 'Course curriculum',
            'there_is_no_lesson_added' => 'There is no lesson added',
            'requirements' => 'Requirements',
            'outcomes' => 'Outcomes',
            'view_details' => 'View Details',
            'students' => 'Students',
            'language' => 'Language',
            'level' => 'Level',
            'expiry_period' => 'Expiry Period',
            'certificate_included' => 'Certificate Included',
            'free' => 'Free',
        ]
    ],

    // Course Actions
    [
        'name' => 'Course Actions',
        'slug' => 'course_actions',
        'properties' => [
            'play_course' => 'Play Course',
            'course_player' => 'Course Player',
            'enroll_now' => 'Enroll Now',
            'buy_now' => 'Buy Now',
            'add_to_cart' => 'Add to cart',
            'add_to_wishlist' => 'Add to Wishlist',
            'remove_from_wishlist' => 'Remove from Wishlist',
        ]
    ],

    // Pagination
    [
        'name' => 'Pagination',
        'slug' => 'pagination',
        'properties' => [
            'prev' => 'Prev',
            'next' => 'Next',
            'go_to_page_colon' => 'Go to page:',
        ]
    ],

    // Course Cards
    [
        'name' => 'Course Cards',
        'slug' => 'course_cards',
        'properties' => [
            'student' => 'Student',
            'trending' => 'Trending',
            'course_details' => 'Course Details',
            'progress' => 'Progress',
        ]
    ],

    // Instructor Management
    [
        'name' => 'Instructor Management',
        'slug' => 'instructor_management',
        'properties' => [
            'instructor' => 'Instructor',
            'all_courses' => 'All Courses',
            'instructor_profile' => 'Instructor Profile',
            'expert_instructor' => 'Expert Instructor',
            'instructor_fallback_keywords' => 'learning, education',
            'application_is' => 'Application is',
            'application_status' => 'Application Status',
            'application_rejected' => 'Unfortunately, your application has been rejected. Please review the requirements and submit again with updated information.',
            'application_under_review' => 'Your application is currently under review by our team. We will get back to you as soon as possible.',
        ]
    ],

    // Job Circulars
    [
        'name' => 'Job Circulars',
        'slug' => 'job_circulars',
        'properties' => [
            'position' => 'position',
            'positions' => 'positions',
            'available' => 'available',
            'company_fallback' => 'TechCorp Inc.',
        ]
    ],

    // Dashboard
    [
        'name' => 'Dashboard',
        'slug' => 'dashboard',
        'properties' => [
            'dashboard' => 'Dashboard',
            'courses' => 'Courses',
            'lessons' => 'Lessons',
            'enrollment' => 'Enrollment',
            'students' => 'Students',
            'course_status' => 'Course Status',
            'latest_pending_withdrawal_request' => 'Latest Pending Withdrawal Request',
            'view_all' => 'View All',
            'no_results' => 'No results.',
        ]
    ],

    // Installer
    [
        'name' => 'Installer',
        'slug' => 'installer',
        'properties' => [
            'php_extension' => 'PHP Extension',
            'symlink_function' => 'Symlink Function',
            'server_requirements_not_met' => "Your server doesn't meet the following requirements",
            'important_notes' => 'Important Notes',
            'symlink_required' => 'Required for Laravel\'s storage:link command to make uploaded files publicly accessible',
            'setup_complete' => 'Setup complete',
            'environment_variables_set' => 'Your changed environment variables are set in the .env file now.',
            'click_here' => 'Click here',
            'get_back_to_project' => 'to get back to your project.',
            'test_connection' => 'Test Connection',
            'database_connection' => 'Database Connection',
            'environment_setup' => 'Environment Setup',
            'admin_setup' => 'Admin Setup',
        ]
    ],

    // Time Formats
    [
        'name' => 'Time Formats',
        'slug' => 'time_formats',
        'properties' => [
            'just_now' => 'Just now',
            'minute_ago' => '1 minute ago',
            'minutes_ago' => ':minutes minutes ago',
            'hour_ago' => '1 hour ago',
            'hours_ago' => ':hours hours ago',
            'days_ago' => ':days days ago',
            'week_ago' => '1 week ago',
            'weeks_ago' => ':weeks weeks ago',
            'month_ago' => '1 month ago',
            'months_ago' => ':months months ago',
            'year_ago' => '1 year ago',
            'years_ago' => ':years years ago',
        ]
    ],
];
