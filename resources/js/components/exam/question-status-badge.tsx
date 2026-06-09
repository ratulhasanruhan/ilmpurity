import { Badge } from '../ui/badge';

const QuestionStatusBadge = ({ answer }: { answer: ExamAttemptAnswer }) => {
   const safeQuestion = (answer: ExamAttemptAnswer) => answer.exam_question ?? ({} as ExamQuestion);

   const question = safeQuestion(answer);
   const marksObtained = answer.marks_obtained || 0;
   const totalMarks = question.marks || 0;

   // Check if marks indicate correctness (full marks obtained)
   const isFullMarks = totalMarks > 0 && marksObtained === totalMarks;

   if (answer.is_correct === null) return <Badge variant="secondary">Pending Review</Badge>;
   if (answer.is_correct || isFullMarks)
      return (
         <Badge variant="default" className="bg-green-600">
            Correct
         </Badge>
      );
   return <Badge variant="destructive">Incorrect</Badge>;
};

export default QuestionStatusBadge;
