import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Award, Calendar, BookOpen, Building2, User, Hash, ShieldCheck } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import lnctLogo from '@/assets/lnct-logo.png';
import bsebLogo from '@/assets/bseb-logo.png';

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
                {/* University Logo */}
                <div className="flex items-center justify-center gap-4 mb-3">
                  <img 
                    src={lnctLogo} 
                    alt="LNCT University Logo" 
                    className="h-16 w-auto object-contain"
                  />
                </div>
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
                    <span className="font-bold text-amber-900">LNCDBCA21186</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-700" />
                    <span className="text-amber-600 font-medium">Specialization:</span>
                    <span className="font-bold text-amber-900">AI & Data Analyst</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <span className="text-amber-600 font-medium">Session:</span>
                    <span className="font-bold text-amber-900">2023-2026</span>
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
              <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-bold text-amber-800 mb-3 uppercase tracking-wide border-b border-amber-200 pb-2">Grading Scale</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                  <div className="px-3 py-2 bg-white border border-amber-200 rounded text-center">
                    <span className="font-bold text-amber-900">O</span>
                    <span className="text-amber-600 block">10.0 (Outstanding)</span>
                  </div>
                  <div className="px-3 py-2 bg-white border border-amber-200 rounded text-center">
                    <span className="font-bold text-amber-900">A+</span>
                    <span className="text-amber-600 block">9.0 (Excellent)</span>
                  </div>
                  <div className="px-3 py-2 bg-white border border-amber-200 rounded text-center">
                    <span className="font-bold text-amber-900">A</span>
                    <span className="text-amber-600 block">8.0 (Very Good)</span>
                  </div>
                  <div className="px-3 py-2 bg-white border border-amber-200 rounded text-center">
                    <span className="font-bold text-amber-900">B+</span>
                    <span className="text-amber-600 block">7.0 (Good)</span>
                  </div>
                  <div className="px-3 py-2 bg-white border border-amber-200 rounded text-center">
                    <span className="font-bold text-amber-900">B</span>
                    <span className="text-amber-600 block">6.0 (Above Avg)</span>
                  </div>
                </div>
              </div>

              {/* Digital Verification Section */}
              <div className="flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-green-50 via-green-100 to-green-50 border-2 border-green-300 rounded-lg">
                <ShieldCheck className="w-8 h-8 text-green-600" />
                <div className="text-center">
                  <p className="text-sm font-bold text-green-800 uppercase tracking-wide">Digitally Verified</p>
                  <p className="text-xs text-green-600">This document is digitally verified by LNCT University, Bhopal</p>
                </div>
                <ShieldCheck className="w-8 h-8 text-green-600" />
              </div>

              {/* Footer */}
              <div className="mt-4 text-center">
                <p className="text-xs text-amber-600 italic">
                  This is a computer-generated document and does not require a physical signature.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // 10th/12th Marksheet - BSEB Bihar Board
  const is12th = educationType === '12th';
  
  // Hardcoded BSEB marks data
  const bseb12thMarks = [
    { id: '1', subject_name: 'Hindi', max_marks: 100, obtained_marks: 51, grade: 'C' },
    { id: '2', subject_name: 'English', max_marks: 100, obtained_marks: 54, grade: 'C' },
    { id: '3', subject_name: 'Physics', max_marks: 100, obtained_marks: 64, grade: 'B' },
    { id: '4', subject_name: 'Chemistry', max_marks: 100, obtained_marks: 64, grade: 'B' },
    { id: '5', subject_name: 'Mathematics', max_marks: 100, obtained_marks: 77, grade: 'A' },
  ];
  
  const bseb10thMarks = [
    { id: '1', subject_name: 'Hindi', max_marks: 100, obtained_marks: 67, grade: 'B' },
    { id: '2', subject_name: 'English (Additional)', max_marks: 100, obtained_marks: 52, grade: 'C', isOptional: true },
    { id: '3', subject_name: 'Sanskrit', max_marks: 100, obtained_marks: 62, grade: 'B' },
    { id: '4', subject_name: 'Mathematics', max_marks: 100, obtained_marks: 52, grade: 'C' },
    { id: '5', subject_name: 'Science', max_marks: 100, obtained_marks: 65, grade: 'B' },
    { id: '6', subject_name: 'Social Science', max_marks: 100, obtained_marks: 57, grade: 'C' },
  ];
  
  const currentMarks = is12th ? bseb12thMarks : bseb10thMarks;
  const rollNumber = is12th ? '22010068' : '1900211';
  const session = is12th ? '2021-2022' : '2018-2019';
  const totalMarks = is12th ? 310 : 303;
  const totalMaxMarks = is12th ? 500 : 500; // 5 subjects for 10th (excluding English as optional)
  const percentageValue = is12th ? (310/500)*100 : (303/500)*100;
  const percentage = percentageValue.toFixed(1);
  const cgpa = (percentageValue / 9.5).toFixed(2);
  
  // Calculate division based on BSEB criteria
  const getDivision = (pct: number) => {
    if (pct >= 60) return 'FIRST';
    if (pct >= 45) return 'SECOND';
    if (pct >= 30) return 'THIRD';
    return 'FAIL';
  };
  const division = getDivision(percentageValue);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto p-0 bg-gradient-to-b from-red-50 to-white border-0">
        <VisuallyHidden>
          <DialogTitle>{is12th ? 'Class XII Marksheet - BSEB' : 'Class X Marksheet - BSEB'}</DialogTitle>
        </VisuallyHidden>
        {/* Outer Decorative Border */}
        <div className="m-2 border-4 border-double border-red-800/60 bg-white">
          {/* Inner Border */}
          <div className="m-2 border-2 border-red-700/40 p-6">
            
            {/* Board Header */}
            <div className="text-center mb-6 border-b-2 border-red-800/30 pb-4">
              <div className="flex items-center justify-center gap-4 mb-3">
                <img 
                  src={bsebLogo} 
                  alt="BSEB Logo" 
                  className="h-20 w-20 object-contain"
                />
              </div>
              <h1 className="text-xl font-bold text-red-900 tracking-wider uppercase font-serif">
                बिहार विद्यालय परीक्षा समिति
              </h1>
              <p className="text-lg font-bold text-red-800">
                BIHAR SCHOOL EXAMINATION BOARD, PATNA
              </p>
              <div className="mt-3 py-2 px-4 bg-gradient-to-r from-red-100 via-red-200 to-red-100 inline-block rounded">
                <h2 className="text-lg font-bold text-red-900 tracking-wide">
                  {is12th ? 'INTERMEDIATE EXAMINATION (CLASS XII)' : 'SECONDARY EXAMINATION (CLASS X)'}
                </h2>
              </div>
              <p className="text-sm font-semibold text-red-700 mt-2">
                {is12th ? 'SCIENCE STREAM' : 'GENERAL COURSE'}
              </p>
            </div>

            {/* Student Info */}
            <div className="mb-6 bg-red-50/50 border border-red-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-red-700" />
                  <span className="text-red-600 font-medium">Student Name:</span>
                  <span className="font-bold text-red-900 uppercase">{studentName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-red-700" />
                  <span className="text-red-600 font-medium">Roll Number:</span>
                  <span className="font-bold text-red-900">{rollNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-700" />
                  <span className="text-red-600 font-medium">Session:</span>
                  <span className="font-bold text-red-900">{session}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-red-700" />
                  <span className="text-red-600 font-medium">Board:</span>
                  <span className="font-bold text-red-900">BSEB, Patna</span>
                </div>
              </div>
            </div>

            {/* Subject Marks Table */}
            <div className="mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-red-700 to-red-800 text-white">
                    <th className="border border-red-900 px-3 py-2 text-sm font-bold text-left">Subject</th>
                    <th className="border border-red-900 px-3 py-2 text-sm font-bold text-center">Max Marks</th>
                    <th className="border border-red-900 px-3 py-2 text-sm font-bold text-center">Obtained</th>
                    <th className="border border-red-900 px-3 py-2 text-sm font-bold text-center">Percentage</th>
                    <th className="border border-red-900 px-3 py-2 text-sm font-bold text-center">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMarks.map((subject, index) => (
                    <tr key={subject.id} className={`${index % 2 === 0 ? 'bg-red-50' : 'bg-white'} ${(subject as any).isOptional ? 'opacity-70' : ''}`}>
                      <td className="border border-red-300 px-3 py-2 font-medium text-red-900">
                        {subject.subject_name}
                        {(subject as any).isOptional && (
                          <span className="text-xs text-red-500 ml-2">(Not Mandatory)</span>
                        )}
                      </td>
                      <td className="border border-red-300 px-3 py-2 text-center text-red-700">
                        {subject.max_marks}
                      </td>
                      <td className="border border-red-300 px-3 py-2 text-center font-bold text-red-900">
                        {subject.obtained_marks}
                      </td>
                      <td className="border border-red-300 px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-red-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                              style={{ width: `${(subject.obtained_marks / subject.max_marks) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-red-700 font-medium">
                            {((subject.obtained_marks / subject.max_marks) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="border border-red-300 px-3 py-2 text-center">
                        <span className="inline-block px-2 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 font-bold rounded border border-green-300 text-sm">
                          {subject.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-gradient-to-r from-red-100 to-red-200">
                    <td className="border border-red-400 px-3 py-2 font-bold text-red-900">
                      TOTAL
                      {!is12th && <span className="text-xs text-red-600 ml-2">(Excluding Additional English)</span>}
                    </td>
                    <td className="border border-red-400 px-3 py-2 text-center font-bold text-red-900">{totalMaxMarks}</td>
                    <td className="border border-red-400 px-3 py-2 text-center font-bold text-red-900">{totalMarks}</td>
                    <td className="border border-red-400 px-3 py-2 text-center font-bold text-red-900">
                      {percentage}%
                    </td>
                    <td className="border border-red-400 px-3 py-2 text-center">
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-amber-200 to-amber-300 text-amber-900 font-bold rounded border border-amber-400">
                        {is12th ? 'B' : 'B'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Result Summary */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-red-100 to-red-50 border-2 border-red-300 rounded-lg p-4 text-center shadow-sm">
                <p className="text-xs text-red-600 font-semibold uppercase tracking-wide mb-1">Total Marks</p>
                <p className="text-2xl font-bold text-red-800">{totalMarks}/{totalMaxMarks}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-300 rounded-lg p-4 text-center shadow-sm">
                <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">Percentage</p>
                <p className="text-3xl font-bold text-blue-800">{percentage}%</p>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 border-2 border-purple-300 rounded-lg p-4 text-center shadow-sm">
                <p className="text-xs text-purple-600 font-semibold uppercase tracking-wide mb-1">CGPA</p>
                <p className="text-3xl font-bold text-purple-800">{cgpa}</p>
              </div>
              <div className="bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-amber-300 rounded-lg p-4 text-center shadow-sm">
                <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">Division</p>
                <p className="text-2xl font-bold text-amber-800">{division}</p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-50 border-2 border-green-300 rounded-lg p-4 text-center shadow-sm">
                <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-1">Result</p>
                <p className="text-2xl font-bold text-green-700">PASSED</p>
              </div>
            </div>

            {/* Digital Verification Section */}
            <div className="flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-green-50 via-green-100 to-green-50 border-2 border-green-300 rounded-lg">
              <ShieldCheck className="w-8 h-8 text-green-600" />
              <div className="text-center">
                <p className="text-sm font-bold text-green-800 uppercase tracking-wide">Digitally Verified</p>
                <p className="text-xs text-green-600">This document is digitally verified by Bihar School Examination Board, Patna</p>
              </div>
              <ShieldCheck className="w-8 h-8 text-green-600" />
            </div>

            {/* Footer */}
            <div className="mt-4 text-center">
              <p className="text-xs text-red-600 italic">
                This is a computer-generated document and does not require a physical signature.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MarksheetModal;
