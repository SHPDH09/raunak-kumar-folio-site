import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. I'll get back to you soon!",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: "rk331159@gmail.com",
      link: "mailto:rk331159@gmail.com"
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Phone",
      value: "+91 6206158459",
      link: "tel:+916206158459"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Location",
      value: "India",
      link: null
    }
  ];

  const socialLinks = [
    {
      name: "GitHub",
      icon: <Github className="w-5 h-5" />,
      url: "https://github.com/SHPDH09",
      color: "hover:text-gray-800"
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      url: "https://www.linkedin.com/in/raunak-kumar-766328248/",
      color: "hover:text-blue-600"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let's discuss opportunities, collaborations, or just have a chat about technology
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="card-gradient shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-foreground">
                Send a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="transition-smooth focus:shadow-glow"
                    />
                  </div>
                  <div>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="transition-smooth focus:shadow-glow"
                    />
                  </div>
                </div>
                
                <Input
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="transition-smooth focus:shadow-glow"
                />
                
                <Textarea
                  name="message"
                  placeholder="Your Message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="transition-smooth focus:shadow-glow resize-none"
                />
                
                <Button 
                  type="submit" 
                  className="w-full py-6 text-lg font-semibold hover:shadow-glow"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="card-gradient shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-foreground">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                      {info.icon}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{info.label}</p>
                      {info.link ? (
                        <a 
                          href={info.link} 
                          className="text-muted-foreground hover:text-primary transition-smooth"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="card-gradient shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-foreground">
                  Connect & Download
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Social Media</h4>
                  <div className="flex space-x-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 bg-muted rounded-lg text-muted-foreground transition-smooth hover:scale-110 ${social.color}`}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Download Resume</h4>
                  <a 
  href="/RAUNAK KUMAR.pdf" 
  download 
  className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-medium border rounded-md bg-background hover:bg-accent transition-all">
 


                  <Button variant="outline" className="w-full">
                    <Download className="w-5 h-5 mr-2" />
                    Download CV/Resume
                  </Button>
                    </a>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Current Status</h4>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Available for Opportunities
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
