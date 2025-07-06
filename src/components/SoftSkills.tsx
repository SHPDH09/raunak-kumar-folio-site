import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Lightbulb, FileText, Target } from 'lucide-react';

const SoftSkills = () => {
  const skills = [
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "Technical Communication",
      description: "Known for simplifying complex technical concepts into easy language"
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Problem Solving",
      description: "Regularly brainstorms and implements smart tricks for aptitude and coding"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Documentation",
      description: "Capable of writing impressive resumes, smart bios, and well-structured documentation"
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "UI/UX Focus",
      description: "Sharp focus on project presentation and user interface with hidden developer credit"
    }
  ];

  return (
    <section className="py-20 bg-background/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Soft Skills & <span className="text-gradient">Recognition</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Beyond technical expertise, here's what makes me stand out
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {skills.map((skill, index) => (
            <Card 
              key={index} 
              className="card-gradient shadow-card hover-lift group border-0 bg-card/80 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-primary/20 rounded-full text-primary mx-auto w-fit mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                  {skill.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-3 group-hover:text-primary transition-smooth">
                  {skill.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {skill.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SoftSkills;