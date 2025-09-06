-- Create LeetCode stats table
CREATE TABLE public.leetcode_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  total_solved INTEGER NOT NULL DEFAULT 0,
  ranking INTEGER,
  contest_rating INTEGER DEFAULT 0,
  acceptance_rate DECIMAL(5,2) DEFAULT 0,
  streak INTEGER DEFAULT 0,
  easy_solved INTEGER DEFAULT 0,
  medium_solved INTEGER DEFAULT 0,
  hard_solved INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create LeetCode submissions table
CREATE TABLE public.leetcode_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  problem_name TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  status TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create LeetCode monthly progress table
CREATE TABLE public.leetcode_monthly_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  problems_solved INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(username, month, year)
);

-- Create LeetCode topic progress table
CREATE TABLE public.leetcode_topic_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  topic_name TEXT NOT NULL,
  solved INTEGER DEFAULT 0,
  total_problems INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(username, topic_name)
);

-- Enable Row Level Security
ALTER TABLE public.leetcode_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leetcode_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leetcode_monthly_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leetcode_topic_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is portfolio data)
CREATE POLICY "Allow public read access to leetcode_stats" 
ON public.leetcode_stats FOR SELECT USING (true);

CREATE POLICY "Allow public read access to leetcode_submissions" 
ON public.leetcode_submissions FOR SELECT USING (true);

CREATE POLICY "Allow public read access to leetcode_monthly_progress" 
ON public.leetcode_monthly_progress FOR SELECT USING (true);

CREATE POLICY "Allow public read access to leetcode_topic_progress" 
ON public.leetcode_topic_progress FOR SELECT USING (true);

-- Allow service role to manage all data
CREATE POLICY "Service role can manage leetcode_stats" 
ON public.leetcode_stats FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage leetcode_submissions" 
ON public.leetcode_submissions FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage leetcode_monthly_progress" 
ON public.leetcode_monthly_progress FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage leetcode_topic_progress" 
ON public.leetcode_topic_progress FOR ALL USING (auth.role() = 'service_role');

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_leetcode_stats_updated_at
  BEFORE UPDATE ON public.leetcode_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leetcode_topic_progress_updated_at
  BEFORE UPDATE ON public.leetcode_topic_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();