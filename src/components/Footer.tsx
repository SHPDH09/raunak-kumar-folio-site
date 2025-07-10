import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "GitHub",
      icon: <Github className="w-5 h-5" />,
      url: "https://github.com/SHPDH09"
    },
    {
      name: "LinkedIn", 
      icon: <Linkedin className="w-5 h-5" />,
      url: "https://www.linkedin.com/in/raunak-kumar-766328248/"
    },
    {
      name: "Email",
      icon: <Mail className="w-5 h-5" />,
      url: "rk331159@gmail.com"
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-8">
          {/* Logo and Tagline */}
          <div>
            <button 
              onClick={scrollToTop}
              className="text-3xl font-bold mb-2 hover:scale-105 transition-smooth"
            >
              Raunak Kumar
            </button>
            <p className="text-primary-foreground/80">
              AI & ML Developer | Building the Future with Intelligence
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target={social.name !== "Email" ? "_blank" : undefined}
                rel={social.name !== "Email" ? "noopener noreferrer" : undefined}
                className="p-3 bg-primary-foreground/10 rounded-lg hover:bg-primary-foreground/20 transition-smooth hover:scale-110"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Quick Links */}
          <div className="flex justify-center space-x-8 text-sm">
            <button 
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-accent transition-smooth"
            >
              About
            </button>
            <button 
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-accent transition-smooth"
            >
              Projects
            </button>
            <button 
              onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-accent transition-smooth"
            >
              Experience
            </button>
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-accent transition-smooth"
            >
              Contact
            </button>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-primary-foreground/20">
            <p className="flex items-center justify-center text-sm text-primary-foreground/60">
              © {currentYear} Raunak Kumar. Made with{' '}
              <Heart className="w-4 h-4 mx-1 text-red-400" fill="currentColor" />
              and lots of coffee.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
