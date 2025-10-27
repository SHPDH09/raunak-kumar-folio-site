-- Fix 1: Make user_id NOT NULL in images table
-- This prevents privilege escalation by ensuring all images have ownership
ALTER TABLE public.images 
ALTER COLUMN user_id SET NOT NULL;

-- Fix 2: Secure storage bucket - Make it private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'images';

-- Fix 3: Drop permissive storage policies
DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Public images are accessible" ON storage.objects;

-- Fix 4: Create authenticated storage policies with user ownership checks
-- Users upload to their own folder: {user_id}/{filename}
CREATE POLICY "Authenticated users can upload their images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow reading own images + public images (based on images table)
CREATE POLICY "Users can read their own and public images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'images' AND
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM public.images
      WHERE file_path = name AND is_public = true
    )
  )
);