import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Github, Linkedin, Mail } from 'lucide-react';
import DataAnalytics3D from './DataAnalytics3D';

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
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5"
    >
      {/* 3D Animated Data Analytics Background */}
      <DataAnalytics3D />
      
      <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
        <div className="animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 font-inter">
            Hi, I'm <span className="text-neon animate-pulse-neon">Raunak Kumar</span>
          </h1>
          
          <div className="h-12 sm:h-16 mb-6 sm:mb-8">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/90 font-mono min-h-[1.5rem] px-2">
              {typedText}
              <span className="animate-pulse border-r-2 border-accent ml-1"></span>
            </p>
          </div>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            BCA Student specializing in <span className="text-gradient">Artificial Intelligence & Data Analytics</span> at LNCT University. 
            Passionate about building intelligent solutions that make a difference.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              variant="hero"
              size="lg" 
              className="px-8 py-6 text-lg font-semibold hover-neon"
              onClick={() => scrollToSection('about')}
            >
              About Me
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
          
          <div className="flex justify-center space-x-6">
            <a 
              href="https://github.com/SHPDH09" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-smooth hover:scale-110 hover-neon p-3 rounded-full"
            >
              <Github size={28} />
            </a>
            <a 
              href="https://www.linkedin.com/in/raunak-kumar-766328248/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-smooth hover:scale-110 hover-neon p-3 rounded-full"
            >
              <Linkedin size={28} />
            </a>
            <a 
              href="#contact" 
              className="text-muted-foreground hover:text-accent transition-smooth hover:scale-110 hover-neon p-3 rounded-full"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }}
            >
              <Mail size={28} />
            </a>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button 
          onClick={() => scrollToSection('about')}
          className="text-muted-foreground hover:text-accent transition-smooth hover-neon p-3 rounded-full"
        >
          <ChevronDown size={32} />
        </button>
      </div>
    </section>
  );
};

export default Hero;
