import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, GraduationCap, User, Heart, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AboutData {
  name: string;
  tagline: string;
  education: string;
  university: string;
  location: string;
  bio: string;
  avatar_url: string;
  date_of_birth: string;
}

interface Skill {
  id: string;
  skill_name: string;
  category: string;
  display_order: number;
}

const About = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load about data
      const { data: about } = await supabase
        .from('portfolio_about')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (about) {
        setAboutData(about as AboutData);
      }

      // Load skills
      const { data: skillsData } = await supabase
        .from('portfolio_skills')
        .select('*')
        .order('display_order');

      if (skillsData) {
        setSkills(skillsData);
      }
    } catch (error) {
      console.error('Error loading about data:', error);
    } finally {
      setLoading(false);
    }
  };

  const programmingSkills = skills.filter(s => s.category === 'programming');
  const frameworks = skills.filter(s => s.category === 'framework');
  const interests = skills.filter(s => s.category === 'learning');

  if (loading) {
    return (
      <section id="about" className="py-20 bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

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
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-primary/20 shadow-glow">
                  <img 
                    src={aboutData?.avatar_url || "/lovable-uploads/a40bf5f4-14e7-48e5-9e6a-1363bb767db7.png"} 
                    alt={aboutData?.name || "Profile"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center">
                  <User className="w-6 h-6 text-primary mr-3" />
                  <h3 className="text-2xl font-semibold text-foreground">Personal Details</h3>
                </div>
              </div>
              
              <div className="space-y-4">
                {aboutData?.date_of_birth && (
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-muted-foreground mr-3" />
                    <span className="text-foreground">
                      <strong>Date of Birth:</strong> {new Date(aboutData.date_of_birth).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}
                    </span>
                  </div>
                )}
                
                {aboutData?.education && (
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 text-muted-foreground mr-3" />
                    <span className="text-foreground">
                      <strong>Course:</strong> {aboutData.education}
                    </span>
                  </div>
                )}

                {aboutData?.university && (
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 text-muted-foreground mr-3" />
                    <span className="text-foreground">
                      <strong>Institution:</strong> {aboutData.university}
                    </span>
                  </div>
                )}
                
                {aboutData?.location && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-muted-foreground mr-3" />
                    <span className="text-foreground">
                      <strong>Location:</strong> {aboutData.location}
                    </span>
                  </div>
                )}
              </div>

              {aboutData?.bio && (
                <div className="mt-8">
                  <p className="text-muted-foreground leading-relaxed">
                    {aboutData.bio}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills & Interests */}
          <div className="space-y-8">
            {programmingSkills.length > 0 && (
              <Card className="card-gradient shadow-card hover-lift">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-foreground mb-6">Programming Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {programmingSkills.map((skill) => (
                      <Badge 
                        key={skill.id} 
                        variant="secondary" 
                        className="px-3 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-smooth"
                      >
                        {skill.skill_name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {frameworks.length > 0 && (
              <Card className="card-gradient shadow-card hover-lift">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-foreground mb-6">Frameworks & Libraries</h3>
                  <div className="flex flex-wrap gap-2">
                    {frameworks.map((framework) => (
                      <Badge 
                        key={framework.id} 
                        variant="outline" 
                        className="px-3 py-2 text-sm border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
                      >
                        {framework.skill_name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {interests.length > 0 && (
              <Card className="card-gradient shadow-card hover-lift">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Heart className="w-6 h-6 text-primary mr-3" />
                    <h3 className="text-2xl font-semibold text-foreground">Learning Interests</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <Badge 
                        key={interest.id} 
                        variant="outline" 
                        className="px-3 py-2 text-sm border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-smooth"
                      >
                        {interest.skill_name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;