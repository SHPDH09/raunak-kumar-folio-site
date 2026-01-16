import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, Save, GraduationCap } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SemesterGrade {
  id: string;
  semester: number;
  sgpa: number;
  cgpa: number;
  year: string;
  status: string;
  display_order: number;
}

const PortfolioSemesterGradesAdmin = () => {
  const [grades, setGrades] = useState<SemesterGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGrade, setNewGrade] = useState({
    semester: 1,
    sgpa: '',
    cgpa: '',
    year: '',
    status: 'completed'
  });

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_semester_grades')
        .select('*')
        .order('semester');

      if (error) throw error;
      setGrades(data || []);
    } catch (error) {
      console.error('Error loading grades:', error);
      toast.error('Failed to load semester grades');
    } finally {
      setLoading(false);
    }
  };

  const addGrade = async () => {
    if (!newGrade.sgpa || !newGrade.cgpa) {
      toast.error('Please enter SGPA and CGPA');
      return;
    }

    try {
      const { error } = await supabase
        .from('portfolio_semester_grades')
        .insert({
          semester: newGrade.semester,
          sgpa: parseFloat(newGrade.sgpa),
          cgpa: parseFloat(newGrade.cgpa),
          year: newGrade.year,
          status: newGrade.status,
          display_order: newGrade.semester
        });

      if (error) throw error;

      toast.success('Semester grade added!');
      setNewGrade({ semester: 1, sgpa: '', cgpa: '', year: '', status: 'completed' });
      loadGrades();
    } catch (error) {
      console.error('Error adding grade:', error);
      toast.error('Failed to add semester grade');
    }
  };

  const updateGrade = async (id: string, field: string, value: string | number) => {
    try {
      const updateData: Record<string, string | number> = {};
      if (field === 'sgpa' || field === 'cgpa') {
        updateData[field] = parseFloat(value as string);
      } else {
        updateData[field] = value;
      }

      const { error } = await supabase
        .from('portfolio_semester_grades')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      toast.success('Updated!');
      loadGrades();
    } catch (error) {
      console.error('Error updating grade:', error);
      toast.error('Failed to update');
    }
  };

  const deleteGrade = async (id: string) => {
    if (!confirm('Delete this semester grade?')) return;

    try {
      const { error } = await supabase
        .from('portfolio_semester_grades')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Deleted!');
      loadGrades();
    } catch (error) {
      console.error('Error deleting grade:', error);
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return <Card><CardContent className="p-6">Loading...</CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Semester Grades
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Grade */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 p-4 bg-muted/50 rounded-lg">
          <div>
            <Label>Semester</Label>
            <Select
              value={String(newGrade.semester)}
              onValueChange={(v) => setNewGrade({ ...newGrade, semester: parseInt(v) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <SelectItem key={sem} value={String(sem)}>
                    Semester {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>SGPA</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="10"
              placeholder="8.50"
              value={newGrade.sgpa}
              onChange={(e) => setNewGrade({ ...newGrade, sgpa: e.target.value })}
            />
          </div>
          <div>
            <Label>CGPA</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="10"
              placeholder="8.67"
              value={newGrade.cgpa}
              onChange={(e) => setNewGrade({ ...newGrade, cgpa: e.target.value })}
            />
          </div>
          <div>
            <Label>Year</Label>
            <Input
              placeholder="2023-24"
              value={newGrade.year}
              onChange={(e) => setNewGrade({ ...newGrade, year: e.target.value })}
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select
              value={newGrade.status}
              onValueChange={(v) => setNewGrade({ ...newGrade, status: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={addGrade} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Existing Grades */}
        {grades.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No semester grades added yet</p>
        ) : (
          <div className="space-y-3">
            {grades.map((grade) => (
              <div
                key={grade.id}
                className="grid grid-cols-2 md:grid-cols-6 gap-4 p-4 border rounded-lg items-center"
              >
                <div>
                  <Badge variant="outline" className="text-sm">
                    Semester {grade.semester}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">SGPA</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={grade.sgpa}
                    onChange={(e) => updateGrade(grade.id, 'sgpa', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">CGPA</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={grade.cgpa}
                    onChange={(e) => updateGrade(grade.id, 'cgpa', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Year</Label>
                  <Input
                    value={grade.year || ''}
                    onChange={(e) => updateGrade(grade.id, 'year', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Badge className={grade.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                    {grade.status}
                  </Badge>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteGrade(grade.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioSemesterGradesAdmin;
