import { Check, Clock, X } from 'lucide-react';

const QuestionStatusIcon = ({ answer }: { answer: ExamAttemptAnswer }) => {
   const safeQuestion = (answer: ExamAttemptAnswer) => answer.exam_question ?? ({} as ExamQuestion);

   const question = safeQuestion(answer);
   const marksObtained = answer.marks_obtained || 0;
   const totalMarks = question.marks || 0;
   const isFullMarks = totalMarks > 0 && marksObtained === totalMarks;

   if (answer.is_correct === null) return <Clock className="h-5 w-5 text-yellow-600" />;
   if (answer.is_correct || isFullMarks) return <Check className="h-5 w-5 text-green-600" />;
   return <X className="h-5 w-5 text-red-600" />;
};

export default QuestionStatusIcon;
