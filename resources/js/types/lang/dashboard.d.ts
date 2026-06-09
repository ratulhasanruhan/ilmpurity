interface DashboardLang {
   // Common Management
   user_management: string;
   course_management: string;
   content_management: string;
   financial_management: string;
   refund_management: string;
   faq_management: string;

   // Common Settings
   security_settings: string;
   backup_settings: string;
   tax_settings: string;
   webhook_settings: string;

   // Common Analytics & Reports
   analytics: string;
   reports: string;
   visitor_analytics: string;
   course_analytics: string;
   enrollment_statistics: string;
   revenue_statistics: string;
   course_statistics: string;
   sales_report: string;
   user_activity_report: string;
   course_performance_report: string;
   financial_report: string;
   export_report: string;

   // Common Information & Details
   basic_information: string;
   blog_information: string;
   user_information: string;
   media_details: string;
   compensation_details: string;

   // Common Totals
   total_blogs: string;
   total_categories: string;
   total_jobs: string;
   total_users: string;
   total_earnings: string;
   total_withdrawals: string;

   // Common Selectors
   select_user_type: string;
   select_withdrawal_method: string;
   select_recipients: string;
   select_media: string;

   // Common Messages
   no_results: string;
   no_results_found: string;
   are_you_absolutely_sure: string;
   update_the_category: string;
   image_upload_requirements: string;

   // Dashboard Related
   admin: string;
   archived: string;
   user_list: string;
   instructor_list: string;
   course_list: string;
   newsletter_list: string;
   payout_list: string;
   lessons: string;
   quizzes: string;
   total_content_items: string;
   enrollment: string;
   course_status: string;
   update_section: string;
   update_lesson: string;
   update_quiz: string;
   sort_items: string;

   // Job Circular Management
   job_circulars: string;
   no_job_circulars_found: string;
   provide_essential_job_details: string;
   specify_job_requirements: string;
   provide_salary_details: string;
   salary_information: string;
   salary_information_title: string;
   salary_range: string;
   salary_currency: string;
   salary_negotiable: string;
   application_deadline: string;
   contact_email: string;
   skills_required: string;
   positions_available: string;
   job_type: string;
   work_type: string;
   experience_level: string;
   job_details: string;
   job_details_title: string;

   // Newsletter Management
   all: string;
   student: string;
   send_to: string;
   send_newsletter: string;
   no_newsletters_found: string;

   // Payout Management
   available: string;
   total_payout: string;
   requested: string;
   withdraw_list: string;
   payout_history: string;
   payout_request: string;

   // Instructor Management
   feedback: string;
   course_instructor: string;
   approval_status: string;

   // Blog Management
   blog: string;
   add_new_blog: string;
   provide_essential_details: string;
   blog_categories: string;
   blog_category: string;
   protected_category: string;
   default_category_description: string;
   protected_category_desc: string;
   icon_picker: string;
   sort_categories: string;
   add_category: string;
   create_category: string;
   add_new_category: string;
   enter_blog_title: string;
   blog_information: string;
   blog_information_desc: string;
   enter_category_name: string;
   pick_category_icon: string;
   category_status: string;

   // Newsletters
   all_users: string;
   only_students: string;
   only_instructors: string;

   // Payouts
   pending_withdrawals: string;
   available_balance: string;
   withdraw_amount: string;
   minimum_withdraw: string;
   maximum_withdraw: string;
   withdrawal_method: string;
   withdrawal_note: string;
   withdrawal_note_placeholder: string;

   // Users
   user_role: string;
   provide_essential_user_details: string;

   // Content Management
   media_library: string;
   file_manager: string;
   upload_media: string;
   file_name: string;
   file_size: string;
   file_type: string;
   upload_date: string;
   dimensions: string;

   // Communication
   notifications: string;
   messages: string;
   announcements: string;

   // SEO Management
   meta_title: string;
   enter_meta_title: string;
   meta_keywords: string;
   enter_meta_keywords: string;
   meta_description: string;
   enter_meta_description: string;
   og_title: string;
   enter_og_title: string;
   og_description: string;
   enter_og_description: string;

   // Lesson Forms
   lesson_type: string;
   video_file: string;
   video_url: string;
   document_file: string;
   image_file: string;
   text_content: string;
   embed_source: string;
   lesson_title: string;
   lesson_status: string;
   is_free: string;
   lesson_description: string;
   lesson_provider: string;
   lesson_source: string;
   duration: string;
   lesson_summary: string;

   // Quiz Forms
   quiz_title: string;
   enter_quiz_title: string;
   total_mark: string;
   pass_mark: string;
   retake: string;
   quiz_summary: string;
   hours: string;
   minutes: string;
   seconds: string;

   // Question Forms
   question_type: string;
   single_choice: string;
   multiple_choice: string;
   true_false: string;
   select_question_type: string;
   question_title: string;
   question_options: string;
   correct_answer: string;
   add_question: string;
   edit_question: string;

   // Course Content
   sections: string;
   section_title: string;
   section_description: string;
   lesson_content: string;
   quiz_questions: string;
   assignments: string;

   // User Management
   user_roles: string;
   permissions: string;
   user_activity: string;
   login_history: string;
   user_preferences: string;
   update_user: string;
   select_approval_status: string;

   // Course Progress
   course_progress: string;
   completion_rate: string;
   time_spent: string;
   quiz_scores: string;
   certificates_issued: string;

   // Financial Management
   admin_revenue: string;
   instructor_revenue: string;
   revenue_tracking: string;
   commission_rates: string;
   payment_history: string;
   instructor_revenue_this_year: string;
   admin_revenue_this_year: string;

   // Content Moderation
   content_review: string;
   flagged_content: string;
   moderation_queue: string;
   content_guidelines: string;

   // Support & Help
   help_desk: string;
   support_tickets: string;
   documentation: string;

   // Marketing
   marketing_campaigns: string;
   promotional_codes: string;
   affiliate_program: string;
   email_marketing: string;

   // Integration
   third_party_integrations: string;
   api_management: string;
   external_services: string;

   // Dashboard Statistics
   published: string;
   draft: string;
   active: string;
   inactive: string;

   // Course Forms
   category_required: string;
   select_course_instructor: string;
   status_required: string;

   // Course Creation
   price: string;
   enter_course_title: string;
   enter_short_description: string;
   type_content_here: string;
   type_caption_optional: string;
   course_status: string;
   course_level: string;
   course_language: string;
   pricing_type_required: string;
   enter_course_price: string;
   check_course_discount: string;
   enter_discount_price: string;
   expiry_type: string;
   expiry_duration: string;
   drip_content: string;
   enable_drip_content: string;
   course_instructor: string;
   select_instructor: string;
   course_category: string;
   select_category: string;

   // Course Update Header
   course_preview: string;
   course_player: string;
   submit_for_approval: string;
   course_approval_status: string;
   course_ready_approval: string;
   course_needs_attention: string;
   course_content_summary: string;

   // Course Info
   course_faqs: string;
   requirements: string;
   outcomes: string;
   sort_items: string;

   // Live Classes
   live_classes: string;
   schedule_new_live_class: string;
   schedule_live_class: string;
   zoom_not_enabled: string;
   enable_zoom: string;
   no_live_classes_scheduled: string;
   schedule_first_live_class: string;
   class_topic_required: string;
   enter_class_topic: string;
   start_date_time_required: string;
   class_notes_optional: string;
   scheduling: string;
   schedule_class: string;
   join_class: string;
   edit_class: string;
   delete_class: string;

   // Media Management
   banner: string;
   thumbnail: string;
   preview_video_type: string;
   preview_video_url: string;
   enter_video_url: string;

   // Question Forms
   single_choice: string;
   multiple_choice: string;
   true_false: string;
   select_question_type: string;
   question_options: string;
   correct_answer: string;

   // Blog Categories
   blog_categories: string;
   blog_category: string;
   total_number_of_blog: string;
   update_category: string;
   category_description: string;
   category_thumbnail: string;

   // Blog Form
   blog_information: string;
   provide_blog_details: string;
   title_80_char: string;
   enter_blog_title: string;
   keywords_80_char: string;
   enter_your_keywords: string;
   write_blog_content_here: string;
   media_files: string;
   upload_banner_thumbnail_desc: string;
   blog_banner: string;
   blog_thumbnail: string;
   update_blog: string;
   add_blog: string;

   // Category Form
   enter_category_name: string;
   pick_category_icon: string;
   icon_picker: string;
   subtitle_80_char: string;
   enter_category_description: string;

   // Course Management
   course_faqs: string;
   requirements: string;
   outcomes: string;
   live_classes: string;
   no_live_classes_scheduled: string;
   schedule_first_live_class: string;
   zoom_not_enabled: string;
   enable_zoom: string;

   // Course Forms
   course_title: string;
   short_description: string;
   course_instructor: string;
   course_level: string;
   made_in: string;
   enable_drip_content: string;
   pricing_type: string;
   expiry_period_type: string;
   expiry_date: string;
   preview_video: string;
   video_url: string;
   video_file: string;

   // SEO Form
   meta_title: string;
   meta_keywords: string;
   meta_description: string;
   og_title: string;
   og_description: string;

   // Question Form
   question_type: string;
   question_title: string;
   single_choice: string;
   true_false: string;

   // Lesson Form
   lesson_title: string;
   lesson_status: string;
   is_free: string;
   lesson_type: string;
   lesson_provider: string;
   lesson_duration: string;
   embed_source: string;
   video_file: string;
   video_url: string;
   document_file: string;
   image_file: string;
   text_content: string;

   // Live Class Form
   class_topic: string;
   start_date_time: string;
   class_notes: string;

   // Course Status
   feedback: string;
   course_approval_status: string;
   course_ready_approval: string;
   course_needs_attention: string;
   course_content_summary: string;

   // Course Info Sections
   outcomes: string;
   course_faqs: string;
   requirements: string;
   section_title: string;

   // Live Class
   live_classes: string;
   no_live_classes_scheduled: string;
   zoom_not_enabled_message: string;
   schedule_first_live_class: string;

   // Live Class Status
   live: string;
   upcoming: string;
   ended: string;
   scheduled: string;
}
