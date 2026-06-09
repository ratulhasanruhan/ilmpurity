import Categories from './categories';
import Courses from './courses';
import Instructors from './instructors';

interface Props {
   contents: Pagination<Course | CourseCategory | Instructor>;
   section_slug: string;
   selectedIds?: number[];
   onSelectChange?: (id: number) => void;
}

const Contents = ({ contents, section_slug, selectedIds = [], onSelectChange }: Props) => {
   // Render different form elements based on field type

   const renderField = () => {
      switch (section_slug) {
         case 'hero':
         case 'top_course':
         case 'top_courses':
         case 'new_courses':
            return <Courses courses={contents as Pagination<Course>} selectedIds={selectedIds} onCourseSelect={onSelectChange} />;
         case 'top_categories':
         case 'category_courses':
            return <Categories categories={contents as Pagination<CourseCategory>} selectedIds={selectedIds} onCourseSelect={onSelectChange} />;

         case 'top_instructors':
            return <Instructors instructors={contents as Pagination<Instructor>} selectedIds={selectedIds} onCourseSelect={onSelectChange} />;

         case 'blogs':
            return <h1>Blogs</h1>;

         default:
            return null;
      }
   };

   return <div className="rounded-md border">{renderField()}</div>;
};

export default Contents;
