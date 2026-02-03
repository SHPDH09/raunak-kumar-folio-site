import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ExternalLink, Calendar, Users, Loader2, FileText, Quote, GraduationCap, BookMarked } from 'lucide-react';
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
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getStatusStyle = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('published')) return { bg: 'bg-green-500', text: 'Published' };
    if (statusLower.includes('review')) return { bg: 'bg-yellow-500', text: 'Under Review' };
    if (statusLower.includes('accepted')) return { bg: 'bg-blue-500', text: 'Accepted' };
    if (statusLower.includes('submitted')) return { bg: 'bg-orange-500', text: 'Submitted' };
    return { bg: 'bg-purple-500', text: status || 'Research Paper' };
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
    <section id="publications" className="py-20 bg-gradient-to-b from-slate-50 to-background dark:from-slate-950/50 dark:to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-blue-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Research <span className="text-gradient">Publications</span>
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Contributing to the academic community through research and scholarly publications
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {publications.map((pub, index) => {
            const statusStyle = getStatusStyle(pub.status);
            
            return (
              <div 
                key={pub.id} 
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Academic Journal Paper Design */}
                <div className="relative bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-200 dark:border-slate-700">
                  
                  {/* Header Bar - Journal Style */}
                  <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                          <BookMarked className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-blue-200 text-xs uppercase tracking-wider font-medium">Research Publication</p>
                          <p className="text-white font-semibold">{pub.publication_venue}</p>
                        </div>
                      </div>
                      <Badge className={`${statusStyle.bg} text-white border-0 font-semibold`}>
                        {statusStyle.text}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8">
                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {pub.title}
                    </h3>
                    
                    {/* Authors */}
                    <div className="flex items-start gap-3 mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                      <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Authors</p>
                        <p className="text-foreground font-medium">
                          {(pub.authors || []).map((author, i) => (
                            <span key={i}>
                              {author === 'Raunak Kumar' ? (
                                <span className="text-blue-600 dark:text-blue-400 font-semibold">{author}</span>
                              ) : (
                                author
                              )}
                              {i < pub.authors.length - 1 && ', '}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                    
                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                      <Calendar className="w-4 h-4" />
                      <span>Published: {formatDate(pub.publication_date)}</span>
                    </div>
                    
                    {/* Abstract */}
                    {pub.abstract && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Quote className="w-5 h-5 text-blue-600" />
                          <h4 className="font-semibold text-foreground uppercase text-sm tracking-wider">Abstract</h4>
                        </div>
                        <div className="relative pl-4 border-l-4 border-blue-500/30">
                          <p className="text-muted-foreground leading-relaxed text-sm md:text-base italic">
                            {pub.abstract}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Footer with Citation & DOI */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Peer-Reviewed Research Paper</span>
                      </div>
                      
                      {pub.doi_url && (
                        <Button 
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                          onClick={() => window.open(pub.doi_url, '_blank')}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Full Paper
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Publications;
