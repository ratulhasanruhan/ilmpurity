import QuestionTypeBadge from '@/components/exam/question-type-badge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import FillBlankQuestion from './fill-blank-question';
import ListeningQuestion from './listening-question';
import MatchingQuestion from './matching-question';
import McqQuestion from './mcq-question';
import MultipleSelectQuestion from './multiple-select-question';
import OrderingQuestion from './ordering-question';
import ShortAnswerQuestion from './short-answer-question';

interface Props {
   question: ExamQuestion;
   questionNumber: number;
   answer: any;
   onAnswerChange: (answer: any) => void;
}

const QuestionRenderer = ({ question, questionNumber, answer, onAnswerChange }: Props) => {
   const renderQuestionInput = () => {
      switch (question.question_type) {
         case 'multiple_choice':
            return <McqQuestion question={question} answer={answer} onAnswerChange={onAnswerChange} />;
         case 'multiple_select':
            return <MultipleSelectQuestion question={question} answer={answer} onAnswerChange={onAnswerChange} />;
         case 'matching':
            return <MatchingQuestion question={question} answer={answer} onAnswerChange={onAnswerChange} />;
         case 'fill_blank':
            return <FillBlankQuestion question={question} answer={answer} onAnswerChange={onAnswerChange} />;
         case 'ordering':
            return <OrderingQuestion question={question} answer={answer} onAnswerChange={onAnswerChange} />;
         case 'short_answer':
            return <ShortAnswerQuestion question={question} answer={answer} onAnswerChange={onAnswerChange} />;
         case 'listening':
            return <ListeningQuestion question={question} answer={answer} onAnswerChange={onAnswerChange} />;
         default:
            return (
               <div className="rounded-lg bg-yellow-50 p-4 text-center">
                  <p className="text-sm text-yellow-800">Question type "{question.question_type}" is not yet implemented in the interface.</p>
               </div>
            );
      }
   };

   return (
      <Card>
         <CardHeader>
            <div className="flex items-start justify-between">
               <div className="flex-1">
                  <div className="mb-3 flex items-center gap-2">
                     <Badge variant="outline">Question {questionNumber}</Badge>
                     <QuestionTypeBadge type={question.question_type} />
                     <Badge variant="secondary">{question.marks} marks</Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{question.title}</h3>
                  {question.description && (
                     <div className="prose prose-sm mt-2 max-w-none" dangerouslySetInnerHTML={{ __html: question.description }} />
                  )}
               </div>
            </div>
         </CardHeader>
         <CardContent>{renderQuestionInput()}</CardContent>
      </Card>
   );
};

export default QuestionRenderer;
