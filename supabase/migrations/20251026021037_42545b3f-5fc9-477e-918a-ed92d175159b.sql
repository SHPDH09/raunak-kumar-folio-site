-- Create rate limiting table for OTP requests
CREATE TABLE IF NOT EXISTS public.otp_rate_limits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  attempts integer NOT NULL DEFAULT 1,
  last_attempt timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on rate limits table
ALTER TABLE public.otp_rate_limits ENABLE ROW LEVEL SECURITY;

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_otp_rate_limits_email ON public.otp_rate_limits(email);
CREATE INDEX IF NOT EXISTS idx_otp_rate_limits_last_attempt ON public.otp_rate_limits(last_attempt);

-- Create policy to allow the service role to manage rate limits
CREATE POLICY "Service role can manage rate limits"
ON public.otp_rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Function to clean up old rate limit records (older than 1 hour)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.otp_rate_limits
  WHERE last_attempt < now() - interval '1 hour';
END;
$$;