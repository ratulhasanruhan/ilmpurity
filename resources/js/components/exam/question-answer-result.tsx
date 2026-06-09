import { Check, X } from 'lucide-react';

interface AttemptAnswerWithQuestion extends ExamAttemptAnswer {
   exam_question: ExamQuestion;
}

const QuestionAnswerResult = ({ question, answer }: { question: ExamQuestion; answer: AttemptAnswerWithQuestion }) => {
   const answerData = answer.answer_data;

   if (!answerData) {
      return <p className="text-gray-500 italic">No answer provided</p>;
   }

   switch (question.question_type) {
      case 'multiple_choice': {
         const selectedId = typeof answerData === 'object' ? (answerData as any).selected_option_id : answerData;
         const options = question.question_options || [];

         return (
            <div className="space-y-3">
               <p className="font-semibold text-gray-700">Select the option that best matches:</p>
               <div className="space-y-2">
                  {options.map((option: any, idx: number) => {
                     const isSelected = option.id === selectedId;
                     const isCorrect = option.is_correct;

                     return (
                        <div
                           key={option.id || idx}
                           className={`rounded-lg border-2 p-3 ${
                              isSelected && isCorrect
                                 ? 'border-green-500 bg-green-50'
                                 : isSelected && !isCorrect
                                   ? 'border-red-500 bg-red-50'
                                   : isCorrect
                                     ? 'border-green-300 bg-green-50'
                                     : 'border-gray-200 bg-white'
                           }`}
                        >
                           <div className="flex items-start gap-2">
                              <div className="mt-0.5 flex-shrink-0">
                                 {isSelected ? (
                                    isCorrect ? (
                                       <Check className="h-5 w-5 text-green-600" />
                                    ) : (
                                       <X className="h-5 w-5 text-red-600" />
                                    )
                                 ) : isCorrect ? (
                                    <Check className="h-5 w-5 text-green-600" />
                                 ) : (
                                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                                 )}
                              </div>
                              <div className="flex-1">
                                 <p className="text-sm">{option.option_text}</p>
                                 {isSelected && <span className="text-xs font-semibold text-blue-600">Selected Answer </span>}
                                 {isCorrect && !isSelected && <span className="text-xs font-semibold text-green-600">(Correct Answer)</span>}
                              </div>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         );
      }

      case 'multiple_select': {
         const selectedIds = Array.isArray(answerData) ? answerData : (answerData as any).selected_option_ids || [];
         const options = question.question_options || [];

         return (
            <div className="space-y-3">
               <p className="font-semibold text-gray-700">Select all statements that apply:</p>
               <div className="space-y-2">
                  {options.map((option: any, idx: number) => {
                     const isSelected = selectedIds.includes(option.id);
                     const isCorrect = option.is_correct;

                     return (
                        <div
                           key={option.id || idx}
                           className={`rounded-lg border-2 p-3 ${
                              isSelected && isCorrect
                                 ? 'border-green-500 bg-green-50'
                                 : isSelected && !isCorrect
                                   ? 'border-red-500 bg-red-50'
                                   : 'border-gray-200 bg-white'
                           }`}
                        >
                           <div className="flex items-start gap-2">
                              <div className="mt-0.5 flex-shrink-0">
                                 {isSelected ? (
                                    isCorrect ? (
                                       <Check className="h-5 w-5 text-green-600" />
                                    ) : (
                                       <X className="h-5 w-5 text-red-600" />
                                    )
                                 ) : isCorrect ? (
                                    <Check className="h-5 w-5 text-green-600" />
                                 ) : (
                                    <div className="h-5 w-5 rounded border-2 border-gray-300" />
                                 )}
                              </div>
                              <div className="flex-1">
                                 <p className="text-sm">{option.option_text}</p>
                                 {isSelected && isCorrect && (
                                    <span className="text-xs font-semibold text-green-600">(Selected Answer - Correct)</span>
                                 )}
                                 {isSelected && !isCorrect && <span className="text-xs font-semibold text-red-600">(Selected Answer - Wrong)</span>}
                                 {isCorrect && !isSelected && (
                                    <span className="text-xs font-semibold text-green-600">(Correct Answer - Not Selected)</span>
                                 )}
                              </div>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         );
      }

      case 'fill_blank': {
         const userAnswers = Array.isArray(answerData) ? answerData : (answerData as any).answers || [];
         const correctAnswers = question.options?.answers || [];

         return (
            <div className="space-y-3">
               <p className="font-semibold text-gray-700">Fill in the blanks:</p>
               <div className="space-y-3">
                  {userAnswers.map((userAns: string, idx: number) => {
                     const correctOptions = correctAnswers;
                     const isCorrect = correctOptions.some((ans: string) => ans?.toLowerCase().trim() === userAns?.toLowerCase().trim());

                     return (
                        <div key={idx} className="rounded-lg border p-3">
                           <div className="mb-2 flex items-start gap-2">
                              {isCorrect ? (
                                 <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                              ) : (
                                 <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                              )}
                              <div className="flex-1">
                                 <p className="text-sm font-semibold text-gray-700">Blank {idx + 1}</p>
                              </div>
                           </div>
                           <div className="ml-7 space-y-1">
                              <p className="text-sm">
                                 <span className="font-medium">Student Answer:</span>{' '}
                                 <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>{userAns || '(empty)'}</span>
                              </p>
                              {correctAnswers.length > 0 && (
                                 <p className="text-sm">
                                    <span className="font-medium">Correct Answer{correctAnswers.length > 1 ? 's' : ''}:</span>{' '}
                                    <span className="text-green-600">{correctAnswers.join(', ')}</span>
                                 </p>
                              )}
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         );
      }

      case 'ordering': {
         const userOrder = Array.isArray(answerData) ? answerData : (answerData as any).order || [];
         const items = question.options?.items || [];
         const correctOrder = question.options?.correct_order || [];

         return (
            <div className="space-y-3">
               <p className="font-semibold text-gray-700">Arrange in the correct order:</p>
               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                     <p className="mb-2 text-sm font-semibold text-gray-600">Your Order:</p>
                     <div className="space-y-2">
                        {userOrder.map((itemIndex: number, idx: number) => (
                           <div key={idx} className="flex items-center gap-2 rounded border border-blue-200 bg-blue-50 p-2">
                              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                                 {idx + 1}
                              </span>
                              <span className="text-sm">{items[itemIndex] || `Item ${itemIndex}`}</span>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div>
                     <p className="mb-2 text-sm font-semibold text-gray-600">Correct Order:</p>
                     <div className="space-y-2">
                        {correctOrder.map((itemIndex: number, idx: number) => (
                           <div key={idx} className="flex items-center gap-2 rounded border border-green-200 bg-green-50 p-2">
                              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-semibold text-white">
                                 {idx + 1}
                              </span>
                              <span className="text-sm">{items[itemIndex] || `Item ${itemIndex}`}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         );
      }

      case 'matching': {
         const userMatches = (answerData as any).matches || [];
         const correctMatches = question.options?.matches || [];

         return (
            <div className="space-y-3">
               <p className="font-semibold text-gray-700">Match each item with its pair:</p>
               <div className="space-y-3">
                  {userMatches.map((match: any, idx: number) => {
                     // Find the correct match definition
                     const correctMatch = correctMatches.find((cm: any) => cm.id === match.id);
                     const isCorrect = correctMatch && correctMatch.answer === match.answer;

                     return (
                        <div
                           key={idx}
                           className={`rounded-lg border-2 p-3 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}
                        >
                           <div className="flex items-center gap-3">
                              {isCorrect ? (
                                 <Check className="h-5 w-5 flex-shrink-0 text-green-600" />
                              ) : (
                                 <X className="h-5 w-5 flex-shrink-0 text-red-600" />
                              )}
                              <div className="grid flex-1 grid-cols-1 gap-2 md:grid-cols-2">
                                 <div className="text-sm font-medium">{correctMatch?.question || 'Unknown'}</div>
                                 <div className="text-sm">→ {match.answer || 'Unknown'}</div>
                              </div>
                           </div>
                           {!isCorrect && correctMatch && (
                              <div className="mt-2 ml-8 text-xs text-green-600">
                                 Correct: {correctMatch.question} → {correctMatch.answer}
                              </div>
                           )}
                        </div>
                     );
                  })}
               </div>
            </div>
         );
      }

      case 'short_answer':
      case 'listening': {
         const userAnswer = typeof answerData === 'string' ? answerData : (answerData as any).answer_text || JSON.stringify(answerData);

         return (
            <div className="space-y-3">
               <p className="font-semibold text-gray-700">Student's Answer:</p>
               <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-4">
                  <p className="text-sm whitespace-pre-wrap">{userAnswer}</p>
               </div>
            </div>
         );
      }

      default:
         return (
            <div className="rounded bg-gray-100 p-3">
               <p className="text-sm text-gray-600">Answer data:</p>
               <pre className="mt-2 overflow-auto text-xs">{JSON.stringify(answerData, null, 2)}</pre>
            </div>
         );
   }
};

export default QuestionAnswerResult;
