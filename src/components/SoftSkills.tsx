import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Lightbulb, FileText, Target, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SoftSkill {
  id: string;
  skill_name: string;
  description: string;
  icon_name: string;
  display_order: number;
}

const iconMap: Record<string, JSX.Element> = {
  MessageCircle: <MessageCircle className="w-5 h-5" />,
  Lightbulb: <Lightbulb className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />
};

const SoftSkills = () => {
  const [skills, setSkills] = useState<SoftSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const { data } = await supabase
        .from('portfolio_soft_skills')
        .select('*')
        .order('display_order');

      if (data) {
        setSkills(data as SoftSkill[]);
      }
    } catch (error) {
      console.error('Error loading soft skills:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-background/50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  if (skills.length === 0) {
    return null;
  }

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
              key={skill.id} 
              className="card-gradient shadow-card hover-lift group border-0 bg-card/80 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-primary/20 rounded-full text-primary mx-auto w-fit mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                  {iconMap[skill.icon_name] || <Lightbulb className="w-5 h-5" />}
                </div>
                <h3 className="font-semibold text-foreground mb-3 group-hover:text-primary transition-smooth">
                  {skill.skill_name}
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