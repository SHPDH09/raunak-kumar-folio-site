
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Image, Wrench, Download, Loader2, Gift, Home, User, Briefcase, Award, BookOpen, Mail, Settings, LogIn, FolderOpen, Cpu } from 'lucide-react';
import { generatePortfolioPDF } from '@/utils/generatePortfolioPDF';
import { useToast } from '@/hooks/use-toast';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRadialMenuOpen, setIsRadialMenuOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
    setIsRadialMenuOpen(false);
  };

  const radialMenuItems = [
    { name: 'Home', id: 'hero', icon: Home, color: 'bg-blue-500' },
    { name: 'About', id: 'about', icon: User, color: 'bg-green-500' },
    { name: 'Projects', id: 'projects', icon: FolderOpen, color: 'bg-purple-500' },
    { name: 'Experience', id: 'experience', icon: Briefcase, color: 'bg-orange-500' },
    { name: 'Certifications', id: 'certifications', icon: Award, color: 'bg-pink-500' },
    { name: 'Publications', id: 'publications', icon: BookOpen, color: 'bg-cyan-500' },
    { name: 'Applications', id: 'applications', icon: Cpu, color: 'bg-indigo-500' },
    { name: 'Contact', id: 'contact', icon: Mail, color: 'bg-red-500' },
    { name: 'Tools', href: '/tools', icon: Wrench, color: 'bg-yellow-500' },
    { name: 'Gallery', href: '/gallery', icon: Image, color: 'bg-teal-500' },
    { name: 'Greetings', href: '/greetings', icon: Gift, color: 'bg-rose-500' },
    { name: 'Login', href: '/auth', icon: LogIn, color: 'bg-slate-500' },
  ];

  const handleDownloadPortfolio = async () => {
    setIsGenerating(true);
    setIsRadialMenuOpen(false);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      generatePortfolioPDF();
      toast({
        title: "Portfolio Downloaded!",
        description: "Your portfolio PDF has been generated and downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRadialItemClick = (item: typeof radialMenuItems[0]) => {
    if (item.href) {
      window.location.href = item.href;
    } else if (item.id) {
      scrollToSection(item.id);
    }
    setIsRadialMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
      isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-elegant' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <button 
            onClick={() => scrollToSection('hero')}
            className="hover:scale-105 transition-smooth"
          >
            <img 
              src="/lovable-uploads/9d0cc340-cedb-4c57-8e0f-bdd49a77d90d.png" 
              alt="Portfolio Logo" 
              className="h-10 w-10 object-contain rounded-full opacity-80"
            />
          </button>

          {/* Desktop - 360° Radial Menu Toggle */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              {/* Main Toggle Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsRadialMenuOpen(!isRadialMenuOpen)}
                className={`relative z-50 w-12 h-12 rounded-full transition-all duration-300 ${
                  isRadialMenuOpen 
                    ? 'bg-primary text-primary-foreground rotate-180' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {isRadialMenuOpen ? <X className="h-6 w-6" /> : <Settings className="h-6 w-6" />}
              </Button>

              {/* Radial Menu Items */}
              {radialMenuItems.map((item, index) => {
                const totalItems = radialMenuItems.length + 1; // +1 for download button
                const angle = (index * 360) / totalItems - 90; // Start from top
                const radius = 120;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;

                return (
                  <button
                    key={item.name}
                    onClick={() => handleRadialItemClick(item)}
                    className={`absolute w-10 h-10 rounded-full ${item.color} text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                      isRadialMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                    }`}
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: isRadialMenuOpen 
                        ? `translate(-50%, -50%) translate(${x}px, ${y}px)` 
                        : 'translate(-50%, -50%)',
                      transitionDelay: isRadialMenuOpen ? `${index * 30}ms` : '0ms',
                    }}
                    title={item.name}
                  >
                    <item.icon className="h-5 w-5" />
                  </button>
                );
              })}

              {/* Download Portfolio Button in Radial */}
              {(() => {
                const index = radialMenuItems.length;
                const totalItems = radialMenuItems.length + 1;
                const angle = (index * 360) / totalItems - 90;
                const radius = 120;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;

                return (
                  <button
                    onClick={handleDownloadPortfolio}
                    disabled={isGenerating}
                    className={`absolute w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                      isRadialMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                    }`}
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: isRadialMenuOpen 
                        ? `translate(-50%, -50%) translate(${x}px, ${y}px)` 
                        : 'translate(-50%, -50%)',
                      transitionDelay: isRadialMenuOpen ? `${index * 30}ms` : '0ms',
                    }}
                    title="Download Portfolio"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Download className="h-5 w-5" />
                    )}
                  </button>
                );
              })()}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-14 sm:top-16 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border">
            <div className="py-2 sm:py-4 space-y-1">
              {radialMenuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleRadialItemClick(item)}
                  className="block w-full text-left px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-foreground hover:text-primary hover:bg-muted/50 transition-smooth flex items-center gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </button>
              ))}
              <div className="px-4 sm:px-6 py-2 space-y-2">
                <Button
                  size="sm"
                  onClick={handleDownloadPortfolio}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-smooth"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-1" />
                  )}
                  {isGenerating ? 'Generating...' : 'Download Portfolio'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay to close radial menu */}
      {isRadialMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsRadialMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navigation;
