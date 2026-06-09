import TiptapRenderer from '@/components/text-editor/tiptap-renderer/client-renderer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import LandingLayout from '@/layouts/landing-layout';
import { SharedData } from '@/types/global';
import { Head, usePage } from '@inertiajs/react';
import BlogComments from './partials/blog-comments';
import BlogLikeDislike from './partials/blog-like-dislike';

export interface BlogShowProps extends SharedData {
   blog: Blog;
   likesCount: number;
   dislikesCount: number;
   commentsCount: number;
   userReaction?: 'like' | 'dislike' | null;
}

const ShowBlog = ({ blog }: BlogShowProps) => {
   const { url, props } = usePage<BlogShowProps>();
   const { translate } = props;
   const { frontend } = translate;
   
   const createdAt = new Date(blog.created_at).toLocaleDateString();
   const authorInitials = blog.user?.name
      ? blog.user.name
           .split(' ')
           .map((n) => n.charAt(0))
           .join('')
           .toUpperCase()
      : frontend.author_initials_fallback;

   const bannerSrc = blog.banner || '/assets/images/blank-image.jpg';
   const thumbnailSrc = blog.thumbnail || '/assets/images/blank-image.jpg';
   const keywords = (blog.keywords || '')
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

   // Meta information
   const siteName = (typeof window !== 'undefined' && (window as any)?.App?.name) || frontend.default_site_name;
   const siteUrl = url;
   const siteOrigin = typeof window !== 'undefined' ? window.location.origin : url.split('/').slice(0, 3).join('/');
   const pageTitle = `${blog.title} | ${siteName}`;
   const plainText =
      blog.description
         ?.replace(/<[^>]*>/g, ' ')
         .replace(/\s+/g, ' ')
         .trim() || '';
   const pageDescription = plainText.length > 160 ? `${plainText.slice(0, 157)}...` : plainText;
   const ogImage = bannerSrc || thumbnailSrc;

   return (
      <LandingLayout customizable={false}>
         <Head>
            <title>{pageTitle}</title>
            {pageDescription && <meta name="description" content={pageDescription} />}
            {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}

            {/* Open Graph Tags */}
            <meta property="og:type" content="article" />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:title" content={blog.title} />
            {pageDescription && <meta property="og:description" content={pageDescription} />}
            <meta property="og:site_name" content={siteName} />
            {ogImage && <meta property="og:image" content={ogImage} />}
            {ogImage && <meta property="og:image:width" content="1200" />}
            {ogImage && <meta property="og:image:height" content="630" />}

            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={blog.title} />
            {pageDescription && <meta name="twitter:description" content={pageDescription} />}
            {ogImage && <meta name="twitter:image" content={ogImage} />}

            {/* Schema.org structured data */}
            <script type="application/ld+json">
               {JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'BlogPosting',
                  headline: blog.title,
                  description: pageDescription,
                  image: ogImage,
                  url: siteUrl,
                  mainEntityOfPage: siteUrl,
                  datePublished: blog.created_at,
                  dateModified: blog.updated_at,
                  author: blog.user?.name
                     ? {
                          '@type': 'Person',
                          name: blog.user.name,
                       }
                     : undefined,
                  publisher: {
                     '@type': 'Organization',
                     name: siteName,
                     url: siteOrigin,
                  },
                  keywords: keywords.join(', '),
               })}
            </script>
         </Head>

         <div className="mx-auto w-full max-w-4xl space-y-6">
            {/* Banner */}
            <div className="overflow-hidden border">
               <img src={bannerSrc} alt={frontend.blog_banner_alt} className="max-h-64 w-full object-cover sm:max-h-80 md:max-h-[420px]" />
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
                        <AvatarImage src={blog.user?.photo || undefined} alt={blog.user?.name || frontend.author_alt} />
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
                     alt={frontend.blog_thumbnail_alt}
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

               <Separator className="my-6" />

               {/* Like/Dislike Section */}
               <div className="flex items-center justify-center py-4">
                  <BlogLikeDislike />
               </div>

               <Separator className="my-6" />

               {/* Comments Section */}
               <BlogComments />
            </div>
         </div>
      </LandingLayout>
   );
};

export default ShowBlog;
