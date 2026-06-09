import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React, { useEffect, useState } from 'react';
import { useSectionEditor } from '../context';
import ArrayFields from './array';
import Contents from './contents';

interface FieldsProps {
   field: PropertyField;
   onChange: (value: any) => void;
}

const Fields = ({ field, onChange }: FieldsProps) => {
   const { section } = useSectionEditor();

   // Local state for basic field types to handle immediate UI updates
   const [localValue, setLocalValue] = useState<any>(field.value || '');

   // Update local state when field.value changes from parent
   useEffect(() => {
      setLocalValue(field.value || '');
   }, [field.value, field.type]);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { value, type } = e.target as HTMLInputElement;

      if (type === 'checkbox') {
         const checked = (e.target as HTMLInputElement).checked;
         setLocalValue(checked);
         onChange(checked);
         return;
      }

      // Update local state immediately for better UX
      setLocalValue(value);

      // Notify parent component
      onChange(value);
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setLocalValue(file);
      onChange(file);
   };

   // Render different form elements based on field type
   const renderField = () => {
      switch (field.type) {
         case 'contents':
            return <Contents field={field} section_slug={section.slug} onChange={onChange} />;

         case 'text':
         case 'url':
            return <Input type="text" id={field.name} name={field.name} value={localValue} onChange={handleInputChange} />;

         case 'textarea':
            return <Textarea id={field.name} name={field.name} rows={3} value={localValue} onChange={handleInputChange} />;

         case 'number':
            return <Input type="number" id={field.name} name={field.name} value={localValue} onChange={handleInputChange} />;

         case 'image':
         case 'file':
            return <Input type="file" id={field.name} name={field.name} onChange={handleFileChange} />;

         case 'boolean':
            return (
               <Input
                  type="checkbox"
                  id={field.name}
                  name={field.name}
                  checked={localValue || false}
                  onChange={handleInputChange}
                  className="h-4 w-4"
               />
            );

         case 'array':
            return <ArrayFields field={field} onChange={onChange} />;

         case 'object':
            return (
               <Card>
                  <CardContent className="p-4">
                     {field.fields?.map((subField, index) => (
                        <div key={index} className="mb-4">
                           <Label htmlFor={`${field.name}-${subField.name}`} className="mb-2 block">
                              {subField.label}
                           </Label>
                           <div className="mt-1">
                              <Fields
                                 field={{
                                    ...subField,
                                    name: `${field.name}-${subField.name}`,
                                    value: field.value && field.value[subField.name] !== undefined ? field.value[subField.name] : subField.value,
                                 }}
                                 onChange={(value) => {
                                    const newValue = { ...(field.value || {}), [subField.name]: value };
                                    onChange(newValue);
                                 }}
                              />
                           </div>
                        </div>
                     ))}
                  </CardContent>
               </Card>
            );

         default:
            return null;
      }
   };

   return (
      <div className="mb-4">
         {field.type !== 'boolean' && field.type !== 'contents' && (
            <Label htmlFor={field.name} className="mb-2 block">
               {field.label}
            </Label>
         )}

         {renderField()}

         {field.type === 'boolean' && (
            <Label htmlFor={field.name} className="ml-2 inline-block">
               {field.label}
            </Label>
         )}
      </div>
   );
};

export default Fields;
