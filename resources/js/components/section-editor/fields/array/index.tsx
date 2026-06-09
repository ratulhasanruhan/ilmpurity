import IconPickerDialog from '@/components/icon-picker-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLang } from '@/hooks/use-lang';
import { isEmptyArrayItem } from '@/lib/page';
import { cn } from '@/lib/utils';
import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ArrayFieldsProps {
   field: PropertyField;
   onChange: (value: any) => void;
}

const ArrayFields: React.FC<ArrayFieldsProps> = ({ field, onChange }) => {
   const { button } = useLang();
   const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>({});
   const [arrayItems, setArrayItems] = useState<any[]>(Array.isArray(field.value) ? field.value : []);

   // Update local state when field.value changes from parent
   useEffect(() => {
      if (Array.isArray(field.value)) {
         setArrayItems(field.value);
      }
   }, [field.value, field.type]);

   const handleArrayFileChange = (index: number, key: string, file: File | null) => {
      // Update the new_image property instead of the original field
      handleArrayItemChange(index, 'new_image', file);

      // Create preview URL for image files
      const previewKey = `${index}-${key}`;

      if (file && file.type.startsWith('image/')) {
         // Clean up previous preview URL to prevent memory leaks
         if (imagePreviews[previewKey]) {
            URL.revokeObjectURL(imagePreviews[previewKey]);
         }

         const previewUrl = URL.createObjectURL(file);
         setImagePreviews((prev) => ({
            ...prev,
            [previewKey]: previewUrl,
         }));
      } else {
         // Remove preview if no file or not an image
         setImagePreviews((prev) => {
            const updated = { ...prev };
            if (updated[previewKey]) {
               URL.revokeObjectURL(updated[previewKey]);
               delete updated[previewKey];
            }
            return updated;
         });

         // Also clear the new_image if removing an existing image
         if (file === null) {
            handleArrayItemChange(index, 'new_image', null);
         }
      }
   };

   const handleArrayItemChange = (index: number, key: string, value: any) => {
      const updatedItems = [...arrayItems];

      if (!updatedItems[index]) {
         updatedItems[index] = {};
      }

      updatedItems[index][key] = value;
      setArrayItems(updatedItems);
      onChange(updatedItems);
   };

   const addArrayItem = () => {
      // Create an empty object with all fields initialized
      const emptyItem = field.fields?.reduce<Record<string, any>>((acc: Record<string, any>, fieldDef: PropertyField) => {
         acc[fieldDef.name] = fieldDef.value;
         return acc;
      }, {});

      const newItems = [...arrayItems, emptyItem];
      setArrayItems(newItems);
      onChange(newItems);
   };

   const removeArrayItem = (index: number) => {
      const newItems = arrayItems.filter((_, i) => i !== index);
      setArrayItems(newItems);
      onChange(newItems);
   };

   return (
      <div>
         <div className="space-y-4">
            {arrayItems.map((item: any, index: number) => {
               const isFirstItemEmpty = index === 0 && isEmptyArrayItem(item);

               return (
                  <Card key={index} className={cn('relative', isFirstItemEmpty && 'hidden')}>
                     <CardContent className="p-4 pt-6">
                        <Button
                           size="icon"
                           type="button"
                           variant="ghost"
                           onClick={() => removeArrayItem(index)}
                           className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                        >
                           <X className="h-5 w-5" />
                        </Button>
                        {field.fields?.map((subField, fieldIdx) => {
                           // Get existing image URL for preview (only for file fields)
                           const prevImage = subField.type === 'file' ? item.image : null;

                           return (
                              <div key={fieldIdx} className="mb-4">
                                 <Label htmlFor={`${field.name}-${index}-${subField.name}`} className="mb-2 block">
                                    {subField.label}
                                 </Label>
                                 <div className="mt-1">
                                    {subField.type === 'textarea' ? (
                                       <Textarea
                                          id={`${field.name}-${index}-${subField.name}`}
                                          value={item[subField.name] || ''}
                                          onChange={(e) => handleArrayItemChange(index, subField.name, e.target.value)}
                                          rows={3}
                                       />
                                    ) : subField.type === 'file' ? (
                                       <div className="space-y-3">
                                          <Input
                                             type="file"
                                             id={`${field.name}-${index}-${subField.name}`}
                                             accept="image/*"
                                             onChange={(e) => handleArrayFileChange(index, subField.name, e.target.files?.[0] || null)}
                                             className="cursor-pointer"
                                          />
                                          {(imagePreviews[`${index}-${subField.name}`] || prevImage) && (
                                             <div className="relative inline-block">
                                                <img
                                                   alt="Preview"
                                                   src={imagePreviews[`${index}-${subField.name}`] || prevImage}
                                                   className="h-20 w-auto rounded-lg border object-cover shadow-sm"
                                                />
                                             </div>
                                          )}
                                       </div>
                                    ) : subField.type === 'icon' ? (
                                       <IconPickerDialog
                                          name={subField.name}
                                          value={item[subField.name] || ''}
                                          placeholder="Pick your category icon"
                                          onSelect={(icon) => handleArrayItemChange(index, subField.name, icon)}
                                       />
                                    ) : (
                                       <Input
                                          type={subField.type === 'number' ? 'number' : 'text'}
                                          id={`${field.name}-${index}-${subField.name}`}
                                          value={item[subField.name] || ''}
                                          onChange={(e) => handleArrayItemChange(index, subField.name, e.target.value)}
                                       />
                                    )}
                                 </div>
                              </div>
                           );
                        })}
                     </CardContent>
                  </Card>
               );
            })}
         </div>

         <div className="mt-4">
            <Button type="button" onClick={addArrayItem} variant="outline" size="sm" className="flex items-center">
               <Plus className="mr-1 h-4 w-4" />
               {button.add_item}
            </Button>
         </div>
      </div>
   );
};

export default ArrayFields;
