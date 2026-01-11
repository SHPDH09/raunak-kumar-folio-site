import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Heart } from "lucide-react";

interface SoftSkill {
  id: string;
  skill_name: string;
  description: string;
  icon_name: string;
  display_order: number;
}

const emptySoftSkill: Omit<SoftSkill, "id"> = {
  skill_name: "",
  description: "",
  icon_name: "",
  display_order: 0,
};

const PortfolioSoftSkillsAdmin = () => {
  const [skills, setSkills] = useState<SoftSkill[]>([]);
  const [editing, setEditing] = useState<Partial<SoftSkill> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    const { data } = await supabase
      .from("portfolio_soft_skills")
      .select("*")
      .order("display_order");

    if (data) {
      setSkills(data as SoftSkill[]);
    }
  };

  const handleSave = async () => {
    if (!editing?.skill_name) {
      toast.error("Skill name is required");
      return;
    }

    setLoading(true);
    try {
      if (editing.id) {
        const { error } = await supabase
          .from("portfolio_soft_skills")
          .update({
            skill_name: editing.skill_name,
            description: editing.description,
            icon_name: editing.icon_name,
          })
          .eq("id", editing.id);

        if (error) throw error;
        toast.success("Soft skill updated!");
      } else {
        const { error } = await supabase.from("portfolio_soft_skills").insert({
          skill_name: editing.skill_name,
          description: editing.description,
          icon_name: editing.icon_name,
          display_order: skills.length,
        });

        if (error) throw error;
        toast.success("Soft skill added!");
      }

      setDialogOpen(false);
      setEditing(null);
      await loadSkills();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const deleteSkill = async (id: string) => {
    if (!confirm("Delete this soft skill?")) return;

    try {
      const { error } = await supabase.from("portfolio_soft_skills").delete().eq("id", id);
      if (error) throw error;

      toast.success("Soft skill deleted");
      await loadSkills();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Soft Skills
            </CardTitle>
            <CardDescription>Manage your soft skills and recognition</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing({ ...emptySoftSkill })}>
                <Plus className="w-4 h-4 mr-2" />
                Add Soft Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editing?.id ? "Edit Soft Skill" : "Add New Soft Skill"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Skill Name *</Label>
                  <Input
                    value={editing?.skill_name || ""}
                    onChange={(e) => setEditing({ ...editing, skill_name: e.target.value })}
                    placeholder="e.g., Leadership, Communication"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Icon Name</Label>
                  <Input
                    value={editing?.icon_name || ""}
                    onChange={(e) => setEditing({ ...editing, icon_name: e.target.value })}
                    placeholder="e.g., Users, MessageCircle"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={editing?.description || ""}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    placeholder="Describe this skill..."
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
      <CardContent>
        {skills.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No soft skills yet. Add your first one!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h5 className="font-medium">{skill.skill_name}</h5>
                  <p className="text-sm text-muted-foreground line-clamp-1">{skill.description}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditing(skill);
                      setDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500"
                    onClick={() => deleteSkill(skill.id)}
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

export default PortfolioSoftSkillsAdmin;
