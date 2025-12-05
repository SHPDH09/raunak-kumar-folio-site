import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Home, Upload, LogOut, Shield, Plus, MessageCircle } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { CommentSection } from "@/components/CommentSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProfilePage } from "@/components/ProfilePage";
import { CreatePost } from "@/components/CreatePost";
import { Messenger } from "@/components/Messenger";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  followers_count: number;
  following_count: number;
}

interface PostData {
  id: string;
  title: string;
  caption: string | null;
  file_path: string | null;
  is_public: boolean;
  is_approved: boolean;
  user_id: string;
  created_at: string;
  share_count: number;
  repost_of: string | null;
  url?: string;
  profile?: Profile;
  likes_count: number;
  comments_count: number;
  user_liked: boolean;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [feedPosts, setFeedPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [messengerOpen, setMessengerOpen] = useState(false);
  const [chatUserId, setChatUserId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/auth');
      return;
    }

    setCurrentUser(session.user);
    await loadProfile(session.user.id);
    await loadUserPosts(session.user.id);
    await loadFeed(session.user.id);
    
    // Check if user is admin
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle();
    
    setIsAdmin(!!roles);
    setLoading(false);
  };

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error loading profile:', error);
      return;
    }

    setProfile(data);
  };

  const loadUserPosts = async (userId: string) => {
    const { data: imagesData, error } = await supabase
      .from('images')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading posts:', error);
      return;
    }

    const postsWithData = await Promise.all(
      (imagesData || []).map(async (image) => {
        const { count: likesCount } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('image_id', image.id);

        const { count: commentsCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('image_id', image.id);

        // Get signed URL only if file_path exists
        let signedUrl = '';
        if (image.file_path) {
          const { data: signedUrlData } = await supabase.storage
            .from('images')
            .createSignedUrl(image.file_path, 3600);
          signedUrl = signedUrlData?.signedUrl || '';
        }

        const { data: likeData } = await supabase
          .from('likes')
          .select('id')
          .eq('image_id', image.id)
          .eq('user_id', userId)
          .maybeSingle();

        return {
          ...image,
          url: signedUrl,
          profile,
          likes_count: likesCount || 0,
          comments_count: commentsCount || 0,
          user_liked: !!likeData,
        };
      })
    );

    setPosts(postsWithData);
  };

  const loadFeed = async (userId: string) => {
    const { data: imagesData, error } = await supabase
      .from('images')
      .select('*')
      .eq('is_public', true)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading feed:', error);
      return;
    }

    const userIds = [...new Set((imagesData || []).map(img => img.user_id))];
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);

    const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

    const postsWithData = await Promise.all(
      (imagesData || []).map(async (image) => {
        const { count: likesCount } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('image_id', image.id);

        const { count: commentsCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('image_id', image.id);

        // Get signed URL only if file_path exists
        let signedUrl = '';
        if (image.file_path) {
          const { data: signedUrlData } = await supabase.storage
            .from('images')
            .createSignedUrl(image.file_path, 3600);
          signedUrl = signedUrlData?.signedUrl || '';
        }

        const { data: likeData } = await supabase
          .from('likes')
          .select('id')
          .eq('image_id', image.id)
          .eq('user_id', userId)
          .maybeSingle();

        return {
          ...image,
          url: signedUrl,
          profile: profilesMap.get(image.user_id),
          likes_count: likesCount || 0,
          comments_count: commentsCount || 0,
          user_liked: !!likeData,
        };
      })
    );

    setFeedPosts(postsWithData);
  };

  const handleLike = async (postId: string) => {
    if (!currentUser) return;

    const post = feedPosts.find(p => p.id === postId) || posts.find(p => p.id === postId);
    if (!post) return;

    if (post.user_liked) {
      await supabase
        .from('likes')
        .delete()
        .eq('image_id', postId)
        .eq('user_id', currentUser.id);
    } else {
      await supabase
        .from('likes')
        .insert({ image_id: postId, user_id: currentUser.id });
    }

    loadUserPosts(currentUser.id);
    loadFeed(currentUser.id);
  };

  const handleShare = async (postId: string) => {
    const shareUrl = `${window.location.origin}/gallery?post=${postId}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      
      const post = posts.find(p => p.id === postId);
      if (post) {
        await supabase
          .from('images')
          .update({ share_count: (post.share_count || 0) + 1 })
          .eq('id', postId);
      }
      
      toast.success("Link copied to clipboard!");
      loadUserPosts(currentUser?.id);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (post.file_path) {
      await supabase.storage.from('images').remove([post.file_path]);
    }
    await supabase.from('images').delete().eq('id', postId);

    toast.success("Post deleted");
    loadUserPosts(currentUser?.id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handlePostCreated = () => {
    if (currentUser) {
      loadUserPosts(currentUser.id);
      loadFeed(currentUser.id);
    }
  };

  const handleMessageUser = (userId: string) => {
    setChatUserId(userId);
    setMessengerOpen(true);
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
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setMessengerOpen(true)}>
              <MessageCircle className="h-5 w-5" />
            </Button>
            {isAdmin && (
              <Button variant="secondary" onClick={() => navigate('/admin')}>
                <Shield className="h-5 w-5 mr-2" />
                Admin Panel
              </Button>
            )}
            <Button onClick={() => setUploadDialogOpen(true)}>
              <Plus className="h-5 w-5 mr-2" />
              New Post
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="my-posts">My Posts</TabsTrigger>
              <TabsTrigger value="feed">Feed</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              {currentUser && (
                <ProfilePage
                  userId={currentUser.id}
                  currentUserId={currentUser.id}
                  isOwnProfile={true}
                  postsCount={posts.length}
                  onMessageUser={handleMessageUser}
                />
              )}
            </TabsContent>

            <TabsContent value="my-posts" className="space-y-6 mt-6">
              {posts.map((post) => (
                <div key={post.id} className="relative">
                  {!post.is_approved && (
                    <Badge className="absolute top-4 right-4 z-10" variant="secondary">
                      Pending Approval
                    </Badge>
                  )}
                  <PostCard
                    id={post.id}
                    title={post.title}
                    caption={post.caption || undefined}
                    imageUrl={post.url || undefined}
                    username={profile?.username || "You"}
                    avatarUrl={profile?.avatar_url || undefined}
                    isVerified={profile?.is_verified || false}
                    createdAt={post.created_at}
                    likesCount={post.likes_count}
                    commentsCount={post.comments_count}
                    shareCount={post.share_count}
                    isLiked={post.user_liked}
                    canEdit={true}
                    canDelete={true}
                    onLike={() => handleLike(post.id)}
                    onComment={() => setSelectedPost(post)}
                    onShare={() => handleShare(post.id)}
                    onDelete={() => handleDelete(post.id)}
                    onClick={() => post.url && setSelectedPost(post)}
                    userId={post.user_id}
                    currentUserId={currentUser?.id}
                  />
                </div>
              ))}

              {posts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">You haven't created any posts yet</p>
                  <Button onClick={() => setUploadDialogOpen(true)} className="mt-4">
                    <Upload className="h-5 w-5 mr-2" />
                    Create Your First Post
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="feed" className="space-y-6 mt-6">
              {feedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  caption={post.caption || undefined}
                  imageUrl={post.url || undefined}
                  username={post.profile?.username || "Unknown"}
                  avatarUrl={post.profile?.avatar_url || undefined}
                  isVerified={post.profile?.is_verified || false}
                  createdAt={post.created_at}
                  likesCount={post.likes_count}
                  commentsCount={post.comments_count}
                  shareCount={post.share_count}
                  isLiked={post.user_liked}
                  canEdit={false}
                  canDelete={false}
                  onLike={() => handleLike(post.id)}
                  onComment={() => setSelectedPost(post)}
                  onShare={() => handleShare(post.id)}
                  onClick={() => post.url && setSelectedPost(post)}
                  userId={post.user_id}
                  currentUserId={currentUser?.id}
                />
              ))}

              {feedPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No approved posts yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Create Post Dialog */}
      {currentUser && (
        <CreatePost
          userId={currentUser.id}
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          onPostCreated={handlePostCreated}
        />
      )}

      {/* Post Detail Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPost && (
            <div className="space-y-4">
              {selectedPost.url && (
                <img
                  src={selectedPost.url}
                  alt={selectedPost.title}
                  className="w-full rounded-lg"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold">{selectedPost.title}</h2>
                {selectedPost.caption && (
                  <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{selectedPost.caption}</p>
                )}
              </div>
              <CommentSection
                imageId={selectedPost.id}
                currentUserId={currentUser?.id}
                isAdmin={false}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Messenger */}
      {currentUser && (
        <Messenger
          currentUserId={currentUser.id}
          open={messengerOpen}
          onOpenChange={(open) => {
            setMessengerOpen(open);
            if (!open) setChatUserId(null);
          }}
          initialChatUserId={chatUserId}
        />
      )}
    </div>
  );
};

export default UserDashboard;
