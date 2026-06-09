// Exam Module Type Definitions
interface ExamCategory extends TableCommon {
   title: string;
   slug: string;
   icon: string;
   description?: string;
   sort: number;
   status: boolean;
   thumbnail?: string;
   exams_count?: number;
   category_children?: ExamCategoryChild[];
}

// exam_category_children.ts
interface ExamCategoryChild extends TableCommon {
   title: string;
   slug: string;
   icon: string;
   sort: number;
   status: boolean;
   keywords?: string;
   description?: string;
   exam_category_id: number;
}

interface Exam extends TableCommon {
   title: string;
   slug: string;
   short_description?: string;
   description?: string;
   instructor_id: number;
   exam_category_id: number;
   instructor: Instructor;
   exam_category: ExamCategory;
   pricing_type: 'free' | 'paid';
   price: number;
   discount: number;
   discount_price: number;
   duration_hours: number;
   duration_minutes: number;
   total_duration_minutes: number;
   pass_mark: number;
   total_marks: number;
   max_attempts: number;
   total_questions: number;
   status: 'draft' | 'published' | 'archived';
   level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
   thumbnail?: string;
   banner?: string;
   expiry_type?: 'lifetime' | 'limited';
   expiry_duration?: number;
   meta_title?: string;
   meta_keywords?: string;
   meta_description?: string;
   og_title?: string;
   og_description?: string;
   resources: ExamResource[];
   questions: ExamQuestion[];
   faqs: ExamFaq[];
   requirements: ExamRequirement[];
   outcomes: ExamOutcome[];
   enrollments_count: number;
   reviews_count: number;
   average_rating: number;
}

// lesson_resources.ts
interface ExamResource extends TableCommon {
   title: string;
   type: string;
   resource: string;
   exam_id: number;
   exam: Exam;
}

interface ExamFaq extends TableCommon {
   exam_id: number;
   question: string;
   answer: string;
   sort: number;
}

interface ExamRequirement extends TableCommon {
   exam_id: number;
   requirement: string;
   sort: number;
}

interface ExamOutcome extends TableCommon {
   exam_id: number;
   outcome: string;
   sort: number;
}

type ExamQuestionType = 'multiple_choice' | 'multiple_select' | 'matching' | 'fill_blank' | 'ordering' | 'short_answer' | 'listening';

interface ExamQuestionOption extends TableCommon {
   exam_question_id: number;
   option_text: string;
   is_correct: boolean;
   sort: number;
}

interface ExamQuestion extends TableCommon {
   exam_id: number;
   question_type: ExamQuestionType;
   title: string;
   description?: string;
   marks: number;
   sort: number;
   options?: {
      answers?: string[];
      matches?: Array<{ id: number; question: string; answer: string }>;
      items?: string[];
      correct_order?: number[];
      sample_answer?: string;
      audio_url?: string;
      audio_file?: File;
      audio_source?: 'url' | 'upload';
      instructions?: string;
   };
   question_options?: ExamQuestionOption[];
   media?: Media[];
}

interface ExamEnrollment extends TableCommon {
   user_id: number;
   exam_id: number;
   enrollment_type: 'lifetime' | 'limited';
   entry_date: string;
   expiry_date?: string;
   is_active: boolean;
   user: User;
   exam: Exam;
}

interface ExamAttempt extends TableCommon {
   user_id: number;
   exam_id: number;
   attempt_number: number;
   start_time: string;
   end_time: string;
   duration_minutes?: number;
   total_marks: number;
   obtained_marks: number;
   percentage: number;
   correct_answers: number;
   incorrect_answers: number;
   is_passed: boolean;
   status: 'in_progress' | 'completed' | 'abandoned' | 'submitted';
   user: User;
   exam: Exam;
   attempt_answers: ExamAttemptAnswer[];
}

interface ExamAttemptAnswer extends TableCommon {
   exam_attempt_id: number;
   exam_question_id: number;
   answer_data: {
      selected_option_id?: number;
      selected_option_ids?: number[];
      matches?: Array<{ id: number; answer: string }>;
      answers?: string[];
      order?: number[];
      text?: string;
   };
   is_correct?: boolean;
   marks_obtained: number;
   exam_question: ExamQuestion;
}

interface ExamCart extends TableCommon {
   user_id: number;
   exam_id: number;
   exam?: Exam;
}

interface ExamWishlist extends TableCommon {
   user_id: number;
   exam_id: number;
   exam: Exam;
}

interface ExamReview extends TableCommon {
   user_id: number;
   exam_id: number;
   rating: number;
   review?: string;
   user: User;
   exam: Exam;
}

interface ExamReviewsStatistics {
   total_reviews: number;
   rating_distribution: {
      stars: number;
      percentage: number;
   }[];
}

interface ExamCoupon extends TableCommon {
   code: string;
   discount_type: 'percentage' | 'fixed';
   discount: number;
   valid_from?: string;
   valid_to?: string;
   usage_type: 'limited' | 'unlimited';
   usage_limit?: number;
   used_count: number;
   is_active: boolean;
   exam_id: number;
   exam: Exam;
}

interface ExamStatistics {
   total_enrollments: number;
   total_attempts: number;
   completed_attempts: number;
   average_score: number;
   pass_rate: number;
   total_reviews: number;
   average_rating: number;
}

interface ExamAttemptAnalytics {
   attempt: ExamAttempt;
   by_question_type: {
      [key: string]: {
         total: number;
         correct: number;
         incorrect: number;
         pending: number;
      };
   };
   percentage: number;
   duration_minutes?: number;
   time_per_question?: number;
}

interface ExamEnrollmentStatistics {
   user_id: number;
   user: User;
   exam_id: number;
   exam: Exam;
   enrollment_type: 'lifetime' | 'limited';
   entry_date: string;
   expiry_date?: string;
}

interface EnrollmentProgress {
   enrollment: ExamEnrollment;
   is_active: boolean;
   attempts_used: number;
   attempts_remaining: number;
   completed_attempts: number;
   best_score: number;
   has_passed: boolean;
}
