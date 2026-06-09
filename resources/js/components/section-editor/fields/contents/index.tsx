import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useSectionEditor } from '../../context';
import Categories from './categories';
import Courses from './courses';
import Instructors from './instructors';

interface Props {
   field: PropertyField;
   section_slug: string;
   selectedIds?: number[];
   onChange?: (value: any) => void;
}

const Contents = ({ field, section_slug, selectedIds = [], onChange }: Props) => {
   const { props } = usePage<IntroPageProps>();
   const { courses, categories, instructors } = props;
   const { section } = useSectionEditor();
   const [contentList, setContentList] = useState<number[]>(section.properties?.contents ? section.properties?.contents : []);

   useEffect(() => {
      if (field.type === 'contents' && Array.isArray(field.value)) {
         setContentList(field.value);
      }
   }, [field.value, field.type]);

   const onSelectChange = (id: number) => {
      let updatedContents: number[];

      // If ID already exists, remove it (deselect)
      if (contentList.includes(id)) {
         updatedContents = contentList.filter((item) => item !== id);
      } else {
         // If ID doesn't exist, add it (select)
         updatedContents = [...contentList, id];
      }

      // Update local state
      setContentList(updatedContents);

      // Update parent component via onChange - pass only the array value
      onChange?.(updatedContents);
   };

   const renderField = () => {
      switch (section_slug) {
         case 'hero':
         case 'top_course':
         case 'top_courses':
         case 'new_courses':
            return <Courses courses={courses as Pagination<Course>} selectedIds={selectedIds} onCourseSelect={onSelectChange} />;
         case 'top_categories':
         case 'category_courses':
            return <Categories categories={categories as Pagination<CourseCategory>} selectedIds={selectedIds} onCourseSelect={onSelectChange} />;

         case 'top_instructors':
            return <Instructors instructors={instructors as Pagination<Instructor>} selectedIds={selectedIds} onCourseSelect={onSelectChange} />;

         case 'blogs':
            return <h1>Blogs</h1>;

         default:
            return null;
      }
   };

   return <div className="rounded-md border">{renderField()}</div>;
};

export default Contents;
