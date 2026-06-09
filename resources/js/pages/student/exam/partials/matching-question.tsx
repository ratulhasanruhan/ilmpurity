import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useMemo, useState } from 'react';

interface Props {
   question: ExamQuestion;
   answer: any;
   onAnswerChange: (answer: any) => void;
}

const MatchingQuestion = ({ question, answer, onAnswerChange }: Props) => {
   const matches = question.options?.matches || [];

   const buildInitialMatches = () => {
      if (Array.isArray(answer?.matches)) {
         const arrayMatches = answer.matches as Array<{ id: number; answer: string }>;
         return arrayMatches.reduce<Record<number, string>>((acc, item) => {
            acc[item.id] = item.answer;
            return acc;
         }, {});
      }
      if (answer?.matches && typeof answer.matches === 'object') {
         return { ...(answer.matches as Record<number, string>) };
      }
      return {};
   };

   const [selectedMatches, setSelectedMatches] = useState<Record<number, string>>(buildInitialMatches);

   useEffect(() => {
      setSelectedMatches(buildInitialMatches());
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [question.id]);

   const emitChange = (newMatches: Record<number, string>) => {
      setSelectedMatches(newMatches);
      const formatted = Object.entries(newMatches).map(([id, value]) => ({
         id: Number(id),
         answer: value,
      }));
      onAnswerChange({
         matches: formatted,
      });
   };

   const handleMatch = (leftId: number, answerValue: string) => {
      emitChange({
         ...selectedMatches,
         [leftId]: answerValue,
      });
   };

   const handleClearAll = () => {
      emitChange({});
   };

   const leftItems = useMemo(() => matches.map((pair: any) => ({ id: pair.id, text: pair.question })), [matches]);
   const rightItems = useMemo(() => matches.map((pair: any) => ({ id: pair.id, text: pair.answer })), [matches]);

   const shuffledRightItems = useMemo(() => [...rightItems].sort(() => Math.random() - 0.5), [rightItems]);

   return (
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Match each item on the left with the correct item on the right:</p>
            <Button variant="ghost" size="sm" onClick={handleClearAll} disabled={Object.keys(selectedMatches).length === 0}>
               Clear All
            </Button>
         </div>

         <div className="space-y-3">
            {leftItems.map((leftItem) => (
               <div key={leftItem.id} className="grid grid-cols-1 gap-3 rounded-lg border p-4 md:grid-cols-2">
                  <div className="flex items-center">
                     <div className="flex-1">
                        <Label className="font-normal">{leftItem.text}</Label>
                     </div>
                  </div>

                  <div>
                     <Select value={selectedMatches[leftItem.id] || ''} onValueChange={(value) => handleMatch(leftItem.id, value)}>
                        <SelectTrigger>
                           <SelectValue placeholder="Select a match..." />
                        </SelectTrigger>
                        <SelectContent>
                           {shuffledRightItems.map((rightItem) => (
                              <SelectItem key={rightItem.id} value={rightItem.text}>
                                 {rightItem.text}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
               </div>
            ))}
         </div>

         {Object.keys(selectedMatches).length > 0 && (
            <p className="text-sm text-gray-600">
               Matched: <span className="font-semibold">{Object.keys(selectedMatches).length}</span> of {leftItems.length}
            </p>
         )}
      </div>
   );
};

export default MatchingQuestion;
