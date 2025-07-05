import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Database, Brain, Globe, Code2, Users, Activity } from 'lucide-react';

const Projects = () => {
  const projects = [
    {
      title: "Banking System",
      description: "Comprehensive banking application built with Java Swing featuring account management, transactions, and user authentication.",
      tech: ["Java", "Swing", "MySQL", "JDBC"],
      icon: <Database className="w-6 h-6" />,
      category: "Desktop Application"
    },
    {
      title: "Railway Reservation System",
      description: "Complete railway booking system with activation dashboard, seat selection, and booking management features.",
      tech: ["Java", "Spring Boot", "MySQL", "HTML/CSS"],
      icon: <Activity className="w-6 h-6" />,
      category: "Web Application"
    },
    {
      title: "AI Publication Summary Tool",
      description: "Intelligent tool that automatically summarizes research publications using natural language processing techniques.",
      tech: ["Python", "NLP", "Flask", "Scikit-learn"],
      icon: <Brain className="w-6 h-6" />,
      category: "AI/ML"
    },
    {
      title: "Interactive Quiz Application",
      description: "Dynamic quiz platform supporting both objective and coding questions with real-time evaluation.",
      tech: ["React", "Node.js", "MongoDB", "Express"],
      icon: <Code2 className="w-6 h-6" />,
      category: "Web Application"
    },
    {
      title: "Product Success Predictor",
      description: "Machine learning model that predicts product success based on various market and feature parameters.",
      tech: ["Python", "Pandas", "Scikit-learn", "Flask"],
      icon: <Brain className="w-6 h-6" />,
      category: "Machine Learning"
    },
    {
      title: "Work Tracker Dashboard",
      description: "Multi-department work tracking system with analytics, reporting, and team collaboration features.",
      tech: ["React", "Django", "PostgreSQL", "Chart.js"],
      icon: <Users className="w-6 h-6" />,
      category: "Dashboard"
    },
    {
      title: "Medical Appointment System",
      description: "Healthcare management system for scheduling appointments, patient records, and doctor availability.",
      tech: ["Java", "Spring Boot", "MySQL", "Thymeleaf"],
      icon: <Globe className="w-6 h-6" />,
      category: "Web Application"
    },
    {
      title: "Customer Segmentation using K-Means",
      description: "ML-powered customer segmentation analysis using K-Means clustering for targeted marketing strategies.",
      tech: ["Python", "Pandas", "Scikit-learn", "Matplotlib"],
      icon: <Brain className="w-6 h-6" />,
      category: "Data Science"
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      "AI/ML": "bg-purple-100 text-purple-800 border-purple-200",
      "Machine Learning": "bg-purple-100 text-purple-800 border-purple-200",
      "Data Science": "bg-blue-100 text-blue-800 border-blue-200",
      "Web Application": "bg-green-100 text-green-800 border-green-200",
      "Desktop Application": "bg-orange-100 text-orange-800 border-orange-200",
      "Dashboard": "bg-pink-100 text-pink-800 border-pink-200"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A collection of projects showcasing my expertise in AI, ML, web development, and data analysis
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="card-gradient shadow-card hover-lift group">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                    {project.icon}
                  </div>
                  <Badge className={getCategoryColor(project.category)}>
                    {project.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-smooth">
                  {project.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex space-x-3">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Github className="w-4 h-4 mr-2" />
                    Code
                  </Button>
                  <Button size="sm" className="flex-1">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="px-8">
            <Github className="w-5 h-5 mr-2" />
            View All on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;