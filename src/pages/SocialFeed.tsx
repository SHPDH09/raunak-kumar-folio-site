import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, LogOut, Home, User as UserIcon } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { CommentSection } from "@/components/CommentSection";
import type { User, Session } from "@supabase/supabase-js";

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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    checkAuth();
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

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    setUser(session?.user ?? null);

    if (session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setUserProfile(profile);
      }

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      setIsAdmin(!!roles);
    }
    setLoading(false);
  };

  const loadPosts = async () => {
    // Get public images
    const { data: imagesData, error: imagesError } = await supabase
      .from('images')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (imagesError) {
      console.error('Error loading posts:', imagesError);
      return;
    }

    if (!imagesData || imagesData.length === 0) {
      setPosts([]);
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

        let userLiked = false;
        if (user) {
          const { data: likeData } = await supabase
            .from('likes')
            .select('id')
            .eq('image_id', image.id)
            .eq('user_id', user.id)
            .maybeSingle();
          userLiked = !!likeData;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(image.file_path);

        return {
          ...image,
          url: publicUrl,
          profile: profilesMap.get(image.user_id),
          likes_count: likesCount || 0,
          comments_count: commentsCount || 0,
          user_liked: userLiked,
        };
      })
    );

    setPosts(postsWithData);
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle || !user) {
      toast.error("Please fill all fields");
      return;
    }

    const fileExt = uploadFile.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, uploadFile);

    if (uploadError) {
      toast.error("Failed to upload image");
      console.error(uploadError);
      return;
    }

    const { error: dbError } = await supabase
      .from('images')
      .insert({
        user_id: user.id,
        title: uploadTitle,
        caption: uploadCaption || null,
        file_path: fileName,
        is_public: true,
      });

    if (dbError) {
      toast.error("Failed to create post");
      console.error(dbError);
      return;
    }

    toast.success("Post created!");
    setUploadDialog(false);
    setUploadTitle("");
    setUploadCaption("");
    setUploadFile(null);
    loadPosts();
  };

  const handleLike = async (postId: string, currentlyLiked: boolean) => {
    if (!user) {
      toast.error("Please login to like posts");
      return;
    }

    if (currentlyLiked) {
      await supabase
        .from('likes')
        .delete()
        .eq('image_id', postId)
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('likes')
        .insert({ image_id: postId, user_id: user.id });
    }

    loadPosts();
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

  const handleDelete = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const { error: storageError } = await supabase.storage
      .from('images')
      .remove([post.file_path]);

    if (storageError) {
      toast.error("Failed to delete image file");
      return;
    }

    const { error: dbError } = await supabase
      .from('images')
      .delete()
      .eq('id', postId);

    if (dbError) {
      toast.error("Failed to delete post");
      return;
    }

    toast.success("Post deleted");
    setSelectedPost(null);
    loadPosts();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
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
            {user && (
              <>
                <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Create Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Post</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={uploadTitle}
                          onChange={(e) => setUploadTitle(e.target.value)}
                          placeholder="Enter post title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="caption">Caption (optional)</Label>
                        <Textarea
                          id="caption"
                          value={uploadCaption}
                          onChange={(e) => setUploadCaption(e.target.value)}
                          placeholder="Write a caption..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="image">Image</Label>
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                        />
                      </div>
                      <Button onClick={handleUpload} className="w-full">
                        Upload Post
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" size="icon">
                  <UserIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
            {!user && (
              <Button onClick={() => navigate('/auth')}>Login</Button>
            )}
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
              isLiked={post.user_liked}
              canEdit={user?.id === post.user_id || isAdmin}
              canDelete={user?.id === post.user_id || isAdmin}
              onLike={() => handleLike(post.id, post.user_liked)}
              onComment={() => setSelectedPost(post)}
              onShare={() => handleShare(post.id)}
              onDelete={() => handleDelete(post.id)}
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
                currentUserId={user?.id}
                isAdmin={isAdmin}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialFeed;
