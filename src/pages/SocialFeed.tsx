import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Home, LogIn } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { PollCard } from "@/components/PollCard";
import { CreatePoll } from "@/components/CreatePoll";
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
  is_following: boolean;
}

interface PollData {
  id: string;
  question: string;
  created_at: string;
  expires_at: string;
  user_id: string;
  profile?: Profile;
  options: {
    id: string;
    option_text: string;
    vote_count: number;
  }[];
}

type FeedItem = 
  | { type: 'post'; data: PostData }
  | { type: 'poll'; data: PollData };

const SocialFeed = () => {
  const navigate = useNavigate();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    checkAuth();
    loadFeed();

    const channel = supabase
      .channel('public-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'images' }, () => {
        loadFeed();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'polls' }, () => {
        loadFeed();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
      loadFollowing(user.id);
    }
  };

  const loadFollowing = async (userId: string) => {
    const { data } = await supabase
      .from('followers')
      .select('following_id')
      .eq('follower_id', userId);

    if (data) {
      setFollowingIds(new Set(data.map(f => f.following_id)));
    }
  };

  const loadFeed = async () => {
    setLoading(true);
    try {
      // Load posts
      const { data: imagesData, error: imagesError } = await supabase
        .from('images')
        .select('*')
        .eq('is_public', true)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      // Load polls
      const { data: pollsData, error: pollsError } = await supabase
        .from('polls')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      const items: FeedItem[] = [];

      // Process posts
      if (imagesData && !imagesError) {
        const userIds = [...new Set(imagesData.map(img => img.user_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('*')
          .in('id', userIds);

        const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

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

            // Get signed URL for private bucket
            const { data: signedUrlData } = await supabase.storage
              .from('images')
              .createSignedUrl(image.file_path, 3600);

            return {
              ...image,
              url: signedUrlData?.signedUrl || '',
              profile: profilesMap.get(image.user_id),
              likes_count: likesCount || 0,
              comments_count: commentsCount || 0,
              user_liked: false,
              is_following: followingIds.has(image.user_id),
            };
          })
        );

        postsWithData.forEach(post => {
          items.push({ type: 'post', data: post });
        });
      }

      // Process polls
      if (pollsData && !pollsError) {
        const pollUserIds = [...new Set(pollsData.map(p => p.user_id))];
        const { data: pollProfilesData } = await supabase
          .from('profiles')
          .select('*')
          .in('id', pollUserIds);

        const pollProfilesMap = new Map(pollProfilesData?.map(p => [p.id, p]) || []);

        for (const poll of pollsData) {
          const { data: optionsData } = await supabase
            .from('poll_options')
            .select('*')
            .eq('poll_id', poll.id);

          items.push({
            type: 'poll',
            data: {
              ...poll,
              profile: pollProfilesMap.get(poll.user_id),
              options: optionsData || [],
            },
          });
        }
      }

      // Sort all items by created_at
      items.sort((a, b) => {
        const dateA = new Date(a.data.created_at).getTime();
        const dateB = new Date(b.data.created_at).getTime();
        return dateB - dateA;
      });

      setFeedItems(items);
    } catch (error) {
      console.error('Error loading feed:', error);
      setFeedItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!currentUserId) {
      toast.info("Please login to like posts");
      return;
    }

    const post = feedItems.find(item => item.type === 'post' && item.data.id === postId);
    if (!post || post.type !== 'post') return;

    try {
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('image_id', postId)
        .eq('user_id', currentUserId)
        .maybeSingle();

      if (existingLike) {
        await supabase.from('likes').delete().eq('id', existingLike.id);
        toast.success("Unliked");
      } else {
        await supabase.from('likes').insert({ image_id: postId, user_id: currentUserId });
        toast.success("Liked!");
      }
      loadFeed();
    } catch (error) {
      toast.error("Failed to update like");
    }
  };

  const handleShare = async (postId: string) => {
    const post = feedItems.find(item => item.type === 'post' && item.data.id === postId);
    if (!post || post.type !== 'post') return;

    const shareUrl = `${window.location.origin}/feed?post=${postId}`;
    
    try {
      // Try native share first
      if (navigator.share) {
        await navigator.share({
          title: post.data.title,
          text: post.data.caption || 'Check out this post!',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      }

      await supabase
        .from('images')
        .update({ share_count: (post.data.share_count || 0) + 1 })
        .eq('id', postId);

      loadFeed();
    } catch (error) {
      // User cancelled share or error
      if ((error as Error).name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.success("Link copied to clipboard!");
        } catch {
          toast.error("Failed to share");
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <h1 className="text-lg font-bold hidden sm:block">Social Feed</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {currentUserId && (
              <CreatePoll userId={currentUserId} onPollCreated={loadFeed} />
            )}
            {currentUserId ? (
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
            ) : (
              <Button variant="default" size="sm" onClick={() => navigate('/auth')}>
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {feedItems.map((item) => (
            item.type === 'post' ? (
              <PostCard
                key={`post-${item.data.id}`}
                id={item.data.id}
                title={item.data.title}
                caption={item.data.caption || undefined}
                imageUrl={item.data.url || ""}
                username={item.data.profile?.username || "Unknown"}
                isVerified={item.data.profile?.is_verified || false}
                createdAt={item.data.created_at}
                likesCount={item.data.likes_count}
                commentsCount={item.data.comments_count}
                shareCount={item.data.share_count}
                isLiked={item.data.user_liked}
                canEdit={false}
                canDelete={false}
                onLike={() => handleLike(item.data.id)}
                onComment={() => setSelectedPost(item.data)}
                onShare={() => handleShare(item.data.id)}
                onClick={() => setSelectedPost(item.data)}
                userId={item.data.user_id}
                currentUserId={currentUserId || undefined}
                isFollowing={followingIds.has(item.data.user_id)}
                onFollowToggle={() => currentUserId && loadFollowing(currentUserId)}
              />
            ) : (
              <PollCard
                key={`poll-${item.data.id}`}
                id={item.data.id}
                question={item.data.question}
                options={item.data.options}
                createdAt={item.data.created_at}
                expiresAt={item.data.expires_at}
                username={item.data.profile?.username || "Unknown"}
                isVerified={item.data.profile?.is_verified || false}
                userId={item.data.user_id}
                currentUserId={currentUserId || undefined}
              />
            )
          ))}

          {feedItems.length === 0 && (
            <div className="text-center py-16 bg-card rounded-lg border">
              <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
              {!currentUserId && (
                <Button className="mt-4" onClick={() => navigate('/auth')}>
                  Login to Post
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Post Detail Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {selectedPost && (
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-black flex items-center justify-center min-h-[300px]">
                <img
                  src={selectedPost.url}
                  alt={selectedPost.title}
                  className="w-full h-full object-contain max-h-[70vh]"
                />
              </div>
              <div className="p-4 flex flex-col max-h-[70vh]">
                <div className="mb-4">
                  <h2 className="text-xl font-bold">{selectedPost.title}</h2>
                  {selectedPost.caption && (
                    <p className="text-muted-foreground mt-2">{selectedPost.caption}</p>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto">
                  <CommentSection
                    imageId={selectedPost.id}
                    currentUserId={currentUserId || undefined}
                    isAdmin={false}
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialFeed;