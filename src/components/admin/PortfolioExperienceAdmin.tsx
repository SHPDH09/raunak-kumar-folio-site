import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Briefcase, GraduationCap } from "lucide-react";

interface Experience {
  id: string;
  title: string;
  organization: string;
  type: "work" | "education";
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  location: string;
  display_order: number;
}

const emptyExperience: Omit<Experience, "id"> = {
  title: "",
  organization: "",
  type: "work",
  start_date: "",
  end_date: "",
  is_current: false,
  description: "",
  location: "",
  display_order: 0,
};

const PortfolioExperienceAdmin = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editing, setEditing] = useState<Partial<Experience> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    const { data } = await supabase
      .from("portfolio_experience")
      .select("*")
      .order("type")
      .order("start_date", { ascending: false });

    if (data) {
      setExperiences(data as Experience[]);
    }
  };

  const handleSave = async () => {
    if (!editing?.title || !editing?.organization) {
      toast.error("Title and organization are required");
      return;
    }

    setLoading(true);
    try {
      if (editing.id) {
        const { error } = await supabase
          .from("portfolio_experience")
          .update({
            title: editing.title,
            organization: editing.organization,
            type: editing.type,
            start_date: editing.start_date || null,
            end_date: editing.is_current ? null : editing.end_date || null,
            is_current: editing.is_current,
            description: editing.description,
            location: editing.location,
          })
          .eq("id", editing.id);

        if (error) throw error;
        toast.success("Experience updated!");
      } else {
        const { error } = await supabase.from("portfolio_experience").insert({
          title: editing.title,
          organization: editing.organization,
          type: editing.type,
          start_date: editing.start_date || null,
          end_date: editing.is_current ? null : editing.end_date || null,
          is_current: editing.is_current,
          description: editing.description,
          location: editing.location,
          display_order: experiences.length,
        });

        if (error) throw error;
        toast.success("Experience added!");
      }

      setDialogOpen(false);
      setEditing(null);
      await loadExperiences();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const deleteExperience = async (id: string) => {
    if (!confirm("Delete this entry?")) return;

    try {
      const { error } = await supabase.from("portfolio_experience").delete().eq("id", id);
      if (error) throw error;

      toast.success("Entry deleted");
      await loadExperiences();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete");
    }
  };

  const workExperiences = experiences.filter((e) => e.type === "work");
  const educationExperiences = experiences.filter((e) => e.type === "education");

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Experience & Education
            </CardTitle>
            <CardDescription>Manage your work experience and education history</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditing({ ...emptyExperience });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editing?.id ? "Edit Entry" : "Add New Entry"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={editing?.type || "work"}
                    onValueChange={(value: "work" | "education") =>
                      setEditing({ ...editing, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work Experience</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Title / Degree *</Label>
                  <Input
                    value={editing?.title || ""}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    placeholder={editing?.type === "education" ? "Degree name" : "Job title"}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Organization / University *</Label>
                  <Input
                    value={editing?.organization || ""}
                    onChange={(e) => setEditing({ ...editing, organization: e.target.value })}
                    placeholder="Company or university name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={editing?.location || ""}
                    onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={editing?.start_date || ""}
                      onChange={(e) => setEditing({ ...editing, start_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={editing?.end_date || ""}
                      onChange={(e) => setEditing({ ...editing, end_date: e.target.value })}
                      disabled={editing?.is_current}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="current"
                    checked={editing?.is_current || false}
                    onCheckedChange={(checked) =>
                      setEditing({ ...editing, is_current: checked as boolean })
                    }
                  />
                  <label htmlFor="current" className="text-sm">
                    Currently {editing?.type === "education" ? "studying here" : "working here"}
                  </label>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={editing?.description || ""}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    placeholder="Describe your role or achievements..."
                    rows={3}
                  />
                </div>
                <Button onClick={handleSave} disabled={loading} className="w-full">
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Work Experience */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Work Experience
          </h4>
          {workExperiences.length === 0 ? (
            <p className="text-sm text-muted-foreground">No work experience added</p>
          ) : (
            workExperiences.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h5 className="font-medium">{exp.title}</h5>
                  <p className="text-sm text-muted-foreground">{exp.organization}</p>
                  <p className="text-xs text-muted-foreground">
                    {exp.start_date} - {exp.is_current ? "Present" : exp.end_date}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditing(exp);
                      setDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500"
                    onClick={() => deleteExperience(exp.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Education */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Education
          </h4>
          {educationExperiences.length === 0 ? (
            <p className="text-sm text-muted-foreground">No education history added</p>
          ) : (
            educationExperiences.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h5 className="font-medium">{exp.title}</h5>
                  <p className="text-sm text-muted-foreground">{exp.organization}</p>
                  <p className="text-xs text-muted-foreground">
                    {exp.start_date} - {exp.is_current ? "Present" : exp.end_date}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditing(exp);
                      setDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500"
                    onClick={() => deleteExperience(exp.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioExperienceAdmin;
