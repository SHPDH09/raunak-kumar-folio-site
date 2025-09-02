import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import OTPVerification from '@/components/OTPVerification';
import { Eye, Lock, Upload, Image as ImageIcon, Edit, Trash2, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const ImageGallery = () => {
  const [view, setView] = useState<'menu' | 'public' | 'private'>('menu');
  const [isVerified, setIsVerified] = useState(false);
  const [images, setImages] = useState([
    { id: 1, url: '/lovable-uploads/9d0cc340-cedb-4c57-8e0f-bdd49a77d90d.png', title: 'Sample Image 1' },
    { id: 2, url: '/lovable-uploads/a40bf5f4-14e7-48e5-9e6a-1363bb767db7.png', title: 'Sample Image 2' },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        // Create a local URL for preview
        const imageUrl = URL.createObjectURL(file);
        const newImage = {
          id: Date.now(),
          url: imageUrl,
          title: file.name
        };
        setImages(prev => [...prev, newImage]);
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Please select an image file');
      }
    }
  };

  const handleDelete = (imageId: number) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
    toast.success('Image deleted successfully!');
  };

  const handleEdit = (imageId: number) => {
    const newTitle = prompt('Enter new title:');
    if (newTitle) {
      setImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, title: newTitle } : img
      ));
      toast.success('Image title updated!');
    }
  };

  if (view === 'private' && !isVerified) {
    return <OTPVerification onVerified={() => setIsVerified(true)} />;
  }

  const renderImageGrid = (imagesToRender: typeof images, isPrivate = false) => (
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
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium truncate">{image.title}</h3>
              {isPrivate && <Badge variant="secondary">Private</Badge>}
            </div>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline" className="flex-1">
                View
              </Button>
              {isPrivate && (
                <>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEdit(image.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDelete(image.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      {isPrivate && (
        <Card 
          className="group border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
            <div className="p-4 bg-muted rounded-full mb-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">Upload New Image</h3>
            <p className="text-sm text-muted-foreground">
              Click to upload images from your device
            </p>
          </CardContent>
        </Card>
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