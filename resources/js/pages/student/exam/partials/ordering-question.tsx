import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface Props {
   question: ExamQuestion;
   answer: any;
   onAnswerChange: (answer: any) => void;
}

interface OrderingItem {
   id: number;
   text: string;
}

const OrderingQuestion = ({ question, answer, onAnswerChange }: Props) => {
   const rawItems = question.options?.items || [];

   const items = useMemo<OrderingItem[]>(() => {
      return rawItems.map((item: any, index: number) => {
         if (typeof item === 'string') {
            return { id: index, text: item };
         }

         if (item && typeof item === 'object') {
            const text = typeof item.text === 'string' ? item.text : typeof item.label === 'string' ? item.label : '';
            return { id: index, text };
         }

         return { id: index, text: '' };
      });
   }, [rawItems]);

   const defaultOrderedItems = useMemo<OrderingItem[]>(() => {
      const buildFromOrder = (order: number[] | undefined) => {
         if (!order || order.length !== items.length) {
            return null;
         }

         const uniqueCount = new Set(order).size;
         if (uniqueCount !== items.length) {
            return null;
         }

         const mapped = order.map((id) => items.find((item) => item.id === Number(id))).filter((item): item is OrderingItem => Boolean(item));

         return mapped.length === items.length ? mapped : null;
      };

      const fromAnswer = buildFromOrder(answer?.order as number[] | undefined);
      if (fromAnswer) {
         return fromAnswer;
      }

      const fromCorrectOrder = buildFromOrder(question.options?.correct_order as number[] | undefined);
      if (fromCorrectOrder) {
         return fromCorrectOrder;
      }

      return [...items].sort(() => Math.random() - 0.5);
   }, [answer?.order, question.options?.correct_order, items]);

   const [orderedItems, setOrderedItems] = useState<OrderingItem[]>(defaultOrderedItems);

   useEffect(() => {
      setOrderedItems(defaultOrderedItems);
   }, [defaultOrderedItems]);

   const updateAnswer = (newItems: OrderingItem[]) => {
      setOrderedItems(newItems);
      onAnswerChange({
         order: newItems.map((item) => item.id),
      });
   };

   const moveItem = (index: number, direction: 'up' | 'down') => {
      if ((direction === 'up' && index === 0) || (direction === 'down' && index === orderedItems.length - 1)) {
         return;
      }

      const newItems = [...orderedItems];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
      updateAnswer(newItems);
   };

   const shuffleItems = () => {
      const shuffled = [...orderedItems].sort(() => Math.random() - 0.5);
      updateAnswer(shuffled);
   };

   return (
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Arrange the following items in the correct order:</p>
            <Button variant="ghost" size="sm" onClick={shuffleItems}>
               Shuffle
            </Button>
         </div>

         <div className="space-y-2">
            {orderedItems.map((item, index) => (
               <Card key={item.id} className="p-4">
                  <div className="flex items-center gap-3">
                     <div className="flex items-center gap-2">
                        <GripVertical className="h-5 w-5 text-gray-400" />
                        <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white">
                           {index + 1}
                        </div>
                     </div>

                     <div className="flex-1">
                        <p className="font-medium">{item.text}</p>
                     </div>

                     <div className="flex gap-1">
                        <Button variant="outline" size="sm" onClick={() => moveItem(index, 'up')} disabled={index === 0}>
                           <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => moveItem(index, 'down')} disabled={index === orderedItems.length - 1}>
                           <ArrowDown className="h-4 w-4" />
                        </Button>
                     </div>
                  </div>
               </Card>
            ))}
         </div>

         <p className="text-sm text-gray-600">
            <span className="font-semibold">Tip:</span> Use the arrow buttons to move items up or down.
         </p>
      </div>
   );
};

export default OrderingQuestion;
