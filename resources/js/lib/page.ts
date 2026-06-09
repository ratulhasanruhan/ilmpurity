export const getPageSection = (page: Page, slug: string) => {
   return page.sections.find((section: PageSection) => section.slug === slug);
};

const formatLabel = (key: string): string => {
   return key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

/**
 * Generate a field definition based on a value's type
 */
const generateFieldByType = (key: string, value: any): PropertyField => {
   // Handle different value types
   if (typeof value === 'string') {
      // Image or URL fields
      if (key === 'image' || key.includes('image') || key === 'avatar' || (typeof value === 'string' && value.match(/\.(jpeg|jpg|gif|png)$/i))) {
         return {
            type: 'file',
            label: formatLabel(key),
            name: key,
            value: null,
         };
         // Description fields
      } else if (key === 'description' || key.includes('description') || key === 'bio' || key === 'content') {
         return {
            type: 'textarea',
            label: formatLabel(key),
            name: key,
            value: value || '',
         };
         // URL fields
      } else if (key === 'url' || key.includes('_url') || key.includes('link')) {
         return {
            type: 'url',
            label: formatLabel(key),
            name: key,
            value: value || '',
         };
         // Default string field
      } else if (key === 'icon') {
         return {
            type: 'icon',
            label: formatLabel(key),
            name: key,
            value: value || '',
         };
      } else {
         return {
            type: 'text',
            label: formatLabel(key),
            name: key,
            value: value || '',
         };
      }
   } else if (typeof value === 'number') {
      return {
         type: 'number',
         label: formatLabel(key),
         name: key,
         value: value || 0,
      };
   } else if (typeof value === 'boolean') {
      return {
         type: 'boolean',
         label: formatLabel(key),
         name: key,
         value: value || false,
      };
   } else {
      // Default to text field for other types
      return {
         type: 'text',
         label: formatLabel(key),
         name: key,
         value: value?.toString() || '',
      };
   }
};

/**
 * Generate fields based only on properties object without section name dependency
 * @param properties - The section properties object
 * @returns Array of property fields
 */
export const generatePropertyFields = (properties: Record<string, any>): PropertyField[] => {
   // Handle contents property (dynamic content from database)
   if ('contents' in properties) {
      const fields: PropertyField[] = [
         {
            type: 'contents',
            label: 'Contents',
            name: 'contents',
            value: properties.contents || [],
         },
      ];

      // Add other properties to the beginning of fields array
      Object.entries(properties).forEach(([key, value]) => {
         // Skip array property as it's already handled
         if (key === 'array') {
            return;
         }

         // Skip contents property as it's handled separately
         if (key === 'contents') {
            return;
         }

         // Generate field for other properties
         const field = generateFieldByType(key, value);
         fields.unshift(field);
      });

      return fields;
   }

   // Handle array property (static content defined in seeder)
   if ('array' in properties) {
      // const sampleItem =
      //    Array.isArray(properties.array) && properties.array.length > 0
      //       ? isEmptyArrayItem(properties.array[0])
      //          ? properties.array[1]
      //          : properties.array[0]
      //       : {};
      const sampleItem = Array.isArray(properties.array) && properties.array.length > 0 ? properties.array[0] : {};
      let itemFields: PropertyField[] = [];

      // Generate fields based on sample item if available
      if (Object.keys(sampleItem).length > 0) {
         Object.keys(sampleItem).forEach((key) => {
            if (typeof sampleItem[key] === 'string' || typeof sampleItem[key] === 'number' || typeof sampleItem[key] === 'boolean') {
               itemFields.push(generateFieldByType(key, sampleItem[key]));
            }
         });
      } else {
         // Default basic fields if no sample available
         itemFields = [
            { type: 'text' as const, label: 'Title', name: 'title', value: '' },
            { type: 'text' as const, label: 'Value', name: 'value', value: '' },
         ];
      }

      // Return the array field
      const fields: PropertyField[] = [
         {
            type: 'array',
            label: 'Items',
            name: 'array',
            value: (properties.array || []).map((item: Record<string, any>) => {
               // Process each item in the array to set image fields to null
               const processedItem = { ...item };
               // Set image properties to null for file uploads
               Object.keys(processedItem).forEach((key) => {
                  if (key === 'image' || key.includes('image')) {
                     processedItem[`new_image`] = null;
                  }
               });
               return processedItem;
            }),
            fields: itemFields,
         },
      ];

      // Add other properties to the beginning of fields array
      Object.entries(properties).forEach(([key, value]) => {
         // Skip array property as it's already handled
         if (key === 'array') {
            return;
         }

         // Skip contents property as it's handled separately
         if (key === 'contents') {
            return;
         }

         // Generate field for other properties
         const field = generateFieldByType(key, value);
         fields.unshift(field);
      });

      return fields;
   }

   // Process all other properties
   return Object.entries(properties).map(([key, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
         // Handle nested objects
         return {
            type: 'object',
            label: formatLabel(key),
            name: key,
            value: value,
            fields: generatePropertyFields(value),
         } as PropertyField;
      } else {
         // Use the common field generation function for primitive types
         return generateFieldByType(key, value);
      }
   });
};

export const isEmptyArrayItem = (array: Record<string, any>) => {
   let flag = true;

   Object.entries(array).forEach(([key, value]) => {
      switch (typeof value) {
         case 'string':
            if (value.length > 0) {
               flag = false;
            }
            break;
         case 'number':
            if (value > 0) {
               flag = false;
            }
            break;
         default:
            break;
      }
   });

   return flag;
};

export const removeEmptyArrayItems = (array: Record<string, any>[]) => {
   return array.filter((item) => {
      let flag = false;

      Object.entries(item).forEach(([key, value]) => {
         switch (typeof value) {
            case 'string':
               if (value.trim().length > 0) {
                  flag = true;
               }
               break;
            case 'number':
               if (value > 0) {
                  flag = true;
               }
               break;
            case 'boolean':
               if (value) {
                  flag = true;
               }
               break;
            default:
               break;
         }
      });

      return flag;
   });
};

export const getPropertyArray = (section?: PageSection) => {
   const array = section?.properties?.array;

   return array ? removeEmptyArrayItems(array) : [];
};
