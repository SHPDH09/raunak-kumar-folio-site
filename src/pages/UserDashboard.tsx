import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Home, Upload, User, LogOut, Users, Shield } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { CommentSection } from "@/components/CommentSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  is_verified: boolean;
  followers_count: number;
  following_count: number;
}

interface PostData {
  id: string;
  title: string;
  caption: string | null;
  file_path: string;
  is_public: boolean;
  is_approved: boolean;
  user_id: string;
  created_at: string;
  share_count: number;
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
  const [uploading, setUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    caption: "",
    file: null as File | null,
  });

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
    await loadFeed();
    
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

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(image.file_path);

        const { data: likeData } = await supabase
          .from('likes')
          .select('id')
          .eq('image_id', image.id)
          .eq('user_id', userId)
          .maybeSingle();

        return {
          ...image,
          url: publicUrl,
          profile,
          likes_count: likesCount || 0,
          comments_count: commentsCount || 0,
          user_liked: !!likeData,
        };
      })
    );

    setPosts(postsWithData);
  };

  const loadFeed = async () => {
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

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(image.file_path);

        const { data: likeData } = await supabase
          .from('likes')
          .select('id')
          .eq('image_id', image.id)
          .eq('user_id', currentUser?.id)
          .maybeSingle();

        return {
          ...image,
          url: publicUrl,
          profile: profilesMap.get(image.user_id),
          likes_count: likesCount || 0,
          comments_count: commentsCount || 0,
          user_liked: !!likeData,
        };
      })
    );

    setFeedPosts(postsWithData);
  };

  const handleUpload = async () => {
    if (!newPost.file || !newPost.title || !currentUser) {
      toast.error("Please fill in all fields");
      return;
    }

    setUploading(true);

    try {
      const fileExt = newPost.file.name.split('.').pop();
      const fileName = `${currentUser.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, newPost.file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from('images')
        .insert({
          title: newPost.title,
          caption: newPost.caption,
          file_path: fileName,
          user_id: currentUser.id,
          is_public: true,
          is_approved: false,
        });

      if (insertError) throw insertError;

      toast.success("Post submitted for approval!");
      setUploadDialogOpen(false);
      setNewPost({ title: "", caption: "", file: null });
      loadUserPosts(currentUser.id);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
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
    loadFeed();
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

    await supabase.storage.from('images').remove([post.file_path]);
    await supabase.from('images').delete().eq('id', postId);

    toast.success("Post deleted");
    loadUserPosts(currentUser?.id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
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
            {isAdmin && (
              <Button variant="secondary" onClick={() => navigate('/admin')}>
                <Shield className="h-5 w-5 mr-2" />
                Admin Panel
              </Button>
            )}
            <Button onClick={() => setUploadDialogOpen(true)}>
              <Upload className="h-5 w-5 mr-2" />
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
          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="feed">Feed</TabsTrigger>
              <TabsTrigger value="my-posts">My Posts</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="space-y-6 mt-6">
              {feedPosts.map((post) => (
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
                  isLiked={post.user_liked}
                  canEdit={false}
                  canDelete={false}
                  onLike={() => handleLike(post.id)}
                  onComment={() => setSelectedPost(post)}
                  onShare={() => handleShare(post.id)}
                  onClick={() => setSelectedPost(post)}
                />
              ))}

              {feedPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No approved posts yet</p>
                </div>
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
                    imageUrl={post.url || ""}
                    username={profile?.username || "You"}
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
                    onClick={() => setSelectedPost(post)}
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

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback>
                        {profile?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{profile?.username}</span>
                        {profile?.is_verified && (
                          <Badge variant="secondary" className="gap-1">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{profile?.full_name}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{posts.length}</p>
                      <p className="text-sm text-muted-foreground">Posts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{profile?.followers_count || 0}</p>
                      <p className="text-sm text-muted-foreground">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{profile?.following_count || 0}</p>
                      <p className="text-sm text-muted-foreground">Following</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Enter post title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Caption</label>
              <Textarea
                value={newPost.caption}
                onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
                placeholder="Write a caption..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setNewPost({ ...newPost, file: e.target.files?.[0] || null })}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Your post will be submitted for admin approval before going public.
            </p>
            <Button onClick={handleUpload} disabled={uploading} className="w-full">
              {uploading ? "Uploading..." : "Submit for Approval"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
                currentUserId={currentUser?.id}
                isAdmin={false}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;
