import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Code2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Application {
  id: string;
  title: string;
  description: string;
  live_url: string;
  tech_stack: string[];
  features: string[];
  icon_name: string;
  color: string;
  display_order: number;
}

const Applications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const { data } = await supabase
        .from('portfolio_applications')
        .select('*')
        .order('display_order');

      if (data) {
        setApplications(data as Application[]);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="applications" className="py-20 bg-background/95 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  if (applications.length === 0) {
    return null;
  }

  return (
    <section id="applications" className="py-20 bg-background/95">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Application Development & <span className="text-gradient">Publishing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Live applications built, deployed, and published for real-world use
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {applications.map((app) => (
            <Card 
              key={app.id}
              className="card-gradient shadow-card hover-lift border-0 bg-card/80 backdrop-blur-sm mb-8"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 bg-gradient-to-r ${app.color || 'from-green-500 to-emerald-500'} rounded-lg text-white shadow-glow`}>
                      <Code2 className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-foreground">{app.title}</CardTitle>
                      <div className="flex items-center mt-2 space-x-2">
                        <ExternalLink className="w-4 h-4 text-accent" />
                        <a 
                          href={`https://${app.live_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent/80 transition-smooth text-sm"
                        >
                          {app.live_url}
                        </a>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-accent/50 text-accent hover:bg-accent/10 hover:border-accent"
                    onClick={() => window.open(`https://${app.live_url}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Live
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Tech Stack */}
                {app.tech_stack && app.tech_stack.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-3">🛠 Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {app.tech_stack.map((tech, techIndex) => (
                        <Badge 
                          key={techIndex}
                          variant="outline" 
                          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Features */}
                {app.features && app.features.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-4">🎯 Key Features</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {app.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-2">
                          <div className="p-1 bg-primary/20 rounded text-primary mt-1">
                            <Code2 className="w-4 h-4" />
                          </div>
                          <span className="text-muted-foreground text-sm leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Applications;