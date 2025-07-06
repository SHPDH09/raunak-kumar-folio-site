import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Users } from 'lucide-react';

const Achievements = () => {
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

        <div className="max-w-4xl mx-auto">
          <Card className="card-gradient shadow-card hover-lift border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary/20 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <h3 className="text-xl font-semibold text-foreground">State-Level RBI90Quiz 2024 Participation</h3>
                    <Badge variant="outline" className="border-primary text-primary">
                      Team Competition
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Your team (Team 52) successfully competed in the State-Level Round of RBI90Quiz 2024, 
                    proudly representing LNCT University, Bhopal. This achievement demonstrates excellent 
                    teamwork, financial knowledge, and competitive spirit at the state level.
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>Team 52</span>
                    </div>
                    <div className="flex items-center">
                      <Medal className="w-4 h-4 mr-1" />
                      <span>State Level</span>
                    </div>
                    <div>
                      <span>LNCT University, Bhopal</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Achievements;