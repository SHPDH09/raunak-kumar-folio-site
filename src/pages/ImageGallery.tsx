import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import OTPVerification from '@/components/OTPVerification';
import { Eye, Lock, Upload, Image as ImageIcon, Edit, Trash2, LogOut, Download, X, Globe, User } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ImageGallery = () => {
  const [view, setView] = useState<'menu' | 'public' | 'private'>('menu');
  const [isVerified, setIsVerified] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewingImage, setViewingImage] = useState<any>(null);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load images when view changes
  useEffect(() => {
    if (view === 'public') {
      loadPublicImages();
    } else if (view === 'private' && isVerified) {
      loadAllImages();
    }
  }, [view, isVerified]);

  const loadPublicImages = async () => {
    setLoading(true);
    try {
      // Show all images in public gallery
      const { data, error } = await supabase
        .from('images')
        .select('*')
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

  const loadAllImages = async () => {
    setLoading(true);
    try {
      // Show all images in private view
      const { data, error } = await supabase
        .from('images')
        .select('*')
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
      console.error('Error loading images:', error);
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setUploadFile(file);
        setUploadTitle(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
        setUploadDialog(true);
      } else {
        toast.error('Please select an image file');
      }
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const fileExt = uploadFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `private/${fileName}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, uploadFile);

      if (uploadError) throw uploadError;

      // Save metadata to database - make it public so it shows in both galleries
      const { error: dbError } = await supabase
        .from('images')
        .insert({
          title: uploadTitle,
          file_path: filePath,
          is_public: true // Make images public so they show in both galleries
        });

      if (dbError) throw dbError;

      toast.success('Image uploaded successfully!');
      
      // Reset form and reload both galleries
      setUploadDialog(false);
      setUploadTitle('');
      setUploadDescription('');
      setUploadFile(null);
      
      // Reload current gallery
      if (view === 'private') {
        loadAllImages();
      } else {
        loadPublicImages();
      }
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (image: any) => {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      console.log('Deleting image:', image.id, 'File path:', image.file_path);
      
      // Immediately remove from local state for instant UI feedback
      setImages(prevImages => prevImages.filter(img => img.id !== image.id));
      
      // Delete from storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('images')
        .remove([image.file_path]);

      console.log('Storage deletion result:', { data: storageData, error: storageError });

      // Delete from database - this removes it from both galleries since they share the same data
      const { data: dbData, error: dbError } = await supabase
        .from('images')
        .delete()
        .eq('id', image.id);

      console.log('Database deletion result:', { data: dbData, error: dbError });

      if (dbError) {
        console.error('Database deletion error:', dbError);
        // If database deletion fails, restore the image to the list
        setImages(prevImages => [...prevImages, image]);
        throw new Error('Failed to delete image from database: ' + dbError.message);
      }

      toast.success('Image deleted from both admin and public galleries!');
      console.log('Image deleted successfully from both storage and database');
      
      // Force refresh both galleries if they're loaded
      setTimeout(() => {
        loadAllImages(); // This will refresh both since they use same data
      }, 100);
      
    } catch (error) {
      console.error('Error deleting image:', error);
      // Restore the image to the list if there was an error
      setImages(prevImages => {
        const exists = prevImages.some(img => img.id === image.id);
        if (!exists) {
          return [...prevImages, image];
        }
        return prevImages;
      });
      toast.error(error instanceof Error ? error.message : 'Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (image: any) => {
    const newTitle = prompt('Enter new title:', image.title);
    if (newTitle && newTitle.trim() !== '' && newTitle !== image.title) {
      setLoading(true);
      try {
        const { error } = await supabase
          .from('images')
          .update({ title: newTitle.trim() })
          .eq('id', image.id);

        if (error) {
          console.error('Database update error:', error);
          throw new Error('Failed to update image title');
        }

        toast.success('Image title updated successfully!');
        
        // Reload images
        if (view === 'private') {
          loadAllImages();
        } else {
          loadPublicImages();
        }
      } catch (error) {
        console.error('Error updating image:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to update image');
      } finally {
        setLoading(false);
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

  const toggleVisibility = async (image: any) => {
    setLoading(true);
    try {
      const newVisibility = !image.is_public;
      const { error } = await supabase
        .from('images')
        .update({ is_public: newVisibility })
        .eq('id', image.id);

      if (error) {
        console.error('Visibility update error:', error);
        throw new Error('Failed to update image visibility');
      }

      toast.success(`Image is now ${newVisibility ? 'public' : 'private'}!`);
      
      // Reload images
      if (view === 'private') {
        loadAllImages();
      } else {
        loadPublicImages();
      }
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update visibility');
    } finally {
      setLoading(false);
    }
  };

  const renderImageGrid = (imagesToRender: typeof images, isPrivate = false) => (
    <div className="space-y-6">
      {/* Upload section only for private */}
      {isPrivate && (
        <>
          <Card 
            className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-muted rounded-full mb-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">
                Upload Images
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Click here to upload images from your device. Images will be stored in the cloud and accessible from any device.
              </p>
              <Badge variant="destructive">
                Private Upload
              </Badge>
            </CardContent>
          </Card>

          {/* Upload Dialog */}
          <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Image</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="Enter image title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    placeholder="Enter image description (optional)"
                    className="min-h-[80px]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setUploadDialog(false);
                      setUploadTitle('');
                      setUploadDescription('');
                      setUploadFile(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpload} disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="text-muted-foreground">Loading images...</div>
        </div>
      ) : isPrivate ? (
        // List view for private gallery
        <div className="space-y-3">
          {imagesToRender.map((image) => (
            <Card key={image.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{image.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(image.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={image.is_public ? "default" : "secondary"} className="text-xs">
                      {image.is_public ? (
                        <>
                          <Globe className="h-3 w-3 mr-1" />
                          Public
                        </>
                      ) : (
                        <>
                          <User className="h-3 w-3 mr-1" />
                          Private
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="px-2" title="View">
                          <Eye className="h-3 w-3" />
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
                            <Button
                              size="sm"
                              onClick={() => handleDownload(image)}
                              className="bg-background/80 hover:bg-background"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                            <h3 className="text-white font-medium">{image.title}</h3>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(image)}
                      className="px-2"
                      title="Edit"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => toggleVisibility(image)}
                      className="px-2"
                      title={image.is_public ? "Make Private" : "Make Public"}
                    >
                      {image.is_public ? <Lock className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDelete(image)}
                      className="px-2"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Grid view for public gallery
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {imagesToRender.map((image) => (
            <Card key={image.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className={`${isPrivate ? 'p-3' : 'p-4'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-medium truncate ${isPrivate ? 'text-sm' : ''}`}>{image.title}</h3>
                  <Badge variant={image.is_public ? "default" : "secondary"} className="text-xs">
                    {image.is_public ? "Public" : "Private"}
                  </Badge>
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
                        title="Edit"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toggleVisibility(image)}
                        className="px-2"
                        title={image.is_public ? "Make Private" : "Make Public"}
                      >
                        {image.is_public ? <Lock className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                      <Button
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDelete(image)}
                        className="px-2"
                        title="Delete"
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
                    View all uploaded images
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full group-hover:bg-primary/90" 
                    onClick={() => setView('public')}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Gallery
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 bg-red-100 rounded-full w-fit mb-2">
                    <Lock className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-xl">Admin Panel</CardTitle>
                  <CardDescription>
                    Manage images with full admin access - upload, edit, delete, and control visibility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-muted" 
                    onClick={() => setView('private')}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Admin Access
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
                      Admin Panel
                    </>
                  )}
                </h1>
                <p className="text-muted-foreground">
                  {view === 'public' 
                    ? 'View all uploaded images from the gallery' 
                    : 'Admin panel - manage all images with upload, edit, delete and visibility controls'
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
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;