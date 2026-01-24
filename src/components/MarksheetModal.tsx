import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Award, Calendar, BookOpen, Building2, User, Hash } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

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
  studentName?: string;
}

const MarksheetModal = ({ 
  isOpen, 
  onClose, 
  educationType, 
  educationMark, 
  semesterGrades = [],
  schoolName,
  studentName = "Raunak Kumar"
}: MarksheetModalProps) => {
  
  const totalObtained = educationMark?.subjects?.reduce((sum, s) => sum + (s.obtained_marks || 0), 0) || 0;
  const totalMax = educationMark?.subjects?.reduce((sum, s) => sum + (s.max_marks || 0), 0) || 0;
  const currentCGPA = semesterGrades.length > 0 ? semesterGrades[semesterGrades.length - 1]?.cgpa : 0;

  // BCA Marksheet
  if (educationType === 'BCA') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto p-0 bg-gradient-to-b from-amber-50 to-white border-0">
          <VisuallyHidden>
            <DialogTitle>BCA Grade Card - LNCT University</DialogTitle>
          </VisuallyHidden>
          {/* Outer Decorative Border */}
          <div className="m-2 border-4 border-double border-amber-800/60 bg-white">
            {/* Inner Border with Pattern */}
            <div className="m-2 border-2 border-amber-700/40 p-6">
              
              {/* University Header */}
              <div className="text-center mb-6 border-b-2 border-amber-800/30 pb-4">
                {/* University Logo/Emblem */}
                <div className="flex items-center justify-center gap-4 mb-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg border-2 border-amber-900/50">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-amber-900 tracking-wider uppercase font-serif">
                  LNCT University, Bhopal
                </h1>
                <p className="text-sm text-amber-700 mt-1 italic">
                  (Established under M.P. Act No. 35 of 2014)
                </p>
                <div className="mt-3 py-2 px-4 bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 inline-block rounded">
                  <h2 className="text-lg font-bold text-amber-900 tracking-wide">
                    CONSOLIDATED GRADE CARD
                  </h2>
                </div>
                <p className="text-sm font-semibold text-amber-800 mt-2">
                  Bachelor of Computer Applications (BCA)
                </p>
              </div>

              {/* Student Info Section */}
              <div className="mb-6 bg-amber-50/50 border border-amber-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-700" />
                    <span className="text-amber-600 font-medium">Student Name:</span>
                    <span className="font-bold text-amber-900 uppercase">{studentName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-amber-700" />
                    <span className="text-amber-600 font-medium">Enrollment No:</span>
                    <span className="font-bold text-amber-900">LNCT/BCA/2022/0847</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-700" />
                    <span className="text-amber-600 font-medium">Program:</span>
                    <span className="font-bold text-amber-900">BCA (Regular)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <span className="text-amber-600 font-medium">Session:</span>
                    <span className="font-bold text-amber-900">2022-2025</span>
                  </div>
                </div>
              </div>

              {/* Semester Grades Table */}
              <div className="mb-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-amber-700 to-amber-800 text-white">
                      <th className="border border-amber-900 px-3 py-2 text-sm font-bold">Semester</th>
                      <th className="border border-amber-900 px-3 py-2 text-sm font-bold">Academic Year</th>
                      <th className="border border-amber-900 px-3 py-2 text-sm font-bold">SGPA</th>
                      <th className="border border-amber-900 px-3 py-2 text-sm font-bold">CGPA</th>
                      <th className="border border-amber-900 px-3 py-2 text-sm font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semesterGrades.map((grade, index) => (
                      <tr key={grade.id} className={index % 2 === 0 ? 'bg-amber-50' : 'bg-white'}>
                        <td className="border border-amber-300 px-3 py-2 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-amber-100 text-amber-800 rounded-full font-bold text-sm border border-amber-300">
                            {grade.semester}
                          </span>
                        </td>
                        <td className="border border-amber-300 px-3 py-2 text-center text-amber-800 font-medium">
                          {grade.year || '-'}
                        </td>
                        <td className="border border-amber-300 px-3 py-2 text-center">
                          <span className="inline-block px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 font-bold rounded border border-green-300">
                            {grade.sgpa.toFixed(2)}
                          </span>
                        </td>
                        <td className="border border-amber-300 px-3 py-2 text-center">
                          <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 font-bold rounded border border-blue-300">
                            {grade.cgpa.toFixed(2)}
                          </span>
                        </td>
                        <td className="border border-amber-300 px-3 py-2 text-center">
                          <Badge className="bg-green-100 text-green-700 border-green-300 font-semibold uppercase text-xs">
                            {grade.status || 'PASS'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Result Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-amber-300 rounded-lg p-4 text-center shadow-sm">
                  <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">Current CGPA</p>
                  <p className="text-3xl font-bold text-amber-800">{currentCGPA.toFixed(2)}</p>
                  <div className="w-full bg-amber-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full"
                      style={{ width: `${(currentCGPA / 10) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-100 to-green-50 border-2 border-green-300 rounded-lg p-4 text-center shadow-sm">
                  <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-1">Best SGPA</p>
                  <p className="text-3xl font-bold text-green-700">
                    {semesterGrades.length > 0 ? Math.max(...semesterGrades.map(g => g.sgpa)).toFixed(2) : '0.00'}
                  </p>
                  <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                      style={{ width: `${(semesterGrades.length > 0 ? Math.max(...semesterGrades.map(g => g.sgpa)) / 10 : 0) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-300 rounded-lg p-4 text-center shadow-sm">
                  <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">Progress</p>
                  <p className="text-3xl font-bold text-blue-700">{semesterGrades.length}/6</p>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                      style={{ width: `${(semesterGrades.length / 6) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Grading Scale */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-3 mb-6">
                <p className="text-xs font-semibold text-amber-700 mb-2">GRADING SCALE:</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 bg-white border border-amber-200 rounded">O: 10.0 (Outstanding)</span>
                  <span className="px-2 py-1 bg-white border border-amber-200 rounded">A+: 9.0 (Excellent)</span>
                  <span className="px-2 py-1 bg-white border border-amber-200 rounded">A: 8.0 (Very Good)</span>
                  <span className="px-2 py-1 bg-white border border-amber-200 rounded">B+: 7.0 (Good)</span>
                  <span className="px-2 py-1 bg-white border border-amber-200 rounded">B: 6.0 (Above Average)</span>
                </div>
              </div>

              {/* Signature Section */}
              <div className="flex justify-between items-end pt-4 border-t-2 border-dashed border-amber-300">
                <div className="text-center">
                  <div className="w-32 border-b border-amber-800 mb-1"></div>
                  <p className="text-xs text-amber-700 font-medium">Controller of Examination</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 border-2 border-dashed border-amber-400 rounded-lg flex items-center justify-center bg-amber-50/50">
                    <span className="text-xs text-amber-500">Official Seal</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-32 border-b border-amber-800 mb-1"></div>
                  <p className="text-xs text-amber-700 font-medium">Registrar</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 text-center">
                <p className="text-xs text-amber-600 italic">
                  This is a computer-generated document. Valid without signature for reference purposes.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // 10th/12th Marksheet
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto p-0 bg-gradient-to-b from-blue-50 to-white border-0">
        <VisuallyHidden>
          <DialogTitle>{educationType === '10th' ? 'Class X Marksheet' : 'Class XII Marksheet'}</DialogTitle>
        </VisuallyHidden>
        {/* Outer Decorative Border */}
        <div className="m-2 border-4 border-double border-blue-800/60 bg-white">
          {/* Inner Border */}
          <div className="m-2 border-2 border-blue-700/40 p-6">
            
            {/* Board Header */}
            <div className="text-center mb-6 border-b-2 border-blue-800/30 pb-4">
              <div className="flex items-center justify-center gap-4 mb-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg border-2 border-blue-900/50">
                  <Award className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-xl font-bold text-blue-900 tracking-wider uppercase font-serif">
                {educationMark?.board || 'CBSE'}
              </h1>
              <p className="text-sm text-blue-700 mt-1">
                Central Board of Secondary Education
              </p>
              <div className="mt-3 py-2 px-4 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 inline-block rounded">
                <h2 className="text-lg font-bold text-blue-900 tracking-wide">
                  {educationType === '10th' ? 'CLASS X MARKSHEET' : 'CLASS XII MARKSHEET'}
                </h2>
              </div>
            </div>

            {/* Student Info */}
            <div className="mb-6 bg-blue-50/50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-700" />
                  <span className="text-blue-600 font-medium">Student Name:</span>
                  <span className="font-bold text-blue-900 uppercase">{studentName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-700" />
                  <span className="text-blue-600 font-medium">School:</span>
                  <span className="font-bold text-blue-900">{educationMark?.school_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-700" />
                  <span className="text-blue-600 font-medium">Year:</span>
                  <span className="font-bold text-blue-900">{educationMark?.passing_year}</span>
                </div>
                {educationMark?.stream && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-700" />
                    <span className="text-blue-600 font-medium">Stream:</span>
                    <span className="font-bold text-blue-900">{educationMark.stream}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Subject Marks Table */}
            {educationMark && educationMark.subjects && (
              <div className="mb-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-700 to-blue-800 text-white">
                      <th className="border border-blue-900 px-3 py-2 text-sm font-bold text-left">Subject</th>
                      <th className="border border-blue-900 px-3 py-2 text-sm font-bold text-center">Max Marks</th>
                      <th className="border border-blue-900 px-3 py-2 text-sm font-bold text-center">Obtained</th>
                      <th className="border border-blue-900 px-3 py-2 text-sm font-bold text-center">Percentage</th>
                      <th className="border border-blue-900 px-3 py-2 text-sm font-bold text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {educationMark.subjects.map((subject, index) => (
                      <tr key={subject.id} className={index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                        <td className="border border-blue-300 px-3 py-2 font-medium text-blue-900">
                          {subject.subject_name}
                        </td>
                        <td className="border border-blue-300 px-3 py-2 text-center text-blue-700">
                          {subject.max_marks}
                        </td>
                        <td className="border border-blue-300 px-3 py-2 text-center font-bold text-blue-900">
                          {subject.obtained_marks}
                        </td>
                        <td className="border border-blue-300 px-3 py-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 bg-blue-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                                style={{ width: `${(subject.obtained_marks / subject.max_marks) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-blue-700 font-medium">
                              {((subject.obtained_marks / subject.max_marks) * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="border border-blue-300 px-3 py-2 text-center">
                          <span className="inline-block px-2 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 font-bold rounded border border-green-300 text-sm">
                            {subject.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {/* Total Row */}
                    <tr className="bg-gradient-to-r from-blue-100 to-blue-200">
                      <td className="border border-blue-400 px-3 py-2 font-bold text-blue-900">TOTAL</td>
                      <td className="border border-blue-400 px-3 py-2 text-center font-bold text-blue-900">{totalMax}</td>
                      <td className="border border-blue-400 px-3 py-2 text-center font-bold text-blue-900">{totalObtained}</td>
                      <td className="border border-blue-400 px-3 py-2 text-center font-bold text-blue-900">
                        {((totalObtained / totalMax) * 100).toFixed(1)}%
                      </td>
                      <td className="border border-blue-400 px-3 py-2 text-center">
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-amber-200 to-amber-300 text-amber-900 font-bold rounded border border-amber-400">
                          {educationMark.overall_grade}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Result Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-300 rounded-lg p-4 text-center shadow-sm">
                <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">Overall Percentage</p>
                <p className="text-3xl font-bold text-blue-800">{educationMark?.overall_percentage || 0}%</p>
              </div>
              <div className="bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-amber-300 rounded-lg p-4 text-center shadow-sm">
                <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">Grade</p>
                <p className="text-3xl font-bold text-amber-800">{educationMark?.overall_grade || '-'}</p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-50 border-2 border-green-300 rounded-lg p-4 text-center shadow-sm">
                <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-1">Result</p>
                <p className="text-2xl font-bold text-green-700">PASSED</p>
              </div>
            </div>

            {/* Signature Section */}
            <div className="flex justify-between items-end pt-4 border-t-2 border-dashed border-blue-300">
              <div className="text-center">
                <div className="w-32 border-b border-blue-800 mb-1"></div>
                <p className="text-xs text-blue-700 font-medium">Principal</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center bg-blue-50/50">
                  <span className="text-xs text-blue-500">School Seal</span>
                </div>
              </div>
              <div className="text-center">
                <div className="w-32 border-b border-blue-800 mb-1"></div>
                <p className="text-xs text-blue-700 font-medium">Controller of Exams</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 text-center">
              <p className="text-xs text-blue-600 italic">
                This is a computer-generated document. Valid without signature for reference purposes.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MarksheetModal;
