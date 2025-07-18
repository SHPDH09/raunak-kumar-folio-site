import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, GraduationCap, Award, Users } from 'lucide-react';

const Experience = () => {
  const experiences = [
   
    {
      type: "internship",
      title: "Python Development",
      company: "Code Clouse PVT. LTD. (Remote)",
      duration: "jun 2024 - Aug 2024",
      description: "Built robust applications using Python, implemented efficient algorithms, and integrated APIs with various libraries.",
      achievements: [
        "Built robust Python applications",
        "Implemented efficient algorithms",
        "Integrated APIs successfully",
        "Utilized Pandas, NumPy, and Flask libraries",
        "Delivered scalable and user-friendly solutions"
      ],
      skills: ["Python", "Flask", "Pandas", "NumPy", "API Integration"]
    },
    {
      type: "education",
      title: "Bachelor of Computer Applications (AIDA)",
      company: "LNCT University",
      duration: "2023 - 2026",
      description: "Specializing in Artificial Intelligence & Data Analytics with focus on practical applications and research.",
      achievements: [
        "Specialization in AI & Data Analytics",
        "Active in tech communities and projects",
        "Strong foundation in programming and analytics"
      ],
      skills: ["AI/ML", "Data Science", "Programming", "Research"]
    }
  ];

  const getIcon = (type: string) => {
    const icons = {
      internship: <Briefcase className="w-5 h-5" />,
      leadership: <Users className="w-5 h-5" />,
      education: <GraduationCap className="w-5 h-5" />,
      award: <Award className="w-5 h-5" />
    };
    return icons[type as keyof typeof icons] || <Briefcase className="w-5 h-5" />;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      current: "bg-accent/20 text-accent border-accent/30",
      internship: "bg-primary/20 text-primary border-primary/30",
      leadership: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      education: "bg-green-500/20 text-green-400 border-green-500/30",
      award: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    };
    return colors[type as keyof typeof colors] || "bg-muted/20 text-muted-foreground border-muted/30";
  };

  return (
    <section id="experience" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Experience & <span className="text-gradient">Education</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My journey through internships, leadership roles, and academic achievements
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Career Path Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-primary to-primary-glow"></div>
            
            {experiences.map((exp, index) => (
              <div key={index} className="relative mb-12 last:mb-0">
                {/* Timeline Node */}
                <div className="absolute left-6 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-glow"></div>
                
                {/* Promotion Arrow */}
                {exp.isPromotion && (
                  <div className="absolute left-2 -top-6 flex items-center text-accent text-sm font-semibold animate-pulse">
                    <span className="text-lg mr-1">↗</span>
                    <span>PROMOTED</span>
                  </div>
                )}
                
                {/* Experience Card */}
                <div className="ml-16">
                  <Card className="card-gradient shadow-card hover-lift border-l-4 border-l-primary">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-primary/10 rounded-lg text-primary">
                            {getIcon(exp.type)}
                          </div>
                          <div>
                            <CardTitle className="text-xl font-semibold text-foreground">
                              {exp.title}
                            </CardTitle>
                            <p className="text-primary font-medium text-lg">{exp.company}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getTypeColor(exp.type)} variant="outline">
                            {exp.type === 'current' ? 'Current' : exp.type.charAt(0).toUpperCase() + exp.type.slice(1)}
                          </Badge>
                          <p className="text-sm text-accent font-medium mt-1">{exp.duration}</p>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {exp.description}
                      </p>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold text-foreground mb-2 flex items-center">
                          <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                          Key Responsibilities & Achievements:
                        </h4>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, achievementIndex) => (
                            <li key={achievementIndex} className="text-muted-foreground flex items-start">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                              <span className="leading-relaxed">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {exp.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary" className="text-xs px-2 py-1 hover:bg-accent hover:text-accent-foreground transition-smooth">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
