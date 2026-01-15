import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ExternalLink, Calendar, Users, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Publication {
  id: string;
  title: string;
  authors: string[];
  publication_venue: string;
  abstract: string;
  doi_url: string;
  status: string;
  publication_date: string;
  display_order: number;
}

const Publications = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublications();
  }, []);

  const loadPublications = async () => {
    try {
      const { data } = await supabase
        .from('portfolio_publications')
        .select('*')
        .order('display_order');

      if (data) {
        setPublications(data as Publication[]);
      }
    } catch (error) {
      console.error('Error loading publications:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <section id="publications" className="py-20 bg-muted/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  if (publications.length === 0) {
    return null;
  }

  return (
    <section id="publications" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Research <span className="text-gradient">Publications</span>
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Contributing to the academic community through research and publications
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {publications.map((pub) => (
            <Card key={pub.id} className="card-gradient shadow-card hover-lift mb-8 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 opacity-40"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
              
              <CardContent className="p-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Publication Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                      <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  {/* Publication Details */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 leading-tight">
                        {pub.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(pub.publication_date)}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {(pub.authors || []).join(", ")}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {pub.status || 'Research Paper'}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2 font-medium">Published in:</p>
                      <p className="text-foreground font-semibold">{pub.publication_venue}</p>
                    </div>

                    {pub.abstract && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2 font-medium">Abstract:</p>
                        <p className="text-foreground leading-relaxed text-sm">
                          {pub.abstract}
                        </p>
                      </div>
                    )}

                    {pub.doi_url && (
                      <div className="pt-4">
                        <Button 
                          variant="default" 
                          size="sm"
                          className="w-full md:w-auto"
                          onClick={() => window.open(pub.doi_url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Publication
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Publications;