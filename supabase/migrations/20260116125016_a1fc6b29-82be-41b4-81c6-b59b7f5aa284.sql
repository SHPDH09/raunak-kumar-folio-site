-- Create table for semester-wise academic grades
CREATE TABLE public.portfolio_semester_grades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  semester INTEGER NOT NULL,
  sgpa DECIMAL(4,2) NOT NULL,
  cgpa DECIMAL(4,2) NOT NULL,
  year TEXT,
  status TEXT DEFAULT 'completed',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio_semester_grades ENABLE ROW LEVEL SECURITY;

-- Anyone can view semester grades
CREATE POLICY "Anyone can view portfolio semester grades"
  ON public.portfolio_semester_grades
  FOR SELECT
  USING (true);

-- Admins can manage semester grades
CREATE POLICY "Admins can manage portfolio semester grades"
  ON public.portfolio_semester_grades
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));