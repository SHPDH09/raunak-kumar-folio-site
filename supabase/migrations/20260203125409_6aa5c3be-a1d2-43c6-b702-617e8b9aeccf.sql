-- Create a trigger to prevent users from modifying protected profile fields
-- Only admins can change is_verified, followers_count, and following_count

CREATE OR REPLACE FUNCTION prevent_profile_tampering()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user is admin
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    -- Prevent changes to protected fields by reverting to old values
    NEW.is_verified := OLD.is_verified;
    NEW.followers_count := OLD.followers_count;
    NEW.following_count := OLD.following_count;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for profile security enforcement
DROP TRIGGER IF EXISTS enforce_profile_security ON public.profiles;
CREATE TRIGGER enforce_profile_security
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION prevent_profile_tampering();