import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trash2, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profile?: {
    username: string;
  };
}

interface CommentSectionProps {
  imageId: string;
  currentUserId?: string;
  isAdmin: boolean;
}

export const CommentSection = ({ imageId, currentUserId, isAdmin }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`comments:${imageId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `image_id=eq.${imageId}`,
        },
        () => {
          loadComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [imageId]);

  const loadComments = async () => {
    // First get comments
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .eq('image_id', imageId)
      .order('created_at', { ascending: false});

    if (commentsError) {
      console.error('Error loading comments:', commentsError);
      return;
    }

    if (!commentsData || commentsData.length === 0) {
      setComments([]);
      return;
    }

    // Then get profile info for each comment
    const userIds = commentsData.map(c => c.user_id);
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', userIds);

    const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

    const commentsWithProfiles = commentsData.map(comment => ({
      ...comment,
      profile: profilesMap.get(comment.user_id),
    }));

    setComments(commentsWithProfiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUserId) return;

    setLoading(true);
    const { error } = await supabase
      .from('comments')
      .insert({
        image_id: imageId,
        user_id: currentUserId,
        content: newComment.trim(),
      });

    if (error) {
      toast.error("Failed to post comment");
      console.error(error);
    } else {
      setNewComment("");
      toast.success("Comment posted!");
    }
    setLoading(false);
  };

  const handleDelete = async (commentId: string, commentUserId: string) => {
    if (!currentUserId || (!isAdmin && currentUserId !== commentUserId)) {
      toast.error("You don't have permission to delete this comment");
      return;
    }

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      toast.error("Failed to delete comment");
      console.error(error);
    } else {
      toast.success("Comment deleted");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Comments ({comments.length})</h3>
      
      {currentUserId && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px]"
          />
          <Button type="submit" disabled={loading || !newComment.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      )}

      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {comment.profile?.username?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{comment.profile?.username || "User"}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.created_at)}
                  </span>
                  {(isAdmin || currentUserId === comment.user_id) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleDelete(comment.id, comment.user_id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-sm mt-1">{comment.content}</p>
            </div>
          </div>
        ))}
        
        {comments.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};
