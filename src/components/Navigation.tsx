import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  };

  const navItems = [
    { name: 'Home', id: 'hero' },
    { name: 'About', id: 'about' },
    { name: 'Projects', id: 'projects' },
    { name: 'Experience', id: 'experience' },
    { name: 'Certifications', id: 'certifications' },
    { name: 'Applications', id: 'applications' },
    { name: 'Contact', id: 'contact' }
  ];

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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-foreground hover:text-primary transition-smooth font-medium"
              >
                {item.name}
              </button>
            ))}
            <div className="flex items-center space-x-3 ml-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 transition-smooth"
                  >
                    Resume
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-full h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Resume Preview</DialogTitle>
                    <DialogDescription>
                      View and download my complete resume
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex-1 w-full h-full">
                    <iframe
                      src="/RAUNAK KUMAR.pdf"
                      className="w-full h-full border-0"
                      title="Resume Preview"
                    />
                  </div>
                </DialogContent>
              </Dialog>
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
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-foreground hover:text-primary hover:bg-muted/50 transition-smooth"
                >
                  {item.name}
                </button>
              ))}
              <div className="px-4 sm:px-6 py-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="w-full bg-primary hover:bg-primary/90 transition-smooth"
                    >
                      Resume
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl w-full h-[90vh]">
                    <DialogHeader>
                      <DialogTitle>Resume Preview</DialogTitle>
                      <DialogDescription>
                        View and download my complete resume
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 w-full h-full">
                      <iframe
                        src="/RAUNAK KUMAR.pdf"
                        className="w-full h-full border-0"
                        title="Resume Preview"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;