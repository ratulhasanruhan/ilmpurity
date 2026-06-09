import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import TagInput from '@/components/tag-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { onHandleChange } from '@/lib/inertia';
import { SharedData } from '@/types/global';
import { useForm, usePage } from '@inertiajs/react';
import { Camera } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface SocialLink {
   host: string;
   profile_link: string;
}

type SocialLinksMap = {
   website: string;
   github: string;
   twitter: string;
   linkedin: string;
};

const UpdateProfile = ({ instructor }: { instructor: Instructor }) => {
   const { auth, system, errors } = usePage<SharedData>().props;
   const user = auth.user;
   const [userPhoto, setUserPhoto] = useState(user.photo);

   const [socialLinks, setSocialLinks] = useState<SocialLinksMap>({
      website: '',
      github: '',
      twitter: '',
      linkedin: '',
   });

   const parseSocialLinks = useCallback((socialLinksData: unknown) => {
      try {
         if (!socialLinksData) return;

         const links: SocialLink[] = typeof socialLinksData === 'string' ? JSON.parse(socialLinksData) : (socialLinksData as SocialLink[]);

         const linkMap: SocialLinksMap = {
            website: '',
            github: '',
            twitter: '',
            linkedin: '',
         };

         links.forEach((link) => {
            if (link.host in linkMap) {
               linkMap[link.host as keyof SocialLinksMap] = link.profile_link;
            }
         });

         setSocialLinks(linkMap);
      } catch (error) {
         toast.error('Failed to parse social links');
      }
   }, []);

   useEffect(() => {
      parseSocialLinks(user.social_links);
   }, [user.social_links]);

   const formatSocialLinks = useCallback((links: SocialLinksMap): any[] => {
      const formattedLinks = Object.entries(links)
         .filter(([_, value]) => value)
         .map(([host, profile_link]) => ({ host, profile_link }));

      return formattedLinks;
   }, []);

   const updateSocialLink = useCallback((platform: keyof SocialLinksMap, value: string) => {
      setSocialLinks((prev) => ({
         ...prev,
         [platform]: value,
      }));
   }, []);

   // Parse the options and answers if they're strings
   const initialOptions = instructor?.skills ? (typeof instructor.skills === 'string' ? JSON.parse(instructor.skills) : instructor.skills) : [];

   const { data, post, setData, processing } = useForm({
      name: user.name || '',
      photo: null as File | null,
      social_links: [] as any[],
      user_id: user.id,
      skills: initialOptions,
      designation: instructor?.designation || '',
      biography: instructor?.biography || '',
      resume: null,
   });

   useEffect(() => {
      setData('social_links', formatSocialLinks(socialLinks));
   }, [socialLinks, formatSocialLinks, setData]);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      post(route('account.profile'));
   };

   const onImageChange = (name: string, value: unknown) => {
      setData(name as any, value as any);
      setUserPhoto(URL.createObjectURL(value as File));
   };

   return (
      <form onSubmit={handleSubmit} className="bg-card space-y-6 rounded-lg border p-6 shadow">
         <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="flex w-full flex-col items-center space-y-3 text-center md:max-w-[160px]">
               <div className="relative mb-4 h-[100px] w-[100px]">
                  {userPhoto ? (
                     <img alt="item-1" src={userPhoto} className="h-[100px] w-[100px] rounded-full object-cover" />
                  ) : (
                     <div className="h-[100px] w-[100px] rounded-full bg-gray-300"></div>
                  )}

                  <label htmlFor="formFileSm" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                     <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100">
                        <Camera className="h-6 w-6 text-gray-500" />
                     </div>
                  </label>
                  <input hidden type="file" id="formFileSm" name="photo" onChange={(e) => onHandleChange(e, onImageChange)} />
               </div>

               <small className="text-xs text-gray-500">Allowed: JPG, JPEG, PNG, SVG File, Maximum 2MB</small>

               {errors.photo && <p className="mt-1 text-sm text-red-500">{errors.photo}</p>}
            </div>

            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
               <div>
                  <Label>Website</Label>
                  <Input
                     type="url"
                     name="website"
                     value={socialLinks.website}
                     onChange={(e) => updateSocialLink('website', e.target.value)}
                     className="mt-1"
                     placeholder="https://example.com"
                  />
               </div>

               <div>
                  <Label>GitHub</Label>
                  <Input
                     type="url"
                     name="github"
                     value={socialLinks.github}
                     onChange={(e) => updateSocialLink('github', e.target.value)}
                     className="mt-1"
                     placeholder="https://github.com/my-profile"
                  />
               </div>

               <div>
                  <Label>Twitter</Label>
                  <Input
                     type="url"
                     name="twitter"
                     value={socialLinks.twitter}
                     onChange={(e) => updateSocialLink('twitter', e.target.value)}
                     className="mt-1"
                     placeholder="https://twitter.com/my-profile"
                  />
               </div>

               <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                     id="linkedin"
                     name="linkedin"
                     value={socialLinks.linkedin}
                     onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                     className="mt-1"
                     placeholder="https://linkedin.com/my-profile"
                  />
               </div>
            </div>
         </div>

         <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" value={data.name} onChange={(e) => onHandleChange(e, setData)} className="mt-1" placeholder="John Doe" />
            <InputError message={errors.name} />
         </div>

         {((user.role === 'admin' && user.instructor_id) || user.role === 'instructor') && (
            <>
               <div>
                  <Label>Designation</Label>
                  <Input name="designation" value={data.designation} onChange={(e) => onHandleChange(e, setData)} placeholder="Software Engineer" />
                  <InputError message={errors.designation} />
               </div>
               {user.role === 'instructor' && (
                  <div>
                     <Label>Resume</Label>
                     <Input readOnly type="file" name="resume" onChange={(e) => onHandleChange(e, setData)} />
                     <InputError message={errors.resume} />
                  </div>
               )}
               <div>
                  <Label>Skills</Label>
                  <TagInput defaultTags={data.skills} placeholder="Enter the skills as a tag" onChange={(values: any) => setData('skills', values)} />
               </div>
               <div className="pb-3">
                  <Label>Biography</Label>
                  <Textarea
                     rows={5}
                     required
                     name="biography"
                     value={data.biography}
                     onChange={(e) => onHandleChange(e, setData)}
                     placeholder="Write about yourself"
                  />
                  <InputError message={errors.biography} />
               </div>
            </>
         )}

         <div className="col-span-full pt-2">
            <LoadingButton loading={processing}>Save Changes</LoadingButton>
         </div>
      </form>
   );
};

export default UpdateProfile;
