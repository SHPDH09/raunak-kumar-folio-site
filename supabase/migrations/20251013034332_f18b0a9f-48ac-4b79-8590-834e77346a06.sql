-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create images table for the image gallery feature
CREATE TABLE public.images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to public images
CREATE POLICY "Anyone can view public images"
ON public.images
FOR SELECT
USING (is_public = true);

-- Create policy for all images to be viewable
CREATE POLICY "All images viewable"
ON public.images
FOR SELECT
USING (true);

-- Create policy for inserting images
CREATE POLICY "Anyone can insert images"
ON public.images
FOR INSERT
WITH CHECK (true);

-- Create policy for updating images
CREATE POLICY "Anyone can update images"
ON public.images
FOR UPDATE
USING (true);

-- Create policy for deleting images
CREATE POLICY "Anyone can delete images"
ON public.images
FOR DELETE
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_images_updated_at
BEFORE UPDATE ON public.images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for image uploads
CREATE POLICY "Public images are accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "Anyone can upload images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Anyone can update images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'images');

CREATE POLICY "Anyone can delete images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'images');