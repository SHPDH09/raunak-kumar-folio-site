-- Create table for personal details/about section
CREATE TABLE public.portfolio_about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tagline TEXT,
  date_of_birth DATE,
  education TEXT,
  university TEXT,
  location TEXT,
  bio TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for programming skills
CREATE TABLE public.portfolio_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('programming', 'framework', 'learning')),
  proficiency INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for projects
CREATE TABLE public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  image_url TEXT,
  github_url TEXT,
  demo_url TEXT,
  tech_stack TEXT[],
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for experience/education
CREATE TABLE public.portfolio_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('work', 'education')),
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  location TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for certifications
CREATE TABLE public.portfolio_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT,
  issue_date DATE,
  credential_url TEXT,
  badge_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for soft skills
CREATE TABLE public.portfolio_soft_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for achievements
CREATE TABLE public.portfolio_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date_achieved DATE,
  badge_text TEXT,
  details JSONB,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for publications
CREATE TABLE public.portfolio_publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  authors TEXT[],
  publication_venue TEXT,
  publication_date DATE,
  abstract TEXT,
  doi_url TEXT,
  pdf_url TEXT,
  status TEXT DEFAULT 'published',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for applications
CREATE TABLE public.portfolio_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  live_url TEXT,
  tech_stack TEXT[],
  features TEXT[],
  icon_name TEXT,
  color TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for contact/social links
CREATE TABLE public.portfolio_social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for contact info
CREATE TABLE public.portfolio_contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.portfolio_about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_soft_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_contact ENABLE ROW LEVEL SECURITY;

-- Public read access for all portfolio tables (public portfolio)
CREATE POLICY "Anyone can view portfolio about" ON public.portfolio_about FOR SELECT USING (true);
CREATE POLICY "Anyone can view portfolio skills" ON public.portfolio_skills FOR SELECT USING (true);
CREATE POLICY "Anyone can view portfolio projects" ON public.portfolio_projects FOR SELECT USING (true);
CREATE POLICY "Anyone can view portfolio experience" ON public.portfolio_experience FOR SELECT USING (true);
CREATE POLICY "Anyone can view portfolio certifications" ON public.portfolio_certifications FOR SELECT USING (true);
CREATE POLICY "Anyone can view portfolio soft skills" ON public.portfolio_soft_skills FOR SELECT USING (true);
CREATE POLICY "Anyone can view portfolio achievements" ON public.portfolio_achievements FOR SELECT USING (true);
CREATE POLICY "Anyone can view portfolio publications" ON public.portfolio_publications FOR SELECT USING (true);
CREATE POLICY "Anyone can view portfolio applications" ON public.portfolio_applications FOR SELECT USING (true);
CREATE POLICY "Anyone can view portfolio social links" ON public.portfolio_social_links FOR SELECT USING (true);
CREATE POLICY "Anyone can view portfolio contact" ON public.portfolio_contact FOR SELECT USING (true);

-- Admin write access for all portfolio tables
CREATE POLICY "Admins can manage portfolio about" ON public.portfolio_about FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage portfolio skills" ON public.portfolio_skills FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage portfolio projects" ON public.portfolio_projects FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage portfolio experience" ON public.portfolio_experience FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage portfolio certifications" ON public.portfolio_certifications FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage portfolio soft skills" ON public.portfolio_soft_skills FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage portfolio achievements" ON public.portfolio_achievements FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage portfolio publications" ON public.portfolio_publications FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage portfolio applications" ON public.portfolio_applications FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage portfolio social links" ON public.portfolio_social_links FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage portfolio contact" ON public.portfolio_contact FOR ALL USING (public.has_role(auth.uid(), 'admin'));