import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, Github, Database, Brain, Globe, Code2, Users, Activity, Search, Filter, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tech_stack: string[];
  github_url: string;
  demo_url: string;
  image_url: string;
  display_order: number;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTech, setSelectedTech] = useState('all');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('display_order');

      if (data) {
        setProjects(data as Project[]);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (category: string) => {
    const icons: Record<string, JSX.Element> = {
      'GenAI/LLM': <Brain className="w-5 h-5" />,
      'Web App': <Code2 className="w-5 h-5" />,
      'ML/Data Analyst': <Activity className="w-5 h-5" />,
      'Data Engineering': <Database className="w-5 h-5" />,
      'Data Science': <Activity className="w-5 h-5" />
    };
    return icons[category] || <Code2 className="w-5 h-5" />;
  };

  const getColor = (category: string) => {
    const colors: Record<string, string> = {
      'GenAI/LLM': 'from-violet-500 to-purple-500',
      'Web App': 'from-green-500 to-emerald-500',
      'ML/Data Analyst': 'from-cyan-500 to-blue-500',
      'Data Engineering': 'from-yellow-500 to-orange-500',
      'Data Science': 'from-cyan-500 to-blue-500'
    };
    return colors[category] || 'from-gray-500 to-slate-500';
  };

  // Get unique categories and tech stacks
  const categories = useMemo(() => {
    const cats = [...new Set(projects.map(p => p.category).filter(Boolean))];
    return cats.sort();
  }, [projects]);

  const techStacks = useMemo(() => {
    const techs = [...new Set(projects.flatMap(p => (p.tech_stack || []).map(t => t.trim())))];
    return techs.sort();
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesTech = selectedTech === 'all' || (project.tech_stack || []).some(t => t.trim() === selectedTech);
      return matchesSearch && matchesCategory && matchesTech;
    });
  }, [projects, searchQuery, selectedCategory, selectedTech]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTech('all');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedTech !== 'all';

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-background/95 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-background/95">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compact showcase of <span className="text-accent">AI, ML, and web development</span> projects
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/50 border-accent/20"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 bg-card/50 border-accent/20">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTech} onValueChange={setSelectedTech}>
              <SelectTrigger className="w-full md:w-48 bg-card/50 border-accent/20">
                <Code2 className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Tech Stack" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Technologies</SelectItem>
                {techStacks.map((tech) => (
                  <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {hasActiveFilters && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              Showing {filteredProjects.length} of {projects.length} projects
            </p>
          )}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No projects match your filters</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {filteredProjects.map((project, index) => (
            <Card 
              key={project.id} 
              className="card-gradient shadow-card hover-lift group relative overflow-hidden border-0 bg-card/80 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Project Image */}
              <div className="relative h-32 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r ${getColor(project.category)} opacity-60 group-hover:opacity-40 transition-smooth`}></div>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs bg-background/80 backdrop-blur-sm">
                    {project.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <div className="p-1.5 bg-primary/20 rounded-md text-primary mr-2 group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                    {getIcon(project.category)}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-smooth">
                    {project.title}
                  </h3>
                </div>
                
                <p className="text-muted-foreground text-xs mb-3 leading-relaxed line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {(project.tech_stack || []).slice(0, 2).map((tech, techIndex) => (
                    <Badge key={techIndex} variant="outline" className="text-xs px-2 py-0.5 border-accent/30 text-accent">
                      {tech}
                    </Badge>
                  ))}
                  {(project.tech_stack || []).length > 2 && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5 border-muted-foreground/30">
                      +{project.tech_stack.length - 2}
                    </Badge>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs py-1 h-7 hover-neon"
                    onClick={() => project.github_url && window.open(project.github_url, '_blank')}
                    disabled={!project.github_url}
                  >
                    <Github className="w-3 h-3 mr-1" />
                    Code
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 text-xs py-1 h-7 hover-neon"
                    onClick={() => project.demo_url && window.open(project.demo_url, '_blank')}
                    disabled={!project.demo_url}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="px-8 hover-neon border-accent/50 text-accent hover:bg-accent/10"
            onClick={() => window.open('https://github.com/SHPDH09', '_blank')}
          >
            <Github className="w-5 h-5 mr-2" />
            View All Projects on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;