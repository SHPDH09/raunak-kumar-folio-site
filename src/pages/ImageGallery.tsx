import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Eye, Upload, Image as ImageIcon, Edit, Trash2, LogOut, Download, X, Globe, User as UserIcon, Shield, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  is_verified: boolean;
}

interface ImageData {
  id: string;
  title: string;
  description: string | null;
  file_path: string;
  is_public: boolean;
  user_id: string;
  created_at: string;
  url?: string;
  profile?: Profile;
}

const ImageGallery = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState<'public' | 'my-images'>('public');
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingImage, setViewingImage] = useState<ImageData | null>(null);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadIsPublic, setUploadIsPublic] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check auth status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate('/auth');
        return;
      }

      // Load user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profile) {
        setUserProfile(profile);
      }

      // Check if admin
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      setIsAdmin(!!roles);
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Load images when view changes
  useEffect(() => {
    if (user) {
      if (view === 'public') {
        loadPublicImages();
      } else {
        loadMyImages();
      }
    }
  }, [view, user]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('images-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'images'
        },
        () => {
          if (view === 'public') {
            loadPublicImages();
          } else {
            loadMyImages();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [view, user]);

  const loadPublicImages = async () => {
    try {
      const { data, error } = await supabase
        .from('images')
        .select(`
          *,
          profile:profiles(id, username, full_name, is_verified)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const imagesWithUrls = await Promise.all(
        (data || []).map(async (img: any) => {
          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(img.file_path);
          return { ...img, url: publicUrl };
        })
      );
      
      setImages(imagesWithUrls);
    } catch (error) {
      console.error('[Internal] Error loading public images:', error);
      toast.error('Failed to load images. Please try again.');
    }
  };

  const loadMyImages = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('images')
        .select(`
          *,
          profile:profiles(id, username, full_name, is_verified)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const imagesWithUrls = await Promise.all(
        (data || []).map(async (img: any) => {
          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(img.file_path);
          return { ...img, url: publicUrl };
        })
      );
      
      setImages(imagesWithUrls);
    } catch (error) {
      console.error('[Internal] Error loading my images:', error);
      toast.error('Failed to load your images. Please try again.');
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle.trim() || !user) {
      toast.error('Please provide both title and image');
      return;
    }

    setLoading(true);
    try {
      const fileExt = uploadFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, uploadFile);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('images')
        .insert({
          title: uploadTitle.trim(),
          description: uploadDescription.trim() || null,
          file_path: fileName,
          is_public: uploadIsPublic,
          user_id: user.id,
        });

      if (dbError) throw dbError;

      toast.success('Image uploaded successfully!');
      setUploadDialog(false);
      setUploadTitle('');
      setUploadDescription('');
      setUploadFile(null);
      setUploadIsPublic(false);
      
      if (view === 'my-images') {
        loadMyImages();
      } else if (uploadIsPublic) {
        loadPublicImages();
      }
    } catch (error) {
      console.error('[Internal] Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (image: ImageData) => {
    if (!user || (image.user_id !== user.id && !isAdmin)) {
      toast.error('You can only delete your own images');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    setLoading(true);
    try {
      const { error: dbError } = await supabase
        .from('images')
        .delete()
        .eq('id', image.id);

      if (dbError) throw dbError;

      const { error: storageError } = await supabase.storage
        .from('images')
        .remove([image.file_path]);

      if (storageError) console.error('Storage deletion error:', storageError);

      toast.success('Image deleted successfully');
      setViewingImage(null);
      
      if (view === 'public') {
        loadPublicImages();
      } else {
        loadMyImages();
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (image: ImageData) => {
    if (!user || (image.user_id !== user.id && !isAdmin)) {
      toast.error('You can only modify your own images');
      return;
    }

    setLoading(true);
    try {
      const newVisibility = !image.is_public;
      const { error } = await supabase
        .from('images')
        .update({ is_public: newVisibility })
        .eq('id', image.id);

      if (error) throw error;

      toast.success(`Image is now ${newVisibility ? 'public' : 'private'}`);
      
      if (view === 'public') {
        loadPublicImages();
      } else {
        loadMyImages();
      }
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast.error('Failed to update visibility');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ImageIcon className="w-12 h-12 animate-pulse mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <ImageIcon className="w-10 h-10" />
              Image Gallery
            </h1>
            {userProfile && (
              <p className="text-muted-foreground mt-2 flex items-center gap-2">
                Welcome, {userProfile.username}
                {userProfile.is_verified && (
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                )}
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {isAdmin && (
              <Button variant="outline" onClick={() => navigate('/admin')}>
                <Shield className="w-4 h-4 mr-2" />
                Admin Panel
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* View Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={view === 'public' ? 'default' : 'outline'}
            onClick={() => setView('public')}
          >
            <Globe className="w-4 h-4 mr-2" />
            Public Gallery
          </Button>
          <Button
            variant={view === 'my-images' ? 'default' : 'outline'}
            onClick={() => setView('my-images')}
          >
            <UserIcon className="w-4 h-4 mr-2" />
            My Images ({images.length})
          </Button>
        </div>

        {/* Upload Button */}
        <div className="mb-6">
          <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Image</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="Enter image title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    placeholder="Enter image description"
                  />
                </div>
                <div>
                  <Label htmlFor="file">Image File</Label>
                  <Input
                    id="file"
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is-public"
                    checked={uploadIsPublic}
                    onChange={(e) => setUploadIsPublic(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="is-public">Make this image public</Label>
                </div>
                <Button onClick={handleUpload} disabled={loading} className="w-full">
                  {loading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {view === 'public' ? 'No public images yet' : 'You haven\'t uploaded any images yet'}
              </p>
            </div>
          ) : (
            images.map((image) => (
              <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div 
                  className="relative h-48 bg-muted cursor-pointer"
                  onClick={() => setViewingImage(image)}
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  {!image.is_public && (
                    <Badge className="absolute top-2 right-2" variant="secondary">
                      Private
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{image.title}</span>
                    {image.profile?.is_verified && (
                      <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    )}
                  </CardTitle>
                  {image.description && (
                    <CardDescription className="line-clamp-2">
                      {image.description}
                    </CardDescription>
                  )}
                  {view === 'public' && image.profile && (
                    <CardDescription className="text-xs">
                      By: {image.profile.username}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setViewingImage(image)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  {(image.user_id === user?.id || isAdmin) && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleVisibility(image)}
                      >
                        <Globe className="w-4 h-4 mr-1" />
                        {image.is_public ? 'Hide' : 'Publish'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(image)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* View Image Dialog */}
        {viewingImage && (
          <Dialog open={!!viewingImage} onOpenChange={() => setViewingImage(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {viewingImage.title}
                  {viewingImage.profile?.is_verified && (
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  )}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <img
                  src={viewingImage.url}
                  alt={viewingImage.title}
                  className="w-full h-auto rounded-lg"
                />
                {viewingImage.description && (
                  <p className="text-muted-foreground">{viewingImage.description}</p>
                )}
                {viewingImage.profile && (
                  <p className="text-sm text-muted-foreground">
                    Uploaded by: {viewingImage.profile.username}
                    {viewingImage.profile.full_name && ` (${viewingImage.profile.full_name})`}
                  </p>
                )}
                <div className="flex gap-2">
                  <a
                    href={viewingImage.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </a>
                  {(viewingImage.user_id === user?.id || isAdmin) && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => toggleVisibility(viewingImage)}
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        {viewingImage.is_public ? 'Make Private' : 'Make Public'}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(viewingImage)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;