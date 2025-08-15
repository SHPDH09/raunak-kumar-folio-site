import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ExternalLink, Calendar, Users } from 'lucide-react';

const Publications = () => {
  const publications = [
    {
      title: "Employee Attrition Prediction Using Machine Learning Techniques",
      journal: "Academia.edu",
      type: "Research Paper",
      date: "Aug-2025",
      authors: ["Raunak Kumar"],
      abstract: "This research paper explores the application of machine learning techniques for predicting employee attrition in organizations. The study analyzes various factors contributing to employee turnover and implements predictive models to help organizations retain talent.",
      link: "https://www.academia.edu/143335578/Employee_Attrition_Prediction_Using_Machine_Learning_Techniques",
      keywords: ["Machine Learning", "Employee Attrition", "Predictive Analytics", "HR Analytics"]
    }
  ];

  return (
    <section id="publications" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Research <span className="text-gradient">Publications</span>
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Contributing to the academic community through research and publications
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {publications.map((pub, index) => (
            <Card key={index} className="card-gradient shadow-card hover-lift mb-8 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 opacity-40"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
              
              <CardContent className="p-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Publication Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                      <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  {/* Publication Details */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 leading-tight">
                        {pub.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {pub.date}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {pub.authors.join(", ")}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {pub.type}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2 font-medium">Published in:</p>
                      <p className="text-foreground font-semibold">{pub.journal}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2 font-medium">Abstract:</p>
                      <p className="text-foreground leading-relaxed text-sm">
                        {pub.abstract}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2 font-medium">Keywords:</p>
                      <div className="flex flex-wrap gap-2">
                        {pub.keywords.map((keyword, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button 
                        variant="default" 
                        size="sm"
                        className="w-full md:w-auto"
                        onClick={() => window.open(pub.link, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Publication
                      </Button>
                    </div>
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

export default Publications;
