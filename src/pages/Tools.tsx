import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Database, BarChart3, Brain, Zap, TrendingUp, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Tools = () => {
  const navigate = useNavigate();

  const tools = [
    {
      id: 'data-preprocessing',
      title: 'Data Preprocessing',
      description: 'Clean, transform, and prepare your data for analysis and machine learning',
      icon: Database,
      features: ['Data Cleaning', 'Feature Engineering', 'Missing Value Handling', 'Data Normalization'],
      status: 'Available',
      color: 'bg-blue-500'
    },
    {
      id: 'data-visualization',
      title: 'Data Visualization',
      description: 'Create interactive charts and graphs to explore and present your data',
      icon: BarChart3,
      features: ['Interactive Charts', 'Statistical Plots', 'Dashboard Creation', 'Export Options'],
      status: 'Available',
      color: 'bg-green-500'
    },
    {
      id: 'model-training',
      title: 'Model Training',
      description: 'Train and evaluate machine learning models with various algorithms',
      icon: Brain,
      features: ['Multiple Algorithms', 'Model Evaluation', 'Hyperparameter Tuning', 'Cross Validation'],
      status: 'Available',
      color: 'bg-purple-500'
    }
  ];

  const handleToolClick = (toolId: string) => {
    // Navigate to specific tool page or show coming soon message
    console.log(`Opening tool: ${toolId}`);
    // You can implement navigation to specific tool pages here
    // navigate(`/tools/${toolId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Portfolio
            </Button>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Data Science Tools</h1>
              <p className="text-sm text-muted-foreground">Powerful tools for data analysis and machine learning</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Introduction Section */}
        <section className="mb-12 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-primary mr-3" />
              <h2 className="text-3xl font-bold">Choose Your Tool</h2>
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              Select from our collection of data science tools to process, visualize, and analyze your data
            </p>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="text-sm">
                <TrendingUp className="h-3 w-3 mr-1" />
                Professional Grade
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Settings className="h-3 w-3 mr-1" />
                Easy to Use
              </Badge>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Card key={tool.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${tool.color}/10`}>
                      <tool.icon className={`h-6 w-6 text-white`} style={{ color: tool.color.replace('bg-', '').replace('-500', '') === 'blue' ? '#3b82f6' : tool.color.replace('bg-', '').replace('-500', '') === 'green' ? '#10b981' : '#8b5cf6' }} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {tool.status}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-foreground">Key Features:</h4>
                      <ul className="space-y-1">
                        {tool.features.map((feature, index) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-center">
                            <div className="h-1 w-1 bg-primary rounded-full mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      onClick={() => handleToolClick(tool.id)}
                      className="w-full transition-smooth"
                      size="sm"
                    >
                      Launch Tool
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="text-center">
          <Card className="max-w-md mx-auto border-dashed border-2 border-border/50">
            <CardContent className="pt-6">
              <div className="text-muted-foreground mb-4">
                <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">More Tools Coming Soon</h3>
                <p className="text-sm">
                  We're constantly adding new tools to help you with your data science workflow.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Tools;