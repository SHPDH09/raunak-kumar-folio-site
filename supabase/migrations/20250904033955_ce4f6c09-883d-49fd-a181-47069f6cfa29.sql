-- Secure RLS for password_resets to prevent token leakage
-- 1) Ensure RLS is enabled
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;

-- 2) Drop overly permissive policies
DROP POLICY IF EXISTS "Enable select for password resets" ON public.password_resets;
DROP POLICY IF EXISTS "Enable update for password resets" ON public.password_resets;

-- (Optional) ensure no permissive delete policy exists; none was defined, so we add a secure one

-- 3) Create secure policies allowing only service_role to read/update/delete
CREATE POLICY "Only service role can select password resets"
ON public.password_resets
FOR SELECT
USING (auth.role() = 'service_role');

CREATE POLICY "Only service role can update password resets"
ON public.password_resets
FOR UPDATE
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Only service role can delete password resets"
ON public.password_resets
FOR DELETE
USING (auth.role() = 'service_role');

-- Note: We keep the existing INSERT policy as-is to avoid breaking existing flows.
-- Best practice is to route inserts through an Edge Function using the service role.
