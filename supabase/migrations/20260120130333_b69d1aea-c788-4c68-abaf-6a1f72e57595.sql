-- Create table for education marks (10th, 12th, etc.)
CREATE TABLE public.portfolio_education_marks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  education_type TEXT NOT NULL, -- '10th', '12th', 'graduation'
  board TEXT,
  school_name TEXT,
  passing_year TEXT,
  overall_percentage NUMERIC(5,2),
  overall_grade TEXT,
  stream TEXT, -- For 12th (Science, Commerce, Arts)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for subject-wise marks
CREATE TABLE public.portfolio_subject_marks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  education_marks_id UUID REFERENCES public.portfolio_education_marks(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL,
  max_marks INTEGER DEFAULT 100,
  obtained_marks INTEGER,
  grade TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio_education_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_subject_marks ENABLE ROW LEVEL SECURITY;

-- Public read access for portfolio
CREATE POLICY "Public can view education marks" 
ON public.portfolio_education_marks FOR SELECT USING (true);

CREATE POLICY "Public can view subject marks" 
ON public.portfolio_subject_marks FOR SELECT USING (true);

-- Admin can manage (using has_role function)
CREATE POLICY "Admins can manage education marks" 
ON public.portfolio_education_marks FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage subject marks" 
ON public.portfolio_subject_marks FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Insert sample data for 10th class
INSERT INTO public.portfolio_education_marks (education_type, board, school_name, passing_year, overall_percentage, overall_grade, stream)
VALUES ('10th', 'CBSE', 'Kendriya Vidyalaya', '2019', 81.0, 'A+', NULL);

-- Get the ID for 10th marks
WITH tenth_id AS (
  SELECT id FROM public.portfolio_education_marks WHERE education_type = '10th' LIMIT 1
)
INSERT INTO public.portfolio_subject_marks (education_marks_id, subject_name, max_marks, obtained_marks, grade, display_order)
SELECT id, subject_name, max_marks, obtained_marks, grade, display_order FROM tenth_id,
(VALUES 
  ('English', 100, 78, 'B+', 1),
  ('Hindi', 100, 85, 'A', 2),
  ('Mathematics', 100, 82, 'A', 3),
  ('Science', 100, 80, 'A', 4),
  ('Social Science', 100, 80, 'A', 5)
) AS v(subject_name, max_marks, obtained_marks, grade, display_order);

-- Insert sample data for 12th class
INSERT INTO public.portfolio_education_marks (education_type, board, school_name, passing_year, overall_percentage, overall_grade, stream)
VALUES ('12th', 'CBSE', 'Kendriya Vidyalaya', '2021', 72.4, 'B+', 'Science (PCM)');

-- Get the ID for 12th marks
WITH twelfth_id AS (
  SELECT id FROM public.portfolio_education_marks WHERE education_type = '12th' LIMIT 1
)
INSERT INTO public.portfolio_subject_marks (education_marks_id, subject_name, max_marks, obtained_marks, grade, display_order)
SELECT id, subject_name, max_marks, obtained_marks, grade, display_order FROM twelfth_id,
(VALUES 
  ('English', 100, 75, 'B+', 1),
  ('Physics', 100, 68, 'B', 2),
  ('Chemistry', 100, 70, 'B+', 3),
  ('Mathematics', 100, 74, 'B+', 4),
  ('Computer Science', 100, 75, 'B+', 5)
) AS v(subject_name, max_marks, obtained_marks, grade, display_order);