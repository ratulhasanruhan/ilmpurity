import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Circle, Flag } from 'lucide-react';

interface Props {
   questions: ExamQuestion[];
   currentQuestionIndex: number;
   answeredQuestions: Set<number>;
   markedQuestions: Set<number>;
   onNavigate: (index: number) => void;
}

const QuestionNavigator = ({ questions, currentQuestionIndex, answeredQuestions, markedQuestions, onNavigate }: Props) => {
   const getQuestionStatus = (questionId: number) => {
      if (answeredQuestions.has(questionId)) return 'answered';
      if (markedQuestions.has(questionId)) return 'marked';
      return 'unanswered';
   };

   const getStatusIcon = (questionId: number) => {
      const status = getQuestionStatus(questionId);
      if (status === 'answered') return <Check className="h-3 w-3" />;
      if (status === 'marked') return <Flag className="h-3 w-3" />;
      return <Circle className="h-3 w-3" />;
   };

   const getButtonVariant = (index: number, questionId: number) => {
      if (index === currentQuestionIndex) return 'default';
      const status = getQuestionStatus(questionId);
      if (status === 'answered') return 'secondary';
      if (status === 'marked') return 'outline';
      return 'ghost';
   };

   return (
      <Card>
         <CardHeader className="pb-3">
            <CardTitle className="text-base">Question Navigator</CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
            {/* Status Legend */}
            <div className="space-y-2 text-sm">
               <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="h-6 w-6 p-0">
                     <Check className="h-3 w-3" />
                  </Badge>
                  <span className="text-gray-600">Answered ({answeredQuestions.size})</span>
               </div>
               <div className="flex items-center gap-2">
                  <Badge variant="outline" className="h-6 w-6 p-0">
                     <Flag className="h-3 w-3" />
                  </Badge>
                  <span className="text-gray-600">Marked ({markedQuestions.size})</span>
               </div>
               <div className="flex items-center gap-2">
                  <Badge variant="ghost" className="h-6 w-6 p-0">
                     <Circle className="h-3 w-3" />
                  </Badge>
                  <span className="text-gray-600">Not Answered ({questions.length - answeredQuestions.size})</span>
               </div>
            </div>

            {/* Question Grid */}
            <div className="grid grid-cols-5 gap-2">
               {questions.map((question, index) => (
                  <Button
                     key={question.id}
                     variant={getButtonVariant(index, question.id)}
                     size="sm"
                     onClick={() => onNavigate(index)}
                     className="relative h-10 w-full"
                  >
                     <span className="text-sm">{index + 1}</span>
                     <span className="absolute right-1 top-1">{getStatusIcon(question.id)}</span>
                  </Button>
               ))}
            </div>

            {/* Summary */}
            <div className="rounded-lg bg-gray-50 p-3">
               <p className="text-sm font-semibold text-gray-700">Progress Summary</p>
               <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>
                     Total Questions: <span className="font-semibold">{questions.length}</span>
                  </p>
                  <p>
                     Answered: <span className="font-semibold text-green-600">{answeredQuestions.size}</span>
                  </p>
                  <p>
                     Remaining: <span className="font-semibold text-orange-600">{questions.length - answeredQuestions.size}</span>
                  </p>
               </div>
            </div>
         </CardContent>
      </Card>
   );
};

export default QuestionNavigator;

