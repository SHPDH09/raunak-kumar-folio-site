import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, GraduationCap, Award, Users, Loader2, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Experience {
  id: string;
  title: string;
  organization: string;
  type: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  location: string;
  display_order: number;
}

interface SemesterGrade {
  id: string;
  semester: number;
  sgpa: number;
  cgpa: number;
  year: string;
  status: string;
}

const Experience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [semesterGrades, setSemesterGrades] = useState<SemesterGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMarks, setExpandedMarks] = useState<Record<string, boolean>>({});

  const toggleMarks = (id: string) => {
    setExpandedMarks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load experiences
      const { data: expData } = await supabase
        .from('portfolio_experience')
        .select('*')
        .order('display_order');

      if (expData) {
        setExperiences(expData as Experience[]);
      }

      // Load semester grades using raw query since table is new
      const { data: gradesData, error: gradesError } = await supabase
        .from('portfolio_semester_grades' as any)
        .select('*')
        .order('semester') as { data: SemesterGrade[] | null; error: any };

      if (gradesData && !gradesError) {
        setSemesterGrades(gradesData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      work: <Briefcase className="w-5 h-5" />,
      internship: <Briefcase className="w-5 h-5" />,
      leadership: <Users className="w-5 h-5" />,
      education: <GraduationCap className="w-5 h-5" />,
      award: <Award className="w-5 h-5" />
    };
    return icons[type] || <Briefcase className="w-5 h-5" />;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      current: "bg-accent/20 text-accent border-accent/30",
      work: "bg-primary/20 text-primary border-primary/30",
      internship: "bg-primary/20 text-primary border-primary/30",
      leadership: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      education: "bg-green-500/20 text-green-400 border-green-500/30",
      award: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    };
    return colors[type] || "bg-muted/20 text-muted-foreground border-muted/30";
  };

  const formatDuration = (start: string, end: string, isCurrent: boolean) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    
    if (isCurrent) {
      return `${startYear} - Present`;
    }
    return `${startYear} - ${endYear}`;
  };

  if (loading) {
    return (
      <section id="experience" className="py-20 bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

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

        <div className="max-w-4xl mx-auto">
          {/* Career Path Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-primary to-primary-glow"></div>
            
            {experiences.map((exp, index) => (
              <div key={exp.id} className="relative mb-12 last:mb-0">
                {/* Timeline Node */}
                <div className="absolute left-6 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-glow"></div>
                
                {/* Experience Card */}
                <div className="ml-16">
                  <Card className="card-gradient shadow-card hover-lift border-l-4 border-l-primary">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-primary/10 rounded-lg text-primary">
                            {getIcon(exp.type)}
                          </div>
                          <div>
                            <CardTitle className="text-xl font-semibold text-foreground">
                              {exp.title}
                            </CardTitle>
                            <p className="text-primary font-medium text-lg">{exp.organization}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getTypeColor(exp.type)} variant="outline">
                            {exp.type === 'work' ? 'Internship' : exp.type.charAt(0).toUpperCase() + exp.type.slice(1)}
                          </Badge>
                          <p className="text-sm text-accent font-medium mt-1">
                            {formatDuration(exp.start_date, exp.end_date, exp.is_current)}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {exp.type === 'education' ? (
                        <div className="mb-4">
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {exp.description?.split('|')[0]?.trim()}
                          </p>
                          
                          {/* View Marks Button for all education entries */}
                          <div className="mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleMarks(exp.id)}
                              className="w-full bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30 hover:from-accent/20 hover:to-primary/20 text-accent hover:text-accent"
                            >
                              <BarChart3 className="w-4 h-4 mr-2" />
                              {expandedMarks[exp.id] ? 'Hide Marks' : 'View Marks'}
                              {expandedMarks[exp.id] ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                            </Button>
                            
                            {/* Marks Display */}
                            {expandedMarks[exp.id] && (
                              <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                                {/* BCA - Semester Grades */}
                                {exp.title.includes('BCA') && semesterGrades.length > 0 && (
                                  <>
                                    <p className="text-sm font-medium text-foreground mb-4">📊 Semester-wise Performance:</p>
                                    <div className="space-y-3">
                                      {semesterGrades.map((grade) => (
                                        <div 
                                          key={grade.id} 
                                          className="bg-gradient-to-r from-accent/5 to-primary/5 border border-accent/20 rounded-lg p-3"
                                        >
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-foreground">Semester {grade.semester}</span>
                                            <div className="flex gap-3">
                                              <span className="text-sm text-accent font-semibold">SGPA: {grade.sgpa}</span>
                                              <span className="text-sm text-primary font-semibold">CGPA: {grade.cgpa}</span>
                                            </div>
                                          </div>
                                          {/* SGPA Progress Bar */}
                                          <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
                                            <div 
                                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500"
                                              style={{ width: `${(grade.sgpa / 10) * 100}%` }}
                                            />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    
                                    {/* Summary Stats */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                                      <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 rounded-lg p-3 text-center">
                                        <p className="text-xs text-muted-foreground mb-1">Current CGPA</p>
                                        <p className="text-2xl font-bold text-accent">{semesterGrades[semesterGrades.length - 1]?.cgpa}</p>
                                        <div className="mt-2 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-accent rounded-full"
                                            style={{ width: `${(semesterGrades[semesterGrades.length - 1]?.cgpa / 10) * 100}%` }}
                                          />
                                        </div>
                                      </div>
                                      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-lg p-3 text-center">
                                        <p className="text-xs text-muted-foreground mb-1">Semesters Done</p>
                                        <p className="text-2xl font-bold text-primary">{semesterGrades.length}/6</p>
                                        <div className="mt-2 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-primary rounded-full"
                                            style={{ width: `${(semesterGrades.length / 6) * 100}%` }}
                                          />
                                        </div>
                                      </div>
                                      <div className="bg-gradient-to-br from-primary-glow/10 to-primary-glow/5 border border-primary-glow/30 rounded-lg p-3 text-center col-span-2 md:col-span-1">
                                        <p className="text-xs text-muted-foreground mb-1">Best SGPA</p>
                                        <p className="text-2xl font-bold text-primary-glow">
                                          {Math.max(...semesterGrades.map(g => g.sgpa))}
                                        </p>
                                        <div className="mt-2 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-primary-glow rounded-full"
                                            style={{ width: `${(Math.max(...semesterGrades.map(g => g.sgpa)) / 10) * 100}%` }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                                
                                {/* 12th Class Marks */}
                                {(exp.title.includes('12th') || exp.title.includes('XII') || exp.title.includes('Intermediate') || exp.title.includes('Higher Secondary')) && (
                                  <div className="space-y-4">
                                    <p className="text-sm font-medium text-foreground mb-3">📊 12th Class Performance:</p>
                                    <div className="bg-gradient-to-r from-accent/5 to-primary/5 border border-accent/20 rounded-lg p-4">
                                      <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-foreground">Overall Percentage</span>
                                        <span className="text-lg font-bold text-accent">72.4%</span>
                                      </div>
                                      <div className="relative h-3 bg-muted/30 rounded-full overflow-hidden">
                                        <div 
                                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500"
                                          style={{ width: '72.4%' }}
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 rounded-lg p-3 text-center">
                                        <p className="text-xs text-muted-foreground mb-1">Board</p>
                                        <p className="text-sm font-semibold text-accent">CBSE</p>
                                      </div>
                                      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-lg p-3 text-center">
                                        <p className="text-xs text-muted-foreground mb-1">Stream</p>
                                        <p className="text-sm font-semibold text-primary">Science (PCM)</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {/* 10th Class Marks */}
                                {(exp.title.includes('10th') || exp.title.includes('X') || exp.title.includes('Matriculation') || exp.title.includes('Secondary')) && !exp.title.includes('12th') && !exp.title.includes('Higher') && (
                                  <div className="space-y-4">
                                    <p className="text-sm font-medium text-foreground mb-3">📊 10th Class Performance:</p>
                                    <div className="bg-gradient-to-r from-accent/5 to-primary/5 border border-accent/20 rounded-lg p-4">
                                      <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-foreground">Overall Percentage</span>
                                        <span className="text-lg font-bold text-accent">81.0%</span>
                                      </div>
                                      <div className="relative h-3 bg-muted/30 rounded-full overflow-hidden">
                                        <div 
                                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500"
                                          style={{ width: '81%' }}
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 rounded-lg p-3 text-center">
                                        <p className="text-xs text-muted-foreground mb-1">Board</p>
                                        <p className="text-sm font-semibold text-accent">CBSE</p>
                                      </div>
                                      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-lg p-3 text-center">
                                        <p className="text-xs text-muted-foreground mb-1">Grade</p>
                                        <p className="text-sm font-semibold text-primary">A+</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {exp.description}
                        </p>
                      )}
                      
                      {exp.location && (
                        <Badge variant="secondary" className="text-xs px-2 py-1">
                          📍 {exp.location}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;