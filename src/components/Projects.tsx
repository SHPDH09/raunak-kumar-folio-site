import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Database, Brain, Globe, Code2, Users, Activity } from 'lucide-react';

// Import project images
import bankingImg from '@/assets/banking-project.jpg';
import railwayImg from '@/assets/railway-project.jpg';
import aiImg from '@/assets/ai-project.jpg';
import quizImg from '@/assets/quiz-project.jpg';
import analyticsImg from '@/assets/analytics-project.jpg';
import trackerImg from '@/assets/tracker-project.jpg';
import medicalImg from '@/assets/medical-project.jpg';
import clusteringImg from '@/assets/clustering-project.jpg';

const Projects = () => {
  const projects = [
   
    {
      title: "Police Cyber Crime Management",
      description: "Comprehensive system for managing and tracking cyber crime cases.",
      tech: ["Java", "MySQL", "Security"],
      icon: <Activity className="w-5 h-5" />,
      category: "System Management",
      image: railwayImg,
      color: "from-purple-500 to-pink-500",
      githubLink: "https://github.com/SHPDH09/police-cybercrime-management-system/tree/main",
      demoLink: ""
    },
    {
      title: "Objective & Coding Quiz App",
      description: "Interactive quiz platform with coding IDE integration for assessment.",
      tech: ["JavaScript", "React", "IDE"],
      icon: <Code2 className="w-5 h-5" />,
      category: "Web App",
      image: quizImg,
      color: "from-green-500 to-emerald-500",
      githubLink: "https://github.com/SHPDH09/Quiz-Application-Java/tree/main",
      demoLink: "https://quiz_application_001.renderforestsites.com/"
    },
    {
      title: "Automatic Attendance Assistant",
      description: "AI-powered attendance system using facial recognition technology.",
      tech: ["Python", "OpenCV", "AI"],
      icon: <Brain className="w-5 h-5" />,
      category: "AI/ML",
      image: aiImg,
      color: "from-orange-500 to-red-500",
      githubLink: "https://github.com/SHPDH09/Automatic-Attendance-AI",
      demoLink: ""
    },
    {
      title: "Fraud Detection System",
      description: "ML model for detecting fraudulent transactions in financial systems.",
      tech: ["Python", "ML", "TensorFlow"],
      icon: <Brain className="w-5 h-5" />,
      category: "Machine Learning",
      image: analyticsImg,
      color: "from-teal-500 to-blue-500",
      githubLink: "https://github.com/SHPDH09/Fraud-Detection-ML",
      demoLink: ""
    },
    {
      title: "Product Success Predictor",
      description: "E-commerce ML model predicting product success using analytics.",
      tech: ["Python", "Scikit-learn", "Analytics"],
      icon: <Brain className="w-5 h-5" />,
      category: "ML",
      image: trackerImg,
      color: "from-indigo-500 to-purple-500",
      githubLink: "https://github.com/SHPDH09/Product-Success-Predictor",
      demoLink: ""
    },
    {
      title: "Satellite Imagery Detection",
      description: "AI/ML-based feature detection in satellite imagery data.",
      tech: ["Python", "Computer Vision", "ML"],
      icon: <Globe className="w-5 h-5" />,
      category: "AI/ML",
      image: medicalImg,
      color: "from-pink-500 to-rose-500",
      githubLink: "https://github.com/SHPDH09/Satellite-Imagery-AI",
      demoLink: ""
    },
    {
      title: "ETL Pipeline for Sales Data",
      description: "Automated ETL pipeline for processing large-scale sales data efficiently.",
      tech: ["Python", "ETL", "Data Pipeline"],
      icon: <Database className="w-5 h-5" />,
      category: "Data Engineering",
      image: clusteringImg,
      color: "from-yellow-500 to-orange-500",
      githubLink: "https://github.com/SHPDH09/ETL-Sales-Pipeline",
      demoLink: ""
    },
    {
      title: "Data Quality Monitoring",
      description: "Real-time monitoring system ensuring data quality across sources.",
      tech: ["Python", "Monitoring", "Quality"],
      icon: <Activity className="w-5 h-5" />,
      category: "Data Science",
      image: bankingImg,
      color: "from-cyan-500 to-blue-500",
      githubLink: "https://github.com/SHPDH09/Data-Quality-Monitoring",
      demoLink: ""
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {projects.map((project, index) => (
            <Card 
              key={index} 
              className="card-gradient shadow-card hover-lift group relative overflow-hidden border-0 bg-card/80 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Project Image */}
              <div className="relative h-32 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${project.color} opacity-60 group-hover:opacity-40 transition-smooth`}></div>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs bg-background/80 backdrop-blur-sm">
                    {project.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <div className="p-1.5 bg-primary/20 rounded-md text-primary mr-2 group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                    {project.icon}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-smooth">
                    {project.title}
                  </h3>
                </div>
                
                <p className="text-muted-foreground text-xs mb-3 leading-relaxed line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.tech.slice(0, 2).map((tech, techIndex) => (
                    <Badge key={techIndex} variant="outline" className="text-xs px-2 py-0.5 border-accent/30 text-accent">
                      {tech}
                    </Badge>
                  ))}
                  {project.tech.length > 2 && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5 border-muted-foreground/30">
                      +{project.tech.length - 2}
                    </Badge>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs py-1 h-7 hover-neon"
                    onClick={() => window.open(project.githubLink, '_blank')}
                    disabled={!project.githubLink}
                  >
                    <Github className="w-3 h-3 mr-1" />
                    Code
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 text-xs py-1 h-7 hover-neon"
                    onClick={() => project.demoLink && window.open(project.demoLink, '_blank')}
                    disabled={!project.demoLink}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
