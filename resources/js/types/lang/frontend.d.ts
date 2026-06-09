interface FrontendLang {
   // Status & Error Messages
   replies: string;
   posting: string;
   replying: string;
   something_went_wrong: string;
   network_error: string;
   invalid_file_type: string;
   no_element_available: string;
   delete_warning: string;

   // Common Views
   all: string;
   grid_view: string;
   list_view: string;
   notification_list: string;
   no_unread_notifications: string;
   closed: string;
   company_fallback: string;
   join_class: string;
   no_lesson_found: string;
   section: string;
   section_properties: string;

   // Common Success Messages
   job_circulars: string;
   profile_updated: string;
   email_changed: string;
   password_changed: string;
   application_submitted: string;
   comment_posted: string;
   reply_posted: string;
   email_not_verified: string;
   verification_link_sent: string;

   // Navigation & Pagination
   privacy_policy: string;
   terms_of_service: string;
   student_dashboard: string;
   first_page: string;
   last_page: string;
   sort_by: string;
   showing_results: string;

   // Course Lists
   star: string;
   stars: string;
   edit_review: string;
   review: string;
   submit_review: string;
   you_rated_this: string;
   characters: string;
   no_courses_found: string;
   no_wishlist_items: string;

   // Job Circulars
   day_left: string;
   days_left: string;
   negotiable: string;
   experience_level: string;
   job_type: string;
   work_type: string;
   location: string;
   positions_available: string;
   application_deadline: string;
   contact_email: string;
   skills_required: string;
   job_description: string;
   quick_apply: string;
   send_application: string;
   apply_via_email: string;
   job_statistics: string;
   posted: string;
   last_updated: string;

   // Shopping Cart
   tax: string;
   total: string;
   cart_items: string;
   your_cart_is_empty: string;
   payment_summary: string;
   sub_total: string;
   discount: string;

   // Blog System
   all_blogs: string;
   latest_blog_posts: string;
   post_a_comment: string;
   no_comments_yet: string;
   like: string;
   dislike: string;
   blog_banner_alt: string;
   blog_thumbnail_alt: string;
   author_alt: string;
   author_initials_fallback: string;
   blog_list_alt: string;
   blog_page_description: string;
   blog_page_keywords: string;
   default_site_name: string;

   // Zoom Live Class
   loading_zoom_sdk: string;
   joining_meeting: string;
   unable_to_join_meeting: string;
   you_can_join_directly: string;
   open_in_zoom_app: string;
   try_again: string;
   zoom_sdk_not_configured: string;
   meeting_information_not_found: string;
   failed_to_get_meeting_configuration: string;
   zoom_sdk_not_loaded: string;
   failed_to_initialize_meeting: string;
   failed_to_join_meeting: string;

   // Certificate
   course_certificate_download: string;
   download_official_certificate: string;
   certificate_of_completion: string;
   certificate_description: string;
   has_successfully_completed: string;
   completed_on: string;
   authorized_certificate: string;
   download_format: string;
   png_certificate_saved: string;
   pdf_certificate_saved: string;

   // Quiz Viewer
   summery: string;
   duration: string;
   total_questions: string;
   total_marks: string;
   pass_marks: string;
   retake: string;
   result: string;
   retake_attempts: string;
   correct_answers: string;
   incorrect_answers: string;
   passed: string;
   not_passed: string;
   quiz_submitted: string;
   start_quiz: string;
   retake_quiz: string;
   true: string;
   false: string;
   hours: string;
   minutes: string;
   seconds: string;

   // Document Viewer
   pdf_document: string;
   text_document: string;
   document: string;
   open_in_new_tab: string;
   download_document: string;
   unsupported_document_format: string;
   document_format_cannot_be_previewed: string;
   open_in_new_tab_button: string;
   download: string;

   // Course Details
   learn_comprehensive_course: string;
   online_course_learning_lms: string;
   default_author: string;
   course_certificate: string;
   enrolled_students: string;
   student_reviews: string;
   no_reviews_found: string;
   course_curriculum: string;
   there_is_no_lesson_added: string;
   requirements: string;
   outcomes: string;

   view_details: string;
   students: string;
   language: string;
   level: string;
   expiry_period: string;
   certificate_included: string;
   free: string;

   // Course Actions
   play_course: string;
   course_player: string;
   enroll_now: string;
   buy_now: string;
   add_to_cart: string;
   add_to_wishlist: string;
   remove_from_wishlist: string;

   // Pagination
   prev: string;
   next: string;
   go_to_page_colon: string;

   // Course Cards
   student: string;
   trending: string;
   course_details: string;
   progress: string;

   // Instructor Management
   instructor: string;
   all_courses: string;
   instructor_profile: string;
   expert_instructor: string;
   instructor_fallback_keywords: string;
   application_is: string;
   application_status: string;
   application_rejected: string;
   application_under_review: string;

   // Job Circulars
   position: string;
   positions: string;
   available: string;
   company_fallback: string;

   // Dashboard
   dashboard: string;
   courses: string;
   lessons: string;
   enrollment: string;
   students: string;
   course_status: string;
   latest_pending_withdrawal_request: string;
   view_all: string;
   no_results: string;

   // Installer
   php_extension: string;
   symlink_function: string;
   server_requirements_not_met: string;
   important_notes: string;
   symlink_required: string;
   setup_complete: string;
   environment_variables_set: string;
   click_here: string;
   get_back_to_project: string;
   test_connection: string;
   database_connection: string;
   environment_setup: string;
   admin_setup: string;

   // Time Formats
   just_now: string;
   minute_ago: string;
   minutes_ago: string;
   hour_ago: string;
   hours_ago: string;
   days_ago: string;
   week_ago: string;
   weeks_ago: string;
   month_ago: string;
   months_ago: string;
   year_ago: string;
   years_ago: string;
}
