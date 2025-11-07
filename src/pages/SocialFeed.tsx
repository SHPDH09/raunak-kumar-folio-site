import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Home } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { CommentSection } from "@/components/CommentSection";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  is_verified: boolean;
}

interface PostData {
  id: string;
  title: string;
  caption: string | null;
  file_path: string;
  is_public: boolean;
  user_id: string;
  created_at: string;
  share_count: number;
  url?: string;
  profile?: Profile;
  likes_count: number;
  comments_count: number;
  user_liked: boolean;
}

const SocialFeed = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);

  useEffect(() => {
    loadPosts();

    // Subscribe to realtime updates for images
    const channel = supabase
      .channel('public-posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'images' }, () => {
        loadPosts();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'likes' }, () => {
        loadPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      // Get public images
      const { data: imagesData, error: imagesError } = await supabase
        .from('images')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (imagesError) {
        console.error('Error loading posts:', imagesError);
        setPosts([]);
        setLoading(false);
        return;
      }

      if (!imagesData || imagesData.length === 0) {
        setPosts([]);
        setLoading(false);
        return;
      }

      // Get profiles for all post authors
      const userIds = [...new Set(imagesData.map(img => img.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

      // Get likes count and user likes for each post
      const postsWithData = await Promise.all(
        imagesData.map(async (image) => {
          const { count: likesCount } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('image_id', image.id);

          const { count: commentsCount } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('image_id', image.id);

          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(image.file_path);

          return {
            ...image,
            url: publicUrl,
            profile: profilesMap.get(image.user_id),
            likes_count: likesCount || 0,
            comments_count: commentsCount || 0,
            user_liked: false,
          };
        })
      );

      setPosts(postsWithData);
    } catch (error) {
      console.error('Error in loadPosts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    toast.info("Like feature disabled - authentication removed");
  };

  const handleShare = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const shareUrl = `${window.location.origin}/gallery?post=${postId}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      
      await supabase
        .from('images')
        .update({ share_count: (post.share_count || 0) + 1 })
        .eq('id', postId);
      
      toast.success("Link copied to clipboard!");
      loadPosts();
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleDelete = async () => {
    toast.info("Delete feature disabled - authentication removed");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <Home className="h-5 w-5 mr-2" />
              Home
            </Button>
            <h1 className="text-xl font-bold">Social Feed</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              caption={post.caption || undefined}
              imageUrl={post.url || ""}
              username={post.profile?.username || "Unknown"}
              isVerified={post.profile?.is_verified || false}
              createdAt={post.created_at}
              likesCount={post.likes_count}
              commentsCount={post.comments_count}
              shareCount={post.share_count}
              isLiked={false}
              canEdit={false}
              canDelete={false}
              onLike={handleLike}
              onComment={() => setSelectedPost(post)}
              onShare={() => handleShare(post.id)}
              onDelete={handleDelete}
              onClick={() => setSelectedPost(post)}
            />
          ))}

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
            </div>
          )}
        </div>
      </main>

      {/* Post Detail Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPost && (
            <div className="space-y-4">
              <img
                src={selectedPost.url}
                alt={selectedPost.title}
                className="w-full rounded-lg"
              />
              <div>
                <h2 className="text-2xl font-bold">{selectedPost.title}</h2>
                {selectedPost.caption && (
                  <p className="text-muted-foreground mt-2">{selectedPost.caption}</p>
                )}
              </div>
              <CommentSection
                imageId={selectedPost.id}
                currentUserId={undefined}
                isAdmin={false}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialFeed;
