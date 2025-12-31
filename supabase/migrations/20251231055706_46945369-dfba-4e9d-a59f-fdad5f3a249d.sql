-- Create greeting types enum
CREATE TYPE public.greeting_type AS ENUM (
  'birthday',
  'new_year',
  'anniversary',
  'congratulations',
  'thank_you',
  'happiness',
  'get_well',
  'wedding'
);

-- Create greetings table
CREATE TABLE public.greetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  recipient_name TEXT NOT NULL,
  sender_name TEXT,
  date_of_birth DATE,
  phone TEXT,
  email TEXT,
  greeting_type greeting_type NOT NULL,
  custom_message TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  views_count INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.greetings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view non-expired greetings by code (for public access)
CREATE POLICY "Anyone can view non-expired greetings"
ON public.greetings
FOR SELECT
USING (expires_at > now());

-- Policy: Only admins can create greetings
CREATE POLICY "Admins can create greetings"
ON public.greetings
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Only admins can update greetings
CREATE POLICY "Admins can update greetings"
ON public.greetings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Only admins can delete greetings
CREATE POLICY "Admins can delete greetings"
ON public.greetings
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster code lookups
CREATE INDEX idx_greetings_code ON public.greetings(code);

-- Create index for expiration checks
CREATE INDEX idx_greetings_expires_at ON public.greetings(expires_at);