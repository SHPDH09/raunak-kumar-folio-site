import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, Award, Calendar, MapPin, BookOpen } from 'lucide-react';

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

interface SemesterGrade {
  id: string;
  semester: number;
  sgpa: number;
  cgpa: number;
  year: string;
  status: string;
}

interface MarksheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  educationType: 'BCA' | '10th' | '12th';
  educationMark?: EducationMark | null;
  semesterGrades?: SemesterGrade[];
  schoolName?: string;
}

const MarksheetModal = ({ 
  isOpen, 
  onClose, 
  educationType, 
  educationMark, 
  semesterGrades = [],
  schoolName 
}: MarksheetModalProps) => {
  const getTitle = () => {
    switch (educationType) {
      case 'BCA': return 'BCA - Semester Marksheet';
      case '12th': return 'Class XII - Marksheet';
      case '10th': return 'Class X - Marksheet';
      default: return 'Marksheet';
    }
  };

  const totalObtained = educationMark?.subjects?.reduce((sum, s) => sum + (s.obtained_marks || 0), 0) || 0;
  const totalMax = educationMark?.subjects?.reduce((sum, s) => sum + (s.max_marks || 0), 0) || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20 border-accent/20">
        <DialogHeader className="border-b border-accent/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/10 rounded-xl">
              <GraduationCap className="w-6 h-6 text-accent" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-foreground">{getTitle()}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">Academic Performance Record</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* BCA Semester Grades */}
          {educationType === 'BCA' && semesterGrades.length > 0 && (
            <>
              {/* Header Info */}
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-accent" />
                    <span className="text-muted-foreground">Program:</span>
                    <span className="font-semibold text-foreground">Bachelor of Computer Applications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span className="text-muted-foreground">University:</span>
                    <span className="font-semibold text-foreground">{schoolName || 'IGNOU'}</span>
                  </div>
                </div>
              </div>

              {/* Semester Table */}
              <div className="border border-accent/20 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-accent/10">
                    <tr>
                      <th className="text-left p-3 text-sm font-semibold text-foreground">Semester</th>
                      <th className="text-center p-3 text-sm font-semibold text-foreground">Year</th>
                      <th className="text-center p-3 text-sm font-semibold text-foreground">SGPA</th>
                      <th className="text-center p-3 text-sm font-semibold text-foreground">CGPA</th>
                      <th className="text-center p-3 text-sm font-semibold text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semesterGrades.map((grade, index) => (
                      <tr key={grade.id} className={index % 2 === 0 ? 'bg-muted/5' : 'bg-transparent'}>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 flex items-center justify-center bg-accent/20 text-accent rounded-full font-bold text-sm">
                              {grade.semester}
                            </span>
                            <span className="text-foreground font-medium">Semester {grade.semester}</span>
                          </div>
                        </td>
                        <td className="text-center p-3 text-muted-foreground">{grade.year || '-'}</td>
                        <td className="text-center p-3">
                          <Badge className="bg-accent/20 text-accent border-accent/30 font-bold">
                            {grade.sgpa.toFixed(2)}
                          </Badge>
                        </td>
                        <td className="text-center p-3">
                          <Badge className="bg-primary/20 text-primary border-primary/30 font-bold">
                            {grade.cgpa.toFixed(2)}
                          </Badge>
                        </td>
                        <td className="text-center p-3">
                          <Badge variant="outline" className="text-xs capitalize bg-green-500/10 text-green-400 border-green-500/30">
                            {grade.status || 'Completed'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Current CGPA</p>
                  <p className="text-3xl font-bold text-accent">{semesterGrades[semesterGrades.length - 1]?.cgpa.toFixed(2)}</p>
                  <Progress value={(semesterGrades[semesterGrades.length - 1]?.cgpa / 10) * 100} className="mt-2 h-2" />
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Best SGPA</p>
                  <p className="text-3xl font-bold text-primary">{Math.max(...semesterGrades.map(g => g.sgpa)).toFixed(2)}</p>
                  <Progress value={(Math.max(...semesterGrades.map(g => g.sgpa)) / 10) * 100} className="mt-2 h-2" />
                </div>
                <div className="bg-gradient-to-br from-primary-glow/10 to-primary-glow/5 border border-primary-glow/30 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Semesters</p>
                  <p className="text-3xl font-bold text-primary-glow">{semesterGrades.length}/6</p>
                  <Progress value={(semesterGrades.length / 6) * 100} className="mt-2 h-2" />
                </div>
              </div>
            </>
          )}

          {/* 10th/12th Marksheet */}
          {(educationType === '10th' || educationType === '12th') && educationMark && (
            <>
              {/* Header Info */}
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-accent" />
                    <span className="text-muted-foreground">School:</span>
                    <span className="font-semibold text-foreground">{educationMark.school_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-accent" />
                    <span className="text-muted-foreground">Board:</span>
                    <span className="font-semibold text-foreground">{educationMark.board}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span className="text-muted-foreground">Year:</span>
                    <span className="font-semibold text-foreground">{educationMark.passing_year}</span>
                  </div>
                  {educationMark.stream && (
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-accent" />
                      <span className="text-muted-foreground">Stream:</span>
                      <span className="font-semibold text-foreground">{educationMark.stream}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Subject-wise Marks Table */}
              <div className="border border-accent/20 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-accent/10">
                    <tr>
                      <th className="text-left p-3 text-sm font-semibold text-foreground">Subject</th>
                      <th className="text-center p-3 text-sm font-semibold text-foreground">Max Marks</th>
                      <th className="text-center p-3 text-sm font-semibold text-foreground">Obtained</th>
                      <th className="text-center p-3 text-sm font-semibold text-foreground">%</th>
                      <th className="text-center p-3 text-sm font-semibold text-foreground">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {educationMark.subjects?.map((subject, index) => (
                      <tr key={subject.id} className={index % 2 === 0 ? 'bg-muted/5' : 'bg-transparent'}>
                        <td className="p-3">
                          <span className="text-foreground font-medium">{subject.subject_name}</span>
                        </td>
                        <td className="text-center p-3 text-muted-foreground">{subject.max_marks}</td>
                        <td className="text-center p-3">
                          <span className="font-semibold text-foreground">{subject.obtained_marks}</span>
                        </td>
                        <td className="text-center p-3">
                          <div className="flex items-center justify-center gap-2">
                            <Progress value={(subject.obtained_marks / subject.max_marks) * 100} className="w-16 h-2" />
                            <span className="text-sm text-muted-foreground">
                              {((subject.obtained_marks / subject.max_marks) * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="text-center p-3">
                          <Badge className="bg-accent/20 text-accent border-accent/30">
                            {subject.grade}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {/* Total Row */}
                    <tr className="bg-accent/10 font-semibold">
                      <td className="p-3 text-foreground">Total</td>
                      <td className="text-center p-3 text-foreground">{totalMax}</td>
                      <td className="text-center p-3 text-foreground">{totalObtained}</td>
                      <td className="text-center p-3 text-accent">{((totalObtained / totalMax) * 100).toFixed(1)}%</td>
                      <td className="text-center p-3">
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          {educationMark.overall_grade}
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Result Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Overall Percentage</p>
                  <p className="text-3xl font-bold text-accent">{educationMark.overall_percentage}%</p>
                  <Progress value={educationMark.overall_percentage} className="mt-2 h-2" />
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Grade</p>
                  <p className="text-3xl font-bold text-primary">{educationMark.overall_grade}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Result</p>
                  <p className="text-2xl font-bold text-green-400">PASSED</p>
                </div>
              </div>
            </>
          )}

          {/* No data message */}
          {((educationType === 'BCA' && semesterGrades.length === 0) || 
            ((educationType === '10th' || educationType === '12th') && !educationMark)) && (
            <div className="text-center py-8 text-muted-foreground">
              <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Marks data not available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MarksheetModal;