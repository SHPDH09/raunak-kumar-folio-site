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
      skills: ["AI/ML", "Data Science", "Programming", "Research"],
      semesters: [
        { semester: 1, cgpa: 8.50, sgpa: 8.50, date: "DEC 2023", status: "completed" },
        { semester: 2, cgpa: 8.75, sgpa: 9.00, date: "JUNE 2024", status: "completed" },
        { semester: 3, cgpa: 8.72, sgpa: 8.67, date: "DEC 2024", status: "completed" },
        { semester: 4, cgpa: 8.84, sgpa: 9.17, date: "JUNE 2025", status: "completed" },
        { semester: 5, cgpa: 0, sgpa: 0, date: "DEC 2025", status: "ongoing" },
        { semester: 6, cgpa: 0, sgpa: 0, date: "JUNE 2026", status: "upcoming" }
      ]
    },
    {
      type: "education",
      title: "Intermediate (12th Grade)",
      company: "BSEB PATNA",
      duration: "2019 - 2021",
      description: "Completed higher secondary education with focus on Science stream.",
      achievements: [
        "Secured 62% marks",
        "Strong foundation in core subjects",
        "Prepared for competitive examinations"
      ],
      skills: ["Hindi", "English", "Mathematics", "Physics", "Chemistry"]
    },
    {
      type: "education",
      title: "Matriculation (10th Grade)",
      company: "BSEB PATNA",
      duration: "2018 - 2019",
      description: "Completed secondary education with comprehensive learning across multiple subjects.",
      achievements: [
        "Secured 60% marks",
        "Well-rounded education",
        "Built strong academic foundation"
      ],
      skills: ["Hindi", "English", "Science", "Mathematics", "Social Science", "Sanskrit"]
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
                      
                      {/* Semester Breakdown for Education */}
                      {exp.type === "education" && exp.semesters && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-foreground mb-4 flex items-center">
                            <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                            Academic Performance (CGPA out of 10):
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {exp.semesters.map((sem, semIndex) => (
                              <div 
                                key={semIndex} 
                                className={`relative p-4 rounded-lg border transition-all duration-300 ${
                                  sem.status === 'completed' 
                                    ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20' 
                                    : sem.status === 'ongoing'
                                    ? 'bg-yellow-500/10 border-yellow-500/30 animate-pulse'
                                    : 'bg-muted/10 border-muted/30 opacity-60'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${
                                        sem.status === 'completed' 
                                          ? 'text-green-400 border-green-500/30' 
                                          : sem.status === 'ongoing'
                                          ? 'text-yellow-400 border-yellow-500/30'
                                          : 'text-muted-foreground border-muted/30'
                                      }`}
                                    >
                                      Semester {sem.semester}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">{sem.date}</span>
                                  </div>
                                  <Badge 
                                    variant="secondary" 
                                    className={`text-xs ${
                                      sem.status === 'completed' 
                                        ? 'bg-green-500/20 text-green-400' 
                                        : sem.status === 'ongoing'
                                        ? 'bg-yellow-500/20 text-yellow-400'
                                        : 'bg-muted/20 text-muted-foreground'
                                    }`}
                                  >
                                    {sem.status === 'completed' ? '✓ Completed' : sem.status === 'ongoing' ? '⏳ Ongoing' : '⏳ Upcoming'}
                                  </Badge>
                                </div>
                                
                                {sem.status === 'completed' && (
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                      <p className="text-xs text-muted-foreground mb-1">CGPA</p>
                                      <p className="text-lg font-bold text-primary">{sem.cgpa}</p>
                                      <p className="text-xs text-accent font-medium">{(sem.cgpa * 10).toFixed(1)}%</p>
                                      <div className="w-full bg-muted/20 rounded-full h-1.5 mt-1">
                                        <div 
                                          className="bg-gradient-to-r from-primary to-accent h-1.5 rounded-full transition-all duration-500"
                                          style={{ width: `${(sem.cgpa / 10) * 100}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-xs text-muted-foreground mb-1">SGPA</p>
                                      <p className="text-lg font-bold text-accent">{sem.sgpa}</p>
                                      <div className="w-full bg-muted/20 rounded-full h-1.5 mt-1">
                                        <div 
                                          className="bg-gradient-to-r from-accent to-primary-glow h-1.5 rounded-full transition-all duration-500"
                                          style={{ width: `${(sem.sgpa / 10) * 100}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {sem.status === 'ongoing' && (
                                  <div className="text-center py-2">
                                    <p className="text-sm text-yellow-400 font-medium">Currently in progress...</p>
                                  </div>
                                )}
                                
                                {sem.status === 'upcoming' && (
                                  <div className="text-center py-2">
                                    <p className="text-sm text-muted-foreground">Yet to commence</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          {/* Overall Performance Summary */}
                          <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">Current Overall CGPA</p>
                                <p className="text-2xl font-bold text-primary">8.84/10</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Progress</p>
                                <p className="text-lg font-semibold text-accent">4/6 Semesters</p>
                              </div>
                            </div>
                            <div className="w-full bg-muted/20 rounded-full h-2 mt-3">
                              <div 
                                className="bg-gradient-to-r from-primary via-accent to-primary-glow h-2 rounded-full transition-all duration-1000"
                                style={{ width: '66.67%' }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                      
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
