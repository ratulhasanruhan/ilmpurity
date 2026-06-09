import DeleteModal from '@/components/inertia/delete-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useForm, usePage } from '@inertiajs/react';
import { MessageCircle, Send, Trash2 } from 'lucide-react';
import { BlogShowProps } from '../show';

const BlogComments = () => {
   const { props } = usePage<BlogShowProps>();
   const { auth, blog, translate } = props;
   const { button, frontend, input } = translate;

   // Comment form
   const {
      data: commentData,
      setData: setCommentData,
      post: postComment,
      processing: commentProcessing,
      reset: resetComment,
   } = useForm({
      content: '',
      blog_id: blog.id,
   });

   // Reply form
   const {
      data: replyData,
      setData: setReplyData,
      post: postReply,
      processing: replyProcessing,
      reset: resetReply,
   } = useForm({
      content: '',
      blog_id: blog.id,
      parent_id: null as number | string | null,
   });

   const handleSubmitComment = (e: React.FormEvent) => {
      e.preventDefault();
      if (!commentData.content.trim()) return;

      postComment(route('blogs.comments.store'), {
         preserveScroll: true,
         onSuccess: () => {
            resetComment();
         },
      });
   };

   const handleSubmitReply = (e: React.FormEvent) => {
      e.preventDefault();
      if (!replyData.content.trim()) return;

      postReply(route('blogs.comments.store'), {
         preserveScroll: true,
         onSuccess: () => {
            resetReply();
         },
      });
   };

   // Format date
   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'short',
         day: 'numeric',
         hour: '2-digit',
         minute: '2-digit',
      });
   };

   // Get user initials
   const getUserInitials = (name: string) => {
      return name
         .split(' ')
         .map((n) => n.charAt(0))
         .join('')
         .toUpperCase()
         .slice(0, 2);
   };

   return (
      <div className={cn('space-y-6')}>
         {/* Comment Form */}
         <Card>
            <CardHeader>
               <h4 className="text-base font-medium">{frontend.post_a_comment}</h4>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmitComment} className="space-y-4">
                  <Textarea
                     placeholder={input.description}
                     value={commentData.content}
                     onChange={(e) => setCommentData('content', e.target.value)}
                     className="min-h-[100px] resize-none"
                     maxLength={1000}
                  />
                  <div className="flex items-center justify-between">
                     <span className="text-muted-foreground text-sm">
                        {commentData.content.length}/1000 {frontend.characters}
                     </span>
                     <Button type="submit" disabled={!commentData.content.trim() || commentProcessing} className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        {commentProcessing ? frontend.posting : button.post_comment}
                     </Button>
                  </div>
               </form>
            </CardContent>
         </Card>

         {/* Comments List */}
         <div className="space-y-4">
            {blog.comments.length === 0 ? (
               <div className="py-8 text-center">
                  <MessageCircle className="text-muted-foreground mx-auto mb-2 h-12 w-12" />
                  <p className="text-muted-foreground">{frontend.no_comments_yet}</p>
               </div>
            ) : (
               blog.comments.map((comment) => (
                  <Card key={comment.id} className="overflow-hidden">
                     <CardContent className="p-4">
                        {/* Comment Header */}
                        <div className="mb-3 flex items-start justify-between">
                           <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                 <AvatarImage src={comment.user.photo || ''} alt={comment.user.name} />
                                 <AvatarFallback>{getUserInitials(comment.user.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                 <p className="font-medium">{comment.user.name}</p>
                                 <p className="text-muted-foreground text-sm">{formatDate(comment.created_at)}</p>
                              </div>
                           </div>
                           {auth?.user?.id === comment.user.id && (
                              <DeleteModal
                                 routePath={route('blogs.comments.destroy', { id: comment.id })}
                                 actionComponent={
                                    <Button variant="ghost" className="bg-destructive/8 hover:bg-destructive/6 h-8 w-8">
                                       <Trash2 className="text-destructive h-3 w-3" />
                                    </Button>
                                 }
                              />
                           )}
                        </div>

                        {/* Comment Content */}
                        <div className="mb-3">
                           <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                        </div>

                        {/* Comment Actions */}
                        <div className="flex items-center gap-2">
                           <Button size="sm" variant="outline" onClick={() => setReplyData('parent_id', comment.id)} className="text-xs">
                              {button.reply}
                           </Button>
                        </div>

                        {/* Reply Form */}

                        {replyData.parent_id === comment.id && (
                           <div className="mt-4 space-y-3 border-t pt-4">
                              <form onSubmit={handleSubmitReply} className="space-y-3">
                                 <Textarea
                                    placeholder={input.description}
                                    value={replyData.content}
                                    onChange={(e) => setReplyData('content', e.target.value)}
                                    className="min-h-[80px] resize-none"
                                    maxLength={1000}
                                 />

                                 <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-xs">
                                       {replyData.content.length}/1000 {frontend.characters}
                                    </span>
                                    <div className="flex items-center gap-2">
                                       <Button type="button" variant="outline" size="sm" onClick={() => resetReply()}>
                                          {button.cancel}
                                       </Button>
                                       <Button type="submit" size="sm" disabled={!replyData.content.trim() || replyProcessing}>
                                          {replyProcessing ? frontend.replying : button.reply}
                                       </Button>
                                    </div>
                                 </div>
                              </form>
                           </div>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                           <div className="mt-5 space-y-5">
                              {comment.replies.map((reply) => (
                                 <div key={reply.id} className="border-border space-y-2 border-l pl-4">
                                    <div className="flex items-start justify-between">
                                       <div className="flex items-center gap-2">
                                          <Avatar className="h-8 w-8">
                                             <AvatarImage src={reply.user.photo || ''} alt={reply.user.name} />
                                             <AvatarFallback className="text-xs">{getUserInitials(reply.user.name)}</AvatarFallback>
                                          </Avatar>
                                          <div>
                                             <p className="text-sm font-medium">{reply.user.name}</p>
                                             <p className="text-muted-foreground text-xs">{formatDate(reply.created_at)}</p>
                                          </div>
                                       </div>
                                       {auth?.user?.id === reply.user.id && (
                                          <DeleteModal
                                             routePath={route('blogs.comments.destroy', { id: reply.id })}
                                             actionComponent={
                                                <Button variant="ghost" className="bg-destructive/8 hover:bg-destructive/6 h-8 w-8">
                                                   <Trash2 className="text-destructive h-3 w-3" />
                                                </Button>
                                             }
                                          />
                                       )}
                                    </div>
                                    <p className="pl-10 text-sm leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                                 </div>
                              ))}
                           </div>
                        )}
                     </CardContent>
                  </Card>
               ))
            )}
         </div>
      </div>
   );
};

export default BlogComments;
