import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, GraduationCap, User, Heart } from 'lucide-react';

const About = () => {
  const skills = [
    'Python', 'Java', 'C', 'C++', 'SQL', 'HTML', 'CSS', 'JavaScript', 
    'React', 'Flask', 'Django', 'Spring Boot', 'Node.js', 'Pandas', 
    'NumPy', 'Scikit-learn', 'Selenium', 'OpenCV', 'Java Swing'
  ];

  const interests = [
    'Data Science', 'Machine Learning', 'Web Development', 
    'Automation', 'UI/UX Design', 'Research'
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            About <span className="text-gradient">Me</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get to know more about my journey, skills, and passion for technology
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Personal Info Card */}
          <Card className="card-gradient shadow-card hover-lift">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <User className="w-6 h-6 text-primary mr-3" />
                <h3 className="text-2xl font-semibold text-foreground">Personal Info</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-muted-foreground mr-3" />
                  <span className="text-foreground">
                    <strong>Date of Birth:</strong> May 21, 2003
                  </span>
                </div>
                
                <div className="flex items-center">
                  <GraduationCap className="w-5 h-5 text-muted-foreground mr-3" />
                  <span className="text-foreground">
                    <strong>Education:</strong> BCA (AIDA), LNCT University, Section C
                  </span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-muted-foreground mr-3" />
                  <span className="text-foreground">
                    <strong>Location:</strong> India
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-muted-foreground leading-relaxed">
                  I'm a passionate technology enthusiast currently pursuing my Bachelor's in Computer Applications 
                  with a specialization in Artificial Intelligence & Data Analytics. My journey in tech has been 
                  driven by curiosity and a desire to create solutions that can make a real impact on people's lives.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Interests */}
          <div className="space-y-8">
            <Card className="card-gradient shadow-card hover-lift">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-6">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="px-3 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-smooth"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-gradient shadow-card hover-lift">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Heart className="w-6 h-6 text-primary mr-3" />
                  <h3 className="text-2xl font-semibold text-foreground">Interests</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="px-3 py-2 text-sm border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-smooth"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;