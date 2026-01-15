import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Achievement {
  id: string;
  title: string;
  description: string;
  badge_text: string;
  date_achieved: string;
  display_order: number;
}

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const { data } = await supabase
        .from('portfolio_achievements')
        .select('*')
        .order('display_order');

      if (data) {
        setAchievements(data as Achievement[]);
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  if (achievements.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            <span className="text-gradient">Achievements</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recognition and accomplishments that showcase dedication to excellence
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className="card-gradient shadow-card hover-lift border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/20 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <h3 className="text-xl font-semibold text-foreground">{achievement.title}</h3>
                      {achievement.badge_text && (
                        <Badge variant="outline" className="border-primary text-primary">
                          {achievement.badge_text}
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;