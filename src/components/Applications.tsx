import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Code2, Loader2, Rocket, Zap, Globe, Star, CheckCircle2, Terminal, Cpu, Layers } from 'lucide-react';
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

  // Get app icon based on index
  const getAppIcon = (index: number) => {
    const icons = [Rocket, Cpu, Terminal, Globe, Layers, Zap];
    return icons[index % icons.length];
  };

  // Get gradient color based on app color or index
  const getGradient = (color: string | undefined, index: number) => {
    if (color) return color;
    const gradients = [
      'from-violet-600 via-purple-600 to-indigo-600',
      'from-cyan-500 via-teal-500 to-emerald-500',
      'from-orange-500 via-red-500 to-pink-500',
      'from-blue-600 via-indigo-600 to-purple-600',
      'from-green-500 via-emerald-500 to-teal-500',
      'from-rose-500 via-pink-500 to-fuchsia-500',
    ];
    return gradients[index % gradients.length];
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
    <section id="applications" className="py-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-conic from-violet-500/20 via-transparent to-violet-500/20 rounded-full blur-3xl animate-spin-slow" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/25">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Live <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Applications</span>
            </h2>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Production-ready applications deployed and serving real users worldwide
          </p>
        </div>

        <div className="space-y-8 max-w-5xl mx-auto">
          {applications.map((app, index) => {
            const AppIcon = getAppIcon(index);
            const gradient = getGradient(app.color, index);
            
            return (
              <div 
                key={app.id}
                className="group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Main Card */}
                <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 hover:border-slate-600 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10">
                  
                  {/* Top Gradient Bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
                  
                  {/* Header */}
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      
                      {/* App Icon */}
                      <div className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-500`}>
                        <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
                          <AppIcon className="w-10 h-10 text-white" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 space-y-4">
                        {/* Title & URL */}
                        <div>
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                              {app.title}
                            </h3>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
                              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                              Live
                            </Badge>
                          </div>
                          
                          {/* URL with globe */}
                          <div className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors cursor-pointer group/url"
                               onClick={() => window.open(`https://${app.live_url}`, '_blank')}>
                            <Globe className="w-4 h-4" />
                            <span className="text-sm font-mono group-hover/url:underline">{app.live_url}</span>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover/url:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        
                        {/* Description */}
                        {app.description && (
                          <p className="text-slate-300 leading-relaxed">
                            {app.description}
                          </p>
                        )}
                        
                        {/* Tech Stack */}
                        {app.tech_stack && app.tech_stack.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Code2 className="w-4 h-4 text-purple-400" />
                              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Tech Stack</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {app.tech_stack.map((tech, techIndex) => (
                                <Badge 
                                  key={techIndex}
                                  variant="outline" 
                                  className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50 hover:text-white transition-colors font-mono text-xs px-3 py-1"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Features */}
                        {app.features && app.features.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Star className="w-4 h-4 text-amber-400" />
                              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Key Features</span>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-2">
                              {app.features.map((feature, featureIndex) => (
                                <div key={featureIndex} className="flex items-start gap-2 p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-slate-300 leading-relaxed">
                                    {feature}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* CTA Button */}
                        <div className="pt-4">
                          <Button
                            className={`bg-gradient-to-r ${gradient} hover:opacity-90 text-white font-semibold px-6 py-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all`}
                            onClick={() => window.open(`https://${app.live_url}`, '_blank')}
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            Launch Application
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
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

export default Applications;
