// course_categories.ts
interface CourseCategory extends TableCommon {
   title: string;
   slug: string;
   icon: string;
   logo: string;
   sort: number;
   status: number;
   keywords?: string;
   description?: string;
   thumbnail?: string;
   courses?: Course[];
   courses_count?: number;
   category_children?: CourseCategoryChild[];
}

// course_category_children.ts
interface CourseCategoryChild extends TableCommon {
   title: string;
   slug: string;
   icon: string;
   sort: number;
   status: number;
   keywords?: string;
   description?: string;
   course_category_id: number;
}

// courses.ts
interface Course extends TableCommon {
   title: string;
   slug: string;
   short_description: string;
   course_type: string;
   status: 'draft' | 'upcoming' | 'pending' | 'rejected' | 'approved';
   level: string;
   language?: string;
   pricing_type: string;
   price: number;
   discount?: number;
   discount_price?: number;
   drip_content: number;
   meta_title?: string;
   meta_keywords?: string;
   meta_description?: string;
   og_title?: string;
   og_description?: string;
   thumbnail?: string;
   banner?: string;
   preview?: string;
   reviews_count?: number;
   average_rating?: number;
   expiry_type?: 'lifetime' | 'limited_time';
   expiry_duration?: Date;
   description?: string;
   requirements?: CourseRequirement[];
   outcomes?: CourseOutcome[];
   faqs?: CourseFaq[];
   user_id: number | string;
   reviews: CourseReview[];
   sections: CourseSection[];
   instructor: Instructor;
   enrollments: Enrollment[];
   enrollments_count?: number;
   instructor_id: number | string;
   live_classes: CourseLiveClass[];
   assignments: CourseAssignment[];
   course_category: CourseCategory;
   course_category_child?: CourseCategoryChild;
   course_category_id: number | string;
   course_category_child_id: number | string;
   [key: string]: any;
}

// course_sections.ts
interface CourseSection extends TableCommon {
   title: string;
   sort: number;
   user_id: number;
   course_id: number;
   section_lessons: SectionLesson[];
   section_quizzes: SectionQuiz[];
}

// section_lessons.ts
interface SectionLesson extends TableCommon {
   title: string;
   sort: number;
   status: boolean;
   lesson_type: string;
   lesson_src?: string;
   lesson_provider?: string;
   embed_source?: string;
   thumbnail?: string;
   duration?: string;
   is_free: number;
   description?: string;
   summary?: string;
   course: Course;
   forums: CourseForum[];
   resources: LessonResource[];
   course_id: number;
   course_section_id: number;
   course_section: CourseSection;
}

// lesson_resources.ts
interface LessonResource extends TableCommon {
   title: string;
   type: string;
   resource: string;
   section_lesson_id: number;
}

// section_assignments.ts
interface CourseAssignment extends TableCommon {
   title: string;
   total_mark: number;
   pass_mark: number;
   retake: number;
   summary?: string;
   deadline: string;
   late_submission: boolean;
   late_total_mark: number;
   late_deadline?: string;
   submissions: AssignmentSubmission[];
   course_id: number;
}

// assignment_submissions.ts
interface AssignmentSubmission extends TableCommon {
   attachment_type: 'url' | 'file';
   attachment_path: string;
   comment?: string | null;
   submitted_at: string;
   marks_obtained: number;
   instructor_feedback?: string | null;
   status: 'pending' | 'graded' | 'late' | 'resubmitted';
   attempt_number: number;
   is_late: boolean;
   course_assignment_id: number;
   user_id: number;
   graded_by?: number | null;
   assignment?: CourseAssignment;
   student?: User;
   grader?: User;
}

// section_quizzes.ts
interface SectionQuiz extends TableCommon {
   title: string;
   duration: string; // represents SQL TIME format 'HH:MM:SS'
   hours: number;
   minutes: number;
   seconds: number;
   total_mark: number;
   pass_mark: number;
   retake: number;
   drip_rule?: number | null;
   summary?: string | null;
   num_questions?: number | null;
   course_id: number;
   quiz_questions: QuizQuestion[];
   quiz_submissions: QuizSubmission[];
   course_section_id: number;
   section_lesson_id: number;
}

// quiz_questions.ts
interface QuizQuestion extends TableCommon {
   title: string;
   type: string;
   options?: any; // Use a more specific type if possible
   answer?: any; // Use a more specific type if possible
   sort: number;
   section_quiz_id: number;
   answers: QuestionAnswer[];
}

// question_answers.ts
interface QuestionAnswer extends TableCommon {
   answers: any; // Use a more specific type if possible
   is_correct: boolean;
   user_id: number;
   quiz_question_id: number;
}

// quiz_submissions.ts
interface QuizSubmission extends TableCommon {
   attempts: number;
   correct_answers: number;
   incorrect_answers: number;
   total_marks: number;
   is_passed: boolean;
   section_quiz_id: number;
   user_id: number;
}

// course_forums.ts
interface CourseForum extends TableCommon {
   title: string;
   description: string;
   likes: { user_id: number }[];
   dislikes: { user_id: number }[];
   replies: CourseForumReply[];
   user: User;
   user_id: number;
   course_id: number;
   section_lesson_id: number;
}

