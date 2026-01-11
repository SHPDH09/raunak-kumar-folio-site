import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash2, Code } from "lucide-react";

interface Skill {
  id: string;
  skill_name: string;
  category: "programming" | "framework" | "learning";
  proficiency: number;
  display_order: number;
}

const PortfolioSkillsAdmin = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState<{ skill_name: string; category: "programming" | "framework" | "learning" }>({ skill_name: "", category: "programming" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    const { data } = await supabase
      .from("portfolio_skills")
      .select("*")
      .order("category")
      .order("display_order");

    if (data) {
      setSkills(data as Skill[]);
    }
  };

  const addSkill = async () => {
    if (!newSkill.skill_name.trim()) {
      toast.error("Please enter a skill name");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("portfolio_skills").insert({
        skill_name: newSkill.skill_name,
        category: newSkill.category,
        display_order: skills.filter(s => s.category === newSkill.category).length,
      });

      if (error) throw error;

      toast.success("Skill added!");
      setNewSkill({ skill_name: "", category: "programming" });
      await loadSkills();
    } catch (error) {
      console.error("Error adding skill:", error);
      toast.error("Failed to add skill");
    } finally {
      setLoading(false);
    }
  };

  const deleteSkill = async (id: string) => {
    if (!confirm("Delete this skill?")) return;

    try {
      const { error } = await supabase.from("portfolio_skills").delete().eq("id", id);
      if (error) throw error;

      toast.success("Skill deleted");
      await loadSkills();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete skill");
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "programming": return "Programming Skills";
      case "framework": return "Frameworks & Libraries";
      case "learning": return "Learning Interests";
      default: return cat;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "programming": return "bg-blue-500/20 text-blue-400";
      case "framework": return "bg-green-500/20 text-green-400";
      case "learning": return "bg-purple-500/20 text-purple-400";
      default: return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="w-5 h-5" />
          Skills Management
        </CardTitle>
        <CardDescription>Manage your programming skills, frameworks, and learning interests</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Skill */}
        <div className="flex gap-2 flex-wrap">
          <Input
            value={newSkill.skill_name}
            onChange={(e) => setNewSkill({ ...newSkill, skill_name: e.target.value })}
            placeholder="Skill name..."
            className="flex-1 min-w-[200px]"
          />
          <Select
            value={newSkill.category}
            onValueChange={(value: "programming" | "framework" | "learning") =>
              setNewSkill({ ...newSkill, category: value })
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="programming">Programming Skills</SelectItem>
              <SelectItem value="framework">Frameworks & Libraries</SelectItem>
              <SelectItem value="learning">Learning Interests</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={addSkill} disabled={loading}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Skills by Category */}
        {["programming", "framework", "learning"].map((category) => {
          const categorySkills = skills.filter((s) => s.category === category);
          if (categorySkills.length === 0) return null;

          return (
            <div key={category} className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">
                {getCategoryLabel(category)}
              </h4>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="secondary"
                    className={`${getCategoryColor(category)} flex items-center gap-1 pr-1`}
                  >
                    {skill.skill_name}
                    <button
                      onClick={() => deleteSkill(skill.id)}
                      className="ml-1 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          );
        })}

        {skills.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            No skills added yet. Add your first skill above!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioSkillsAdmin;
