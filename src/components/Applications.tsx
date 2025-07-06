import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Code2, Mail, Timer, Calculator, User, Monitor } from 'lucide-react';

const Applications = () => {
  const applications = [
    {
      title: "Quiz Application",
      liveLink: "quiz_application_001.renderforestsites.com",
      techStack: ["Java Swing", "SQL", "JavaMail API"],
      features: [
        "Student login with verification",
        "Objective + Coding quiz support", 
        "Real-time countdown timer",
        "Auto-evaluation and score calculation",
        "Result sent to email using JavaMail API",
        "Developer info shown on UI (hidden in code)",
        "Clean, full-screen dashboard interface"
      ],
      icon: <Code2 className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500"
    }
  ];

  const featureIcons = {
    "Student login with verification": <User className="w-4 h-4" />,
    "Objective + Coding quiz support": <Code2 className="w-4 h-4" />,
    "Real-time countdown timer": <Timer className="w-4 h-4" />,
    "Auto-evaluation and score calculation": <Calculator className="w-4 h-4" />,
    "Result sent to email using JavaMail API": <Mail className="w-4 h-4" />,
    "Developer info shown on UI (hidden in code)": <User className="w-4 h-4" />,
    "Clean, full-screen dashboard interface": <Monitor className="w-4 h-4" />
  };

  return (
    <section id="applications" className="py-20 bg-background/95">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Application Development & <span className="text-gradient">Publishing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Live applications built, deployed, and published for real-world use
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {applications.map((app, index) => (
            <Card 
              key={index}
              className="card-gradient shadow-card hover-lift border-0 bg-card/80 backdrop-blur-sm"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 bg-gradient-to-r ${app.color} rounded-lg text-white shadow-glow`}>
                      {app.icon}
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-foreground">{app.title}</CardTitle>
                      <div className="flex items-center mt-2 space-x-2">
                        <ExternalLink className="w-4 h-4 text-accent" />
                        <a 
                          href={`https://${app.liveLink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent/80 transition-smooth text-sm"
                        >
                          {app.liveLink}
                        </a>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-accent/50 text-accent hover:bg-accent/10 hover:border-accent"
                    onClick={() => window.open(`https://${app.liveLink}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Live
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Tech Stack */}
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">🛠 Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {app.techStack.map((tech, techIndex) => (
                      <Badge 
                        key={techIndex}
                        variant="outline" 
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">🎯 Key Features</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {app.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-2">
                        <div className="p-1 bg-primary/20 rounded text-primary mt-1">
                          {featureIcons[feature] || <Code2 className="w-4 h-4" />}
                        </div>
                        <span className="text-muted-foreground text-sm leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
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

export default Applications;