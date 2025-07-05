import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, GraduationCap, Award, Users } from 'lucide-react';

const Experience = () => {
  const experiences = [
    {
      type: "internship",
      title: "AI & ML Research Intern",
      company: "Tech Innovation Lab",
      duration: "June 2023 - August 2023",
      description: "Worked on machine learning models for predictive analytics and data processing automation.",
      achievements: [
        "Developed ML models with 85% accuracy",
        "Automated data processing workflows",
        "Contributed to 2 research publications"
      ],
      skills: ["Python", "TensorFlow", "Data Analysis", "Research"]
    },
    {
      type: "leadership",
      title: "Co-Team Leader",
      company: "University Project Team",
      duration: "September 2022 - Present",
      description: "Leading cross-functional teams in developing innovative solutions for real-world problems.",
      achievements: [
        "Led team of 8 developers",
        "Managed 5+ concurrent projects",
        "Mentored junior developers"
      ],
      skills: ["Leadership", "Project Management", "Team Coordination", "Mentoring"]
    },
    {
      type: "internship",
      title: "Data Analysis Intern",
      company: "Analytics Solutions Inc.",
      duration: "January 2023 - March 2023",
      description: "Focused on customer data analysis and business intelligence reporting using advanced analytics tools.",
      achievements: [
        "Created interactive dashboards",
        "Improved reporting efficiency by 40%",
        "Identified key business insights"
      ],
      skills: ["SQL", "Python", "Power BI", "Data Visualization"]
    },
    {
      type: "education",
      title: "Bachelor of Computer Applications (AIDA)",
      company: "LNCT University",
      duration: "2021 - 2024",
      description: "Specializing in Artificial Intelligence & Data Analytics with focus on practical applications.",
      achievements: [
        "Section C Representative",
        "Dean's List - 3 semesters",
        "Active in tech communities"
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
      internship: "bg-blue-100 text-blue-800 border-blue-200",
      leadership: "bg-purple-100 text-purple-800 border-purple-200",
      education: "bg-green-100 text-green-800 border-green-200",
      award: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
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

        <div className="max-w-4xl mx-auto space-y-8">
          {experiences.map((exp, index) => (
            <Card key={index} className="card-gradient shadow-card hover-lift">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {getIcon(exp.type)}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-foreground">
                        {exp.title}
                      </CardTitle>
                      <p className="text-primary font-medium">{exp.company}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getTypeColor(exp.type)} variant="outline">
                      {exp.type.charAt(0).toUpperCase() + exp.type.slice(1)}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">{exp.duration}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {exp.description}
                </p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-foreground mb-2">Key Achievements:</h4>
                  <ul className="space-y-1">
                    {exp.achievements.map((achievement, achievementIndex) => (
                      <li key={achievementIndex} className="text-muted-foreground flex items-start">
                        <span className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;