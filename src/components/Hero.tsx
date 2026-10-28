import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Github, Linkedin, Mail, Brain, Sparkles, ArrowRight, GraduationCap, FolderGit2, TrendingUp } from 'lucide-react';
import DataAnalytics3D from './DataAnalytics3D';

const AI_LLM_PROJECT_COUNT = 4; // Subject Tutor AI, AI Startup Idea Validator, Data Navigator AI, AI Data Analyzer

const HERO_STATS = [
  { icon: FolderGit2, value: `${AI_LLM_PROJECT_COUNT}`, label: 'AI / LLM Projects' },
  { icon: TrendingUp, value: '8.80', label: 'Current CGPA' },
  { icon: GraduationCap, value: '5 / 6', label: 'Semesters Done' },
];

const SOCIALS = [
  { href: 'https://github.com/SHPDH09', icon: Github, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/raunak-kumar-766328248/', icon: Linkedin, label: 'LinkedIn' },
];

const Hero = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = "AI & ML Developer | Data Analyst | Data Visualization";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center relative overflow-hidden hero-gradient"
    >
      {/* 3D Animated Data Analytics Background */}
      <DataAnalytics3D />

      {/* Subtle engineering grid */}
      <div className="pointer-events-none absolute inset-0 hero-grid" aria-hidden="true" />

      {/* Branded glow accents */}
      <div className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 size-[28rem] rounded-full bg-accent/15 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
        <div className="animate-fade-in">
          {/* Brand mark */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[var(--neon-gradient)] blur-md opacity-60 scale-110" />
              <img
                src="/lovable-uploads/9d0cc340-cedb-4c57-8e0f-bdd49a77d90d.png"
                alt="Raunak Kumar brand mark"
                className="relative size-20 sm:size-24 rounded-full object-contain ring-2 ring-primary/50 shadow-glow"
                width={512}
                height={512}
              />
            </div>
          </div>

          {/* Live status pill */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-border/70 bg-card/50 backdrop-blur-md px-4 py-1.5 mb-6 text-xs sm:text-sm text-muted-foreground">
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full size-2 bg-emerald-400" />
            </span>
            <span>
              Currently working as <span className="text-foreground font-medium">Associate Analyst @ Aspect Vision</span>
            </span>
          </div>

          {/* Name */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 font-display tracking-tight">
            Raunak <span className="text-gradient">Kumar</span>
          </h1>

          {/* Typing line */}
          <div className="h-10 sm:h-12 mb-5">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground/85 font-mono tracking-tight">
              {typedText}
              <span className="animate-pulse border-r-2 border-accent ml-1"></span>
            </p>
          </div>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            BCA student specializing in <span className="text-gradient font-semibold">Artificial Intelligence &amp; Data Analytics</span> at LNCT University — building intelligent solutions that turn data into decisions.
          </p>

          {/* AI/LLM Projects Badge */}
          <div className="flex justify-center mb-9">
            <Badge
              className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-violet-500/15 to-accent/15 border border-primary/40 text-foreground hover:border-primary hover:shadow-neon transition-smooth cursor-pointer rounded-full"
              onClick={() => scrollToSection('projects')}
            >
              <Brain className="w-4 h-4 mr-2 text-primary" />
              <span className="font-semibold">{AI_LLM_PROJECT_COUNT} AI/LLM Projects</span>
              <Sparkles className="w-4 h-4 ml-2 text-accent" />
            </Badge>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <Button
              variant="hero"
              size="lg"
              className="px-8 py-6 text-lg font-semibold hover-neon group"
              onClick={() => scrollToSection('about')}
            >
              About Me
              <ArrowRight className="size-5 ml-2 transition-smooth group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-accent/50 text-accent hover:bg-accent/10 hover:border-accent transition-smooth px-8 py-6 text-lg hover-neon"
              onClick={() => scrollToSection('projects')}
            >
              View Projects
            </Button>
          </div>

          {/* Stats strip */}
          <div className="mx-auto mb-10 max-w-xl grid grid-cols-3 divide-x divide-border/60 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md shadow-card overflow-hidden">
            {HERO_STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="px-2 sm:px-6 py-4 sm:py-5 text-center">
                <Icon className="size-4 sm:size-5 mx-auto mb-1.5 text-accent" aria-hidden="true" />
                <div className="text-lg sm:text-2xl font-bold font-display leading-none">{value}</div>
                <div className="mt-1.5 text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground leading-tight">
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Socials */}
          <div className="flex justify-center gap-5">
            {SOCIALS.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="size-12 rounded-full border border-border bg-card/40 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/60 hover:shadow-glow hover:-translate-y-1 transition-smooth"
              >
                <Icon size={22} />
              </a>
            ))}
            <a
              href="#contact"
              aria-label="Email"
              className="size-12 rounded-full border border-border bg-card/40 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/60 hover:shadow-glow hover:-translate-y-1 transition-smooth"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }}
            >
              <Mail size={22} />
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button
          onClick={() => scrollToSection('about')}
          aria-label="Scroll to about section"
          className="text-muted-foreground hover:text-accent transition-smooth hover-neon p-3 rounded-full border border-transparent hover:border-accent/40"
        >
          <ChevronDown size={32} />
        </button>
      </div>
    </section>
  );
};

export default Hero;