// course_forum_replies.ts
interface CourseForumReply extends TableCommon {
   description: string;
   user: User;
   user_id: number;
   course_forum_id: number;
}

// course_reviews.ts
interface CourseReview extends TableCommon {
   review: string;
   rating: number;
   likes: { user_id: number }[];
   dislikes: { user_id: number }[];
   user: User;
   user_id: number;
   course_id: number;
}

interface CourseTotalReview {
   total_reviews: number;
   rating_distribution: {
      stars: number;
      percentage: number;
   }[];
}

// course_live_classes.ts
interface CourseLiveClass extends TableCommon {
   provider: string;
   class_topic: string;
   class_date_and_time: string;
   class_note?: string;
   additional_info?: any;
   course_id: number;
   instructor_id: number;
   instructor?: Instructor;
   course: Course;
}

// course_progress.ts
interface CourseProgress extends TableCommon {
   total_lessons: number;
   completed_lessons: number;
   progress_percentage: number;
   user_id: number;
   course_id: number;
}

// course_reviews.ts
interface CourseReview extends TableCommon {
   review: string;
   rating: number;
   review_type: string;
   user_id: number;
   course_id: number;
}

// review_like_dislikes.ts
interface ReviewLikeDislike extends TableCommon {
   reply: string;
   liked: boolean;
   disliked: boolean;
   user_id: number;
   course_review_id: number;
}

// course_coupons.ts
interface CourseCoupon extends TableCommon {
   code: string;
   discount_type: 'percentage' | 'fixed';
   discount: number;
   valid_from?: string;
   valid_to?: string;
   usage_type: 'limited' | 'unlimited';
   usage_limit?: number;
   used_count: number;
   is_active: boolean;
   course_id: number;
   course: Course;
}

// course_cart.ts
interface CourseCart extends TableCommon {
   course: Course;
   user_id: number;
   course_id: number;
}

// enrollments.ts
interface CourseEnrollment extends TableCommon {
   enrollment_type: string;
   entry_date: string;
   expiry_date?: string;
   user_id: number;
   user: User;
   course_id: number;
   course: Course;
   completion?: CourseCompletion;
   watch_history?: WatchHistory;
   watch_history_id?: number | null;
}

// course_certificates.ts
interface CourseCertificate extends TableCommon {
   identifier: string;
   user_id: number;
   course_id: number;
}

// course_wishlists.ts
interface CourseWishlist extends TableCommon {
   user_id: number;
   course: Course;
   course_id: number;
}

// payment_gateways.ts
interface PaymentGateway extends TableCommon {
   identifier: string;
   currency: string;
   title: string;
   description?: string;
   keys: any; // Use a more specific type if possible
   model_name: string;
   test_model: boolean;
   status: boolean;
   is_addon: boolean;
}

// payment_histories.ts
interface PaymentHistory extends TableCommon {
   payment_type?: string;
   amount?: number;
   admin_revenue?: number;
   instructor_revenue?: number;
   tax?: number;
   coupon?: string;
   invoice?: string;
   transaction_id?: string;
   session_id?: string;
   user_id: number;
   purchase_type?: string;
   purchase_id?: number;
   meta?: Record<string, unknown>;
}

interface VideoDetails {
   provider: string;
   video_id: string;
   title: string;
   thumbnail: string;
   video: string;
   embed_video: string;
   duration: string;
}

// watch_histories.ts
interface WatchHistory extends TableCommon {
   prev_watching_id: string | null;
   prev_watching_type: 'lesson' | 'quiz' | null;
   current_section_id: string;
   current_watching_id: string;
   current_watching_type: 'lesson' | 'quiz';
   next_watching_id: string | null;
   next_watching_type: 'lesson' | 'quiz' | null;
   completed_watching?: any[];
   completion_date: string;
   user_id: number;
   course_id: number;
}

// course_completion.ts
interface CourseCompletion {
   total_items: number;
   completed_items: number;
   completion: number;
}

// forums.ts
interface Forum extends TableCommon {
   user_id?: number;
   course_id?: number;
   parent_id: number;
   title?: string;
   description?: string;
   likes?: any[]; // JSON field for likes
   dislikes?: any[]; // JSON field for dislikes
}

// Add new interface for course requirements
interface CourseRequirement extends TableCommon {
   course_id: number;
   requirement: string | null;
   sort: number;
}

// Add new interface for course outcomes
interface CourseOutcome extends TableCommon {
   course_id: number;
   outcome: string | null;
   sort: number;
}

// Add new interface for course FAQs
interface CourseFaq extends TableCommon {
   course_id: number;
   question: string | null;
   answer: string | null;
   sort: number;
}

// Add new interface for course approval validation
interface CourseApprovalValidation {
   approve_able: boolean;
   counts: {
      sections_count: number;
      lessons_count: number;
      quizzes_count: number;
      total_content_count: number;
   };
   has_requirements: {
      thumbnail: boolean;
      min_sections: boolean;
      min_lessons: boolean;
      min_content: boolean;
      outcomes: boolean;
      requirements: boolean;
   };
   validation_messages: string[];
}

interface CompletedContent {
   id: number | string;
   type: string;
}
