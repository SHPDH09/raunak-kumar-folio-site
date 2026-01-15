import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email too long"),
  subject: z.string()
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject must be less than 200 characters"),
  message: z.string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters")
});

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon_name: string;
}

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load contact info
      const { data: contact } = await supabase
        .from('portfolio_contact')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (contact) {
        setContactInfo(contact as ContactInfo);
      }

      // Load social links
      const { data: links } = await supabase
        .from('portfolio_social_links')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (links) {
        setSocialLinks(links as SocialLink[]);
      }
    } catch (error) {
      console.error('Error loading contact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      toast({
        title: "Validation Error",
        description: result.error.errors[0].message,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const validatedData = result.data;
      
      await fetch("https://script.google.com/macros/s/AKfycbw2X2jvtkjjAqUNtCb5u-6rnhBG-bGRZxKFharxOaSZ4YrFvc16ELzq687z4h_GXY8NNQ/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out 📧. Your message has been sent.",
      });

      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error("[Internal] Contact form error:", error);
      toast({
        title: "Error!",
        description: "Could not send message. Please try again later.",
        variant: "destructive"
      });
    }

    setIsSubmitting(false);
  };

  const getSocialIcon = (platform: string) => {
    const icons: Record<string, JSX.Element> = {
      GitHub: <Github className="w-5 h-5" />,
      LinkedIn: <Linkedin className="w-5 h-5" />
    };
    return icons[platform] || <Github className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <section id="contact" className="py-20 bg-muted/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

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
                {contactInfo?.email && (
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <a 
                        href={`mailto:${contactInfo.email}`}
                        className="text-muted-foreground hover:text-primary transition-smooth"
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {contactInfo?.phone && (
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Phone</p>
                      <a 
                        href={`tel:${contactInfo.phone}`}
                        className="text-muted-foreground hover:text-primary transition-smooth"
                      >
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {contactInfo?.address && (
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Location</p>
                      <p className="text-muted-foreground">{contactInfo.address}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="card-gradient shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-foreground">
                  Connect & Download
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {socialLinks.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Social Media</h4>
                    <div className="flex space-x-4">
                      {socialLinks.map((social) => (
                        <a
                          key={social.id}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-muted rounded-lg text-muted-foreground transition-smooth hover:scale-110 hover:text-primary"
                        >
                          {getSocialIcon(social.platform)}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Download Resume</h4>
                  <a 
                    href="/RAUNAK KUMAR.pdf" 
                    download 
                    className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-medium border rounded-md bg-background hover:bg-accent transition-all"
                  >
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