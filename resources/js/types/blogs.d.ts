interface BlogCategory extends TableCommon {
   name: string;
   slug: string;
   icon: string;
   sort: number;
   status: string;
   description: string | null;
   blogs_count?: number;
   published_blogs_count?: number;
}

interface Blog extends TableCommon {
   title: string;
   slug: string;
   description: string;
   keywords: string | null;
   status: string;
   banner: string | null;
   thumbnail: string | null;
   user: User;
   category: BlogCategory;
   comments: BlogComment[];
   reading_time: string;
   likes_count?: number;
   dislikes_count?: number;
   user_id: number | string;
   blog_category_id: number | string;
}

interface BlogComment extends TableCommon {
   content: string;
   user: User;
   blog: Blog;
   parent?: BlogComment;
   user_id: number | string;
   blog_id: number | string;
   parent_id?: number | string | null;
   replies?: BlogComment[];
}
