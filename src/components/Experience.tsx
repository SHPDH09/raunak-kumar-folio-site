import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, GraduationCap, Award, Users, Loader2, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import MarksheetModal from './MarksheetModal';

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

interface SubjectMark {
  id: string;
  subject_name: string;
  max_marks: number;
  obtained_marks: number;
  grade: string;
  display_order: number;
}

interface EducationMark {
  id: string;
  education_type: string;
  board: string;
  school_name: string;
  passing_year: string;
  overall_percentage: number;
  overall_grade: string;
  stream: string | null;
  subjects: SubjectMark[];
}

const Experience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [semesterGrades, setSemesterGrades] = useState<SemesterGrade[]>([]);
  const [educationMarks, setEducationMarks] = useState<EducationMark[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEducationType, setSelectedEducationType] = useState<'BCA' | '10th' | '12th'>('BCA');
  const [selectedEducationMark, setSelectedEducationMark] = useState<EducationMark | null>(null);

  const openMarksheet = (educationType: 'BCA' | '10th' | '12th') => {
    setSelectedEducationType(educationType);
    if (educationType !== 'BCA') {
      const mark = educationMarks.find(m => m.education_type === educationType);
      setSelectedEducationMark(mark || null);
    }
    setModalOpen(true);
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

      // Load semester grades
      const { data: gradesData, error: gradesError } = await supabase
        .from('portfolio_semester_grades' as any)
        .select('*')
        .order('semester') as { data: SemesterGrade[] | null; error: any };

      if (gradesData && !gradesError) {
        setSemesterGrades(gradesData);
      }

      // Load education marks (10th, 12th)
      const { data: marksData, error: marksError } = await supabase
        .from('portfolio_education_marks' as any)
        .select('*') as { data: any[] | null; error: any };

      if (marksData && !marksError) {
        // Load subject marks for each education
        const marksWithSubjects = await Promise.all(
          marksData.map(async (mark) => {
            const { data: subjectsData } = await supabase
              .from('portfolio_subject_marks' as any)
              .select('*')
              .eq('education_marks_id', mark.id)
              .order('display_order') as { data: SubjectMark[] | null; error: any };
            
            return {
              ...mark,
              subjects: subjectsData || []
            } as EducationMark;
          })
        );
        setEducationMarks(marksWithSubjects);
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
                          
                          {/* View Marks Button - Opens Modal */}
                          <div className="mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (exp.title.includes('BCA')) {
                                  openMarksheet('BCA');
                                } else if (exp.title.includes('12th') || exp.title.includes('XII') || exp.title.includes('Higher Secondary')) {
                                  openMarksheet('12th');
                                } else if (exp.title.includes('10th') || exp.title.includes('X') || exp.title.includes('Secondary')) {
                                  openMarksheet('10th');
                                }
                              }}
                              className="w-full bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30 hover:from-accent/20 hover:to-primary/20 text-accent hover:text-accent"
                            >
                              <BarChart3 className="w-4 h-4 mr-2" />
                              View Marks
                            </Button>
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

      {/* Marksheet Modal */}
      <MarksheetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        educationType={selectedEducationType}
        educationMark={selectedEducationMark}
        semesterGrades={semesterGrades}
      />
    </section>
  );
};

export default Experience;