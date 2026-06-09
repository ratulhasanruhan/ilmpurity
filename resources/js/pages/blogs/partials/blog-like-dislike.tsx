import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useForm, usePage } from '@inertiajs/react';
import { MessageCircle, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useEffect } from 'react';
import { BlogShowProps } from '../show';

const BlogLikeDislike = () => {
   const { props } = usePage<BlogShowProps>();
   const { blog, likesCount, dislikesCount, userReaction, commentsCount, translate } = props;
   const { button, common } = translate;

   const { data, setData, post, processing } = useForm({
      blog_id: blog.id,
      type: '',
   });

   const handleReaction = (type: 'like' | 'dislike') => {
      if (processing) return;

      setData('type', type);
   };

   useEffect(() => {
      if (data.type === 'like' || data.type === 'dislike') {
         post(route('blogs.like-dislike.toggle'), {
            preserveScroll: true,
         });
      }
   }, [data]);

   return (
      <div className="flex w-full items-center justify-between">
         <div className="flex items-center gap-2">
            <Button
               variant={userReaction === 'like' ? 'default' : 'outline'}
               size="sm"
               onClick={() => handleReaction('like')}
               disabled={processing}
               className={cn('flex items-center gap-2 transition-colors', userReaction === 'like' && 'bg-blue-500 text-white hover:bg-blue-600')}
            >
               <ThumbsUp className="h-4 w-4" />
               <span>{likesCount}</span>
               <span className="sr-only">{button.like}</span>
            </Button>

            <Button
               variant={userReaction === 'dislike' ? 'default' : 'outline'}
               size="sm"
               onClick={() => handleReaction('dislike')}
               disabled={processing}
               className={cn('flex items-center gap-2 transition-colors', userReaction === 'dislike' && 'bg-red-500 text-white hover:bg-red-600')}
            >
               <ThumbsDown className="h-4 w-4" />
               <span>{dislikesCount}</span>
               <span className="sr-only">{button.dislike}</span>
            </Button>
         </div>

         <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <h3 className="text-lg font-semibold">
               {commentsCount} {commentsCount > 1 ? common.comments : common.comment}
            </h3>
         </div>
      </div>
   );
};

export default BlogLikeDislike;
