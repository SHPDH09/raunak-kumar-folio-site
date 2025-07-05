import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Github, Linkedin, Mail } from 'lucide-react';
import heroBackground from '@/assets/hero-bg.jpg';

const Hero = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = "AI & ML Developer | Data Analyst | Java Swing Specialist";
  
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
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(59, 130, 246, 0.8)), url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-white/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-40 w-40 h-40 border border-white/20 rounded-full animate-pulse"></div>
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-inter">
            Hi, I'm <span className="text-accent">Raunak Kumar</span>
          </h1>
          
          <div className="h-16 mb-8">
            <p className="text-xl md:text-2xl text-white/90 font-mono min-h-[2rem]">
              {typedText}
              <span className="animate-pulse border-r-2 border-accent ml-1"></span>
            </p>
          </div>
          
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            BCA Student specializing in Artificial Intelligence & Data Analytics at LNCT University. 
            Passionate about building intelligent solutions that make a difference.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              variant="hero"
              size="lg" 
              className="px-8 py-6 text-lg font-semibold"
              onClick={() => scrollToSection('about')}
            >
              About Me
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 transition-smooth px-8 py-6 text-lg"
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
              className="text-white/70 hover:text-white transition-smooth hover:scale-110"
            >
              <Github size={28} />
            </a>
            <a 
              href="https://www.linkedin.com/in/raunak-kumar-766328248/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-smooth hover:scale-110"
            >
              <Linkedin size={28} />
            </a>
            <a 
              href="#contact" 
              className="text-white/70 hover:text-white transition-smooth hover:scale-110"
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
          className="text-white/70 hover:text-white transition-smooth"
        >
          <ChevronDown size={32} />
        </button>
      </div>
    </section>
  );
};

export default Hero;