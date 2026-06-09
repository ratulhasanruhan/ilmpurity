import Combobox from '@/components/combobox';
import InputError from '@/components/input-error';
import TiptapEditor from '@/components/text-editor/tiptap-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { onHandleChange } from '@/lib/inertia';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FileText, Image, Save } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { BlogCreateEditProps } from '../create-edit';

const BlogForm = () => {
   const { props } = usePage<BlogCreateEditProps>();
   const { auth, blog, categories, statuses, translate } = props;
   const { dashboard, input, button } = translate;
   const [banner, setBanner] = useState(blog?.banner || '/assets/images/blank-image.jpg');
   const [thumbnail, setThumbnail] = useState(blog?.thumbnail || '/assets/images/blank-image.jpg');

   const { data, setData, post, processing, errors } = useForm({
      title: blog ? blog.title : '',
      slug: blog ? blog.slug : '',
      description: blog ? blog.description : '',
      keywords: blog ? blog.keywords || '' : '',
      status: blog ? blog.status : 'draft',
      thumbnail: null,
      banner: null,
      user_id: blog ? blog.user_id : auth.user.id,
      blog_category_id: blog ? blog.blog_category_id : '',
   });

   const handleSubmit = (e: FormEvent) => {
      e.preventDefault();

      if (blog) {
         post(route('blogs.update', blog.id));
      } else {
         post(route('blogs.store'));
      }
   };

   const transformedCategories = categories?.map((category) => ({
      label: category.name,
      value: category.id as string,
   }));

   return (
      <form onSubmit={handleSubmit} className="space-y-6">
         {/* Basic Information */}
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {dashboard.blog_information}
               </CardTitle>
               <CardDescription>{dashboard.provide_blog_details}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
               <div>
                  <Label htmlFor="title">{dashboard.title_80_char}</Label>
                  <Input
                     id="title"
                     value={data.title}
                     onChange={(e) => setData('title', e.target.value)}
                     placeholder={dashboard.enter_blog_title}
                     maxLength={80}
                  />
                  <InputError message={errors.title} />
               </div>

               <div className="grid gap-4 md:grid-cols-2">
                  <div>
                     <Label htmlFor="blog_category_id">{input.category} *</Label>
                     <Combobox
                        defaultValue={data.blog_category_id as string}
                        data={transformedCategories || []}
                        placeholder={dashboard.select_category}
                        onSelect={(selected) => setData('blog_category_id', selected.value)}
                     />
                     <InputError message={errors.blog_category_id} />
                  </div>

                  <div>
                     <Label htmlFor="status">{input.status} *</Label>
                     <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                        <SelectTrigger>
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           {Object.entries(statuses).map(([key, label]) => (
                              <SelectItem key={key} value={key}>
                                 {label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                     <InputError message={errors.status} />
                  </div>
               </div>

               <div>
                  <Label htmlFor="keywords">{dashboard.keywords_80_char}</Label>
                  <Input
                     id="keywords"
                     value={data.keywords}
                     onChange={(e) => setData('keywords', e.target.value)}
                     placeholder={dashboard.enter_your_keywords}
                     maxLength={80}
                  />
                  <InputError message={errors.keywords} />
               </div>

               <div>
                  <Label htmlFor="description">{input.description} *</Label>
                  <TiptapEditor
                     ssr={true}
                     output="html"
                     placeholder={{
                        paragraph: dashboard.write_blog_content_here,
                        imageCaption: dashboard.type_caption_optional,
                     }}
                     contentMinHeight={256}
                     contentMaxHeight={640}
                     initialContent={data.description}
                     onContentChange={(value) =>
                        setData((prev) => ({
                           ...prev,
                           description: value as string,
                        }))
                     }
                  />
                  <InputError message={errors.description} />
               </div>
            </CardContent>
         </Card>

         {/* Media Information */}
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  {dashboard.media_files}
               </CardTitle>
               <CardDescription>{dashboard.upload_banner_thumbnail_desc}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
               <div>
                  <Label htmlFor="banner">{dashboard.blog_banner}</Label>
                  <Input id="banner" type="file" accept="image/*" name="banner" onChange={(e) => onHandleChange(e, setData, setBanner)} />
                  <InputError message={errors.banner} />

                  <div className="border-border mt-3 overflow-hidden rounded-lg border-2 border-dashed">
                     <img src={banner} alt="" />
                  </div>
               </div>

               <div>
                  <Label htmlFor="thumbnail">{dashboard.blog_thumbnail}</Label>
                  <Input id="thumbnail" type="file" accept="image/*" name="thumbnail" onChange={(e) => onHandleChange(e, setData, setThumbnail)} />
                  <InputError message={errors.thumbnail} />

                  <div className="border-border mt-3 overflow-hidden rounded-lg border-2 border-dashed">
                     <img src={thumbnail} alt="" />
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Submit Buttons */}
         <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="outline" asChild>
               <Link href={route('blogs.index')}>{button.cancel}</Link>
            </Button>
            <Button type="submit" disabled={processing}>
               <Save className="mr-2 h-4 w-4" />
               {blog ? dashboard.update_blog : dashboard.add_blog}
            </Button>
         </div>
      </form>
   );
};

export default BlogForm;
