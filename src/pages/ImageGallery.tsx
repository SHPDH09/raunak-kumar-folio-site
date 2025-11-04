import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Eye, Image as ImageIcon, X, Globe, CheckCircle2, Home } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingImage, setViewingImage] = useState<ImageData | null>(null);

  useEffect(() => {
    loadPublicImages();

    // Real-time subscription
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
          loadPublicImages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
      console.error('Error loading public images:', error);
      toast.error('Failed to load images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
              Public Image Gallery
            </h1>
            <p className="text-muted-foreground mt-2">
              Browse all public images
            </p>
          </div>
          
          <Button variant="outline" onClick={() => navigate('/')}>
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No public images yet</p>
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
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    <Globe className="w-3 h-3 mr-1" />
                    Public
                  </Badge>
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
                  {image.profile && (
                    <CardDescription className="text-xs">
                      By: {image.profile.username}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setViewingImage(image)}
                    className="w-full"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* View Image Dialog */}
        <Dialog open={!!viewingImage} onOpenChange={() => setViewingImage(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between pr-8">
                <span className="flex items-center gap-2">
                  {viewingImage?.title}
                  {viewingImage?.profile?.is_verified && (
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  )}
                </span>
              </DialogTitle>
            </DialogHeader>
            {viewingImage && (
              <div className="space-y-4">
                <div className="relative w-full bg-muted rounded-lg overflow-hidden">
                  <img
                    src={viewingImage.url}
                    alt={viewingImage.title}
                    className="w-full h-auto"
                  />
                </div>
                
                {viewingImage.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{viewingImage.description}</p>
                  </div>
                )}
                
                {viewingImage.profile && (
                  <div>
                    <h3 className="font-semibold mb-2">Posted by</h3>
                    <p className="text-muted-foreground flex items-center gap-2">
                      {viewingImage.profile.username}
                      {viewingImage.profile.is_verified && (
                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      )}
                    </p>
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground">
                  Posted on {new Date(viewingImage.created_at).toLocaleDateString()}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ImageGallery;
