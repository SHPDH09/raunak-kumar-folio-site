-- Add caption and share_count to images table
ALTER TABLE public.images 
ADD COLUMN IF NOT EXISTS caption text,
ADD COLUMN IF NOT EXISTS share_count integer DEFAULT 0;

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_id uuid NOT NULL REFERENCES public.images(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Comments policies
CREATE POLICY "Anyone can view comments on public images"
ON public.comments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.images
    WHERE images.id = comments.image_id AND images.is_public = true
  )
);

CREATE POLICY "Authenticated users can create comments"
ON public.comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
ON public.comments FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
ON public.comments FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all comments"
ON public.comments FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create likes table
CREATE TABLE IF NOT EXISTS public.likes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_id uuid NOT NULL REFERENCES public.images(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(image_id, user_id)
);

-- Enable RLS on likes
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Likes policies
CREATE POLICY "Anyone can view likes on public images"
ON public.likes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.images
    WHERE images.id = likes.image_id AND images.is_public = true
  )
);

CREATE POLICY "Authenticated users can like images"
ON public.likes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike (delete their likes)"
ON public.likes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Add trigger for updated_at on comments
CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.likes;