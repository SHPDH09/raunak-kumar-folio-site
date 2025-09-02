-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Create images table to store metadata
CREATE TABLE public.images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT true,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- Public images can be viewed by everyone
CREATE POLICY "Public images are viewable by everyone" 
ON public.images 
FOR SELECT 
USING (is_public = true);

-- Private images only viewable by uploader
CREATE POLICY "Private images viewable by uploader only" 
ON public.images 
FOR SELECT 
USING (is_public = false AND uploaded_by = auth.uid());

-- Anyone can upload images (both public and private)
CREATE POLICY "Anyone can upload images" 
ON public.images 
FOR INSERT 
WITH CHECK (true);

-- Only uploader can update their images
CREATE POLICY "Users can update own images" 
ON public.images 
FOR UPDATE 
USING (uploaded_by = auth.uid());

-- Only uploader can delete their images
CREATE POLICY "Users can delete own images" 
ON public.images 
FOR DELETE 
USING (uploaded_by = auth.uid());

-- Storage policies for image uploads
CREATE POLICY "Anyone can view public images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'images');

-- Anyone can upload images
CREATE POLICY "Anyone can upload images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'images');

-- Users can update their own images
CREATE POLICY "Users can update own images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own images
CREATE POLICY "Users can delete own images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add trigger for updating timestamps
CREATE TRIGGER update_images_updated_at
BEFORE UPDATE ON public.images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();