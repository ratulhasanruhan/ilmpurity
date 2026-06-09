interface TableLang {
   // Common Table Elements
   type: string;
   csv: string;
   resume: string;
   view_resume: string;
   img_placeholder: string;
   no_data: string;
   go_to_page: string;
   previous: string;
   showing_results: string;
   total_results: string;
   delete_instructor_warning: string;
   delete_course_warning: string;

   // Table Headers Management
   name: string;
   email: string;
   role: string;
   slug: string;
   title: string;
   use_case: string;
   sections: string;
   creator: string;
   enrolled_course: string;
   enrolled_date: string;
   expiry_date: string;
   payout_amount: string;
   payout_method: string;
   processed_date: string;
   payout_date: string;
   enrollments: string;
   course_title: string;
   number_of_course: string;
   category_name: string;
   category_child: string;
   meta_description: string;
   meta_keywords: string;

   // Table Action Labels
   action: string;
   status: string;
   add_custom_page: string;
   custom_pages: string;

   // Table Actions & Status
   pay: string;
   print: string;
   select: string;
   selected: string;
   edit_page: string;
   copy_url: string;
   preview_page: string;
   lifetime_access: string;

   // Table Content Text (table-specific)
   url_copied: string;
   best_single_instructor: string;
   best_multiple_instructors: string;
}
