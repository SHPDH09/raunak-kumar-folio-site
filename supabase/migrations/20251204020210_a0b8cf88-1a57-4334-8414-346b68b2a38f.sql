-- Add unique constraint for story_views to support upsert
ALTER TABLE public.story_views 
ADD CONSTRAINT story_views_story_viewer_unique UNIQUE (story_id, viewer_id);