-- Create tables for LeetCode statistics
CREATE TABLE IF NOT EXISTS public.leetcode_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  total_solved INTEGER DEFAULT 0,
  easy_solved INTEGER DEFAULT 0,
  medium_solved INTEGER DEFAULT 0,
  hard_solved INTEGER DEFAULT 0,
  ranking INTEGER DEFAULT 0,
  contest_rating INTEGER DEFAULT 0,
  acceptance_rate DECIMAL(5,2) DEFAULT 0,
  streak INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.leetcode_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.leetcode_monthly_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  solved INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(username, year, month)
);

CREATE TABLE IF NOT EXISTS public.leetcode_topic_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  topic TEXT NOT NULL,
  solved INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(username, topic)
);

-- Enable RLS
ALTER TABLE public.leetcode_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leetcode_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leetcode_monthly_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leetcode_topic_progress ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access to leetcode_stats"
  ON public.leetcode_stats FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to leetcode_submissions"
  ON public.leetcode_submissions FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to leetcode_monthly_progress"
  ON public.leetcode_monthly_progress FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to leetcode_topic_progress"
  ON public.leetcode_topic_progress FOR SELECT
  USING (true);

-- Enable pg_cron extension for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the LeetCode stats update to run every 6 hours
SELECT cron.schedule(
  'update-leetcode-stats-job',
  '0 */6 * * *', -- Every 6 hours
  $$
  SELECT
    net.http_post(
      url:='https://eewotqwrtxcndvoehkrr.supabase.co/functions/v1/update-leetcode-stats',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVld290cXdydHhjbmR2b2Voa3JyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTExOTgsImV4cCI6MjA3NTE2NzE5OH0.yN_CnUft3YlGheXsvYsNRnl1F6FzJCv7CYIjjW9p_Hs"}'::jsonb,
      body:='{"username": "RAUNAK9025"}'::jsonb
    ) as request_id;
  $$
);