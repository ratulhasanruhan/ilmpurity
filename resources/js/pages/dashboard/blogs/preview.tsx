import TiptapRenderer from '@/components/text-editor/tiptap-renderer/client-renderer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SharedData } from '@/types/global';

interface Props extends SharedData {
   blog: Blog;
}

const Preview = ({ blog }: Props) => {
   const createdAt = new Date(blog.created_at).toLocaleDateString();
   const authorInitials = blog.user?.name
      ? blog.user.name
           .split(' ')
           .map((n) => n.charAt(0))
           .join('')
           .toUpperCase()
      : 'AU';

   const bannerSrc = blog.banner || '/assets/images/blank-image.jpg';
   const thumbnailSrc = blog.thumbnail || '/assets/images/blank-image.jpg';
   const keywords = (blog.keywords || '')
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

   return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
         {/* Banner */}
         <div className="overflow-hidden border">
            <img src={bannerSrc} alt="Blog banner" className="max-h-64 w-full object-cover sm:max-h-80 md:max-h-[420px]" />
         </div>

         {/* Title and meta */}
         <div className="space-y-3 px-4">
            <div className="flex flex-wrap items-center gap-3">
               {blog.category?.name && <Badge variant="secondary">{blog.category.name}</Badge>}
               {keywords.slice(0, 3).map((k) => (
                  <Badge key={k} variant="outline">
                     {k}
                  </Badge>
               ))}
            </div>
            <h1 className="text-2xl leading-tight font-semibold md:text-3xl">{blog.title}</h1>
            <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
               <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                     <AvatarImage src={blog.user?.photo || undefined} alt={blog.user?.name || 'Author'} />
                     <AvatarFallback>{authorInitials}</AvatarFallback>
                  </Avatar>
                  <span>{blog.user?.name}</span>
               </div>
               <span>•</span>
               <span>{createdAt}</span>
            </div>
         </div>

         <Separator />

         <div className="space-y-6 px-6 pb-10">
            {/* Content */}
            <div>
               <img
                  src={thumbnailSrc}
                  alt="Blog thumbnail"
                  className="max-h-60 w-full overflow-hidden rounded-lg border object-cover sm:max-h-72 md:max-h-96"
               />

               <div className="prose dark:prose-invert max-w-none py-6">
                  <TiptapRenderer>{blog.description}</TiptapRenderer>
               </div>
            </div>

            {/* Keywords */}
            {keywords.length > 0 && (
               <div className="flex flex-wrap gap-2">
                  {keywords.map((k) => (
                     <Badge key={k} variant="secondary">
                        #{k}
                     </Badge>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
};

export default Preview;
