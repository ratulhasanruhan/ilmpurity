import BlogCard1 from '@/components/cards/blog-card-1';
import TableFooter from '@/components/table/table-footer';
import { getQueryParams } from '@/lib/route';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types/global';
import { Head, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import Layout from './partials/layout';

export interface BlogsIndexProps extends SharedData {
   blogs: Pagination<Blog>;
   category?: BlogCategory;
   categories: BlogCategory[];
}

const Index = (props: BlogsIndexProps) => {
   const { url } = usePage();
   const { blogs, category, system, translate } = props;
   const { frontend } = translate;
   const urlParams = getQueryParams(url);

   // Generate meta information based on category
   const siteUrl = url;
   const siteName = system?.fields?.name || frontend.default_site_name;
   const siteAuthor = system?.fields?.author || frontend.default_author;
   const totalBlogs = props.blogs?.total || 0;
   const siteOrigin = typeof window !== 'undefined' ? window.location.origin : url.split('/').slice(0, 3).join('/');

   const pageTitle = frontend.all_blogs;
   const pageDescription = frontend.blog_page_description.replace(':total', totalBlogs.toString());
   const pageKeywords = frontend.blog_page_keywords;
   const ogTitle = frontend.latest_blog_posts;

   const fullTitle = `${pageTitle} | ${siteName}`;
   const firstBlogImage = props.blogs?.data?.[0]?.thumbnail || props.blogs?.data?.[0]?.banner || '';
   const ogImage = firstBlogImage || '/assets/images/blank-image.jpg';

   return (
      <>
         <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={pageDescription} />
            <meta name="keywords" content={pageKeywords} />
            <meta name="author" content={siteAuthor} />

            {/* Open Graph Tags */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:title" content={ogTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:site_name" content={siteName} />

            {/* Open Graph Image */}
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={`${pageTitle} - ${frontend.blog_list_alt}`} />

            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={ogTitle} />
            <meta name="twitter:description" content={pageDescription} />
            <meta name="twitter:image" content={ogImage} />

            {/* Listing-specific meta */}
            <meta name="blogs:total" content={totalBlogs.toString()} />
            <meta name="blogs:page" content={(props.blogs?.current_page || 1).toString()} />

            {/* Schema.org structured data */}
            <script type="application/ld+json">
               {JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'CollectionPage',
                  name: pageTitle,
                  description: pageDescription,
                  url: siteUrl,
                  image: ogImage,
                  provider: {
                     '@type': 'Organization',
                     name: siteName,
                     url: siteOrigin,
                  },
                  mainEntity: {
                     '@type': 'ItemList',
                     name: `${pageTitle} Collection`,
                     description: pageDescription,
                     numberOfItems: totalBlogs,
                     itemListElement:
                        props.blogs?.data
                           ?.slice(0, 10)
                           .map((blog: Blog, index: number) => ({
                              '@type': 'BlogPosting',
                              position: index + 1,
                              name: blog.title,
                              headline: blog.title,
                              description: (blog.description || '')
                                 .replace(/<[^>]*>/g, ' ')
                                 .replace(/\s+/g, ' ')
                                 .trim(),
                              image: blog.thumbnail || blog.banner || '',
                              provider: {
                                 '@type': 'Organization',
                                 name: siteName,
                              },
                           }))
                           .filter(Boolean) || [],
                  },
               })}
            </script>
         </Head>

         <div
            className={cn(urlParams['view'] && urlParams['view'] === 'list' ? 'space-y-7' : 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3')}
         >
            {blogs.data.map((blog: Blog) => (
               <BlogCard1 key={blog.id} blog={blog} viewType={urlParams['view'] as 'grid' | 'list'} />
            ))}
         </div>

         <TableFooter
            className="mt-6 p-5 sm:p-7"
            routeName="blogs.guest"
            paginationInfo={blogs}
            routeParams={{ category: category ? category.slug : 'all' }}
         />
      </>
   );
};

Index.layout = (page: ReactNode) => <Layout children={page} />;

export default Index;
