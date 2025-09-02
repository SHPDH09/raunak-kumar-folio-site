import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import OTPVerification from '@/components/OTPVerification';
import { Eye, Lock, Upload, Image as ImageIcon, Edit, Trash2, LogOut, Download, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ImageGallery = () => {
  const [view, setView] = useState<'menu' | 'public' | 'private'>('menu');
  const [isVerified, setIsVerified] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewingImage, setViewingImage] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load images when view changes
  useEffect(() => {
    if (view === 'public') {
      loadPublicImages();
    } else if (view === 'private' && isVerified) {
      loadPrivateImages();
    }
  }, [view, isVerified]);

  const loadPublicImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const imagesWithUrls = await Promise.all(
        data.map(async (img) => {
          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(img.file_path);
          return { ...img, url: publicUrl };
        })
      );
      
      setImages(imagesWithUrls);
    } catch (error) {
      console.error('Error loading public images:', error);
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const loadPrivateImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('is_public', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const imagesWithUrls = await Promise.all(
        data.map(async (img) => {
          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(img.file_path);
          return { ...img, url: publicUrl };
        })
      );
      
      setImages(imagesWithUrls);
    } catch (error) {
      console.error('Error loading private images:', error);
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  // Screenshot protection for private gallery
  useEffect(() => {
    if (view === 'private' && isVerified) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.key === 'u') ||
            (e.ctrlKey && e.key === 's')) {
          e.preventDefault();
          toast.error('Screenshot and developer tools are disabled for security!');
        }
      };

      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        toast.error('Right-click is disabled for security!');
      };

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('contextmenu', handleContextMenu);
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('contextmenu', handleContextMenu);
        document.body.style.userSelect = 'auto';
      };
    }
  }, [view, isVerified]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setLoading(true);
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `${view}/${fileName}`;

          // Upload to Supabase storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          // Save metadata to database
          const { error: dbError } = await supabase
            .from('images')
            .insert({
              title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
              file_path: filePath,
              is_public: view === 'public'
            });

          if (dbError) throw dbError;

          toast.success('Image uploaded successfully!');
          
          // Reload images
          if (view === 'public') {
            loadPublicImages();
          } else {
            loadPrivateImages();
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          toast.error('Failed to upload image');
        } finally {
          setLoading(false);
        }
      } else {
        toast.error('Please select an image file');
      }
    }
  };

  const handleDelete = async (image: any) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('images')
        .remove([image.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('images')
        .delete()
        .eq('id', image.id);

      if (dbError) throw dbError;

      toast.success('Image deleted successfully!');
      
      // Reload images
      if (view === 'public') {
        loadPublicImages();
      } else {
        loadPrivateImages();
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleEdit = async (image: any) => {
    const newTitle = prompt('Enter new title:', image.title);
    if (newTitle && newTitle !== image.title) {
      try {
        const { error } = await supabase
          .from('images')
          .update({ title: newTitle })
          .eq('id', image.id);

        if (error) throw error;

        toast.success('Image title updated!');
        
        // Reload images
        if (view === 'public') {
          loadPublicImages();
        } else {
          loadPrivateImages();
        }
      } catch (error) {
        console.error('Error updating image:', error);
        toast.error('Failed to update image');
      }
    }
  };

  const handleDownload = async (image: any) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = image.title || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
  };

  if (view === 'private' && !isVerified) {
    return <OTPVerification onVerified={() => setIsVerified(true)} />;
  }

  const renderImageGrid = (imagesToRender: typeof images, isPrivate = false) => (
    <div className="space-y-6">
      {/* Upload section for both public and private */}
      <Card 
        className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-8 flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-muted rounded-full mb-4">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-2">
            {isPrivate ? 'Upload Private Images' : 'Upload Public Images'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Click here to upload images from your device. Images will be stored in the cloud and accessible from any device.
          </p>
          <Badge variant={isPrivate ? "destructive" : "default"}>
            {isPrivate ? 'Private Collection' : 'Public Collection'}
          </Badge>
        </CardContent>
      </Card>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="text-muted-foreground">Loading images...</div>
        </div>
      ) : (
        <div className={`grid ${isPrivate ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
          {imagesToRender.map((image) => (
            <Card key={image.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`${isPrivate ? 'aspect-square' : 'aspect-square'} overflow-hidden bg-muted`}>
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className={`${isPrivate ? 'p-3' : 'p-4'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-medium truncate ${isPrivate ? 'text-sm' : ''}`}>{image.title}</h3>
                  {isPrivate && <Badge variant="secondary" className="text-xs">Private</Badge>}
                </div>
                <div className="flex gap-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-xs"
                        onClick={() => setViewingImage(image)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl w-full p-0">
                      <div className="relative">
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-full max-h-[80vh] object-contain"
                          style={{ userSelect: 'none', pointerEvents: 'none' }}
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                          {isPrivate && (
                            <Button
                              size="sm"
                              onClick={() => handleDownload(image)}
                              className="bg-background/80 hover:bg-background"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                          <h3 className="text-white font-medium">{image.title}</h3>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {isPrivate && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(image)}
                        className="px-2"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDelete(image)}
                        className="px-2"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {view === 'menu' ? (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <div className="mx-auto p-4 bg-primary/10 rounded-full w-fit">
                <ImageIcon className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Image Gallery</h1>
              <p className="text-muted-foreground">
                Choose between public or private image collections
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 bg-green-100 rounded-full w-fit mb-2">
                    <Eye className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Public Gallery</CardTitle>
                  <CardDescription>
                    View publicly available images
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full group-hover:bg-primary/90" 
                    onClick={() => setView('public')}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Visit Public Gallery
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 bg-red-100 rounded-full w-fit mb-2">
                    <Lock className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-xl">Private Gallery</CardTitle>
                  <CardDescription>
                    Access with 5-digit OTP verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-muted" 
                    onClick={() => setView('private')}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Enter Passcode
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  {view === 'public' ? (
                    <>
                      <Eye className="h-6 w-6 text-green-600" />
                      Public Gallery
                    </>
                  ) : (
                    <>
                      <Lock className="h-6 w-6 text-red-600" />
                      Private Gallery
                    </>
                  )}
                </h1>
                <p className="text-muted-foreground">
                  {view === 'public' 
                    ? 'Publicly available images' 
                    : 'Private collection with upload capabilities'
                  }
                </p>
              </div>
              <div className="flex gap-2">
                {view === 'private' && (
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      setIsVerified(false);
                      toast.success('Logged out successfully!');
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                )}
                <Button variant="outline" onClick={() => setView('menu')}>
                  Back to Menu
                </Button>
              </div>
            </div>

            {renderImageGrid(images, view === 'private')}
            
            {/* Hidden file input for upload */}
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;