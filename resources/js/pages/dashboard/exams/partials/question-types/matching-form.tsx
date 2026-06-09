import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

interface Props {
   data: any;
   setData: (key: string, value: any) => void;
   errors: any;
}

interface MatchPair {
   id: number;
   question: string;
   answer: string;
}

const MatchingForm = ({ data, setData, errors }: Props) => {
   const matches: MatchPair[] = data.options?.matches || [];

   useEffect(() => {
      if (matches.length === 0) {
         const initialMatches = [
            { id: 1, question: '', answer: '' },
            { id: 2, question: '', answer: '' },
            { id: 3, question: '', answer: '' },
         ];
         setData('options', { matches: initialMatches });
      }
   }, []);

   const addMatch = () => {
      const newMatches = [...matches, { id: Date.now(), question: '', answer: '' }];
      setData('options', { matches: newMatches });
   };

   const removeMatch = (id: number) => {
      const newMatches = matches.filter((m) => m.id !== id);
      setData('options', { matches: newMatches });
   };

   const updateMatch = (id: number, field: 'question' | 'answer', value: string) => {
      const newMatches = matches.map((m) => (m.id === id ? { ...m, [field]: value } : m));
      setData('options', { matches: newMatches });
   };

   return (
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <Label>Matching Pairs *</Label>
            <Button type="button" variant="outline" size="sm" onClick={addMatch}>
               <Plus className="h-4 w-4" />
               Add Pair
            </Button>
         </div>

         <p className="text-sm text-gray-600">Students will match items from the left column with items on the right</p>

         <div className="space-y-3">
            {matches.map((match, index) => (
               <div key={match.id} className="grid grid-cols-2 gap-3 items-start">
                  <div>
                     {index === 0 && <Label className="text-xs text-gray-500 mb-1">Question/Item</Label>}
                     <Input placeholder={`Item ${index + 1}`} value={match.question} onChange={(e) => updateMatch(match.id, 'question', e.target.value)} />
                  </div>
                  <div className="flex gap-2">
                     <div className="flex-1">
                        {index === 0 && <Label className="text-xs text-gray-500 mb-1">Correct Match</Label>}
                        <Input placeholder={`Match ${index + 1}`} value={match.answer} onChange={(e) => updateMatch(match.id, 'answer', e.target.value)} />
                     </div>
                     {matches.length > 2 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeMatch(match.id)} className="text-red-600 mt-5">
                           <Trash2 className="h-4 w-4" />
                        </Button>
                     )}
                  </div>
               </div>
            ))}
         </div>

         <InputError message={errors.options} />
      </div>
   );
};

export default MatchingForm;

