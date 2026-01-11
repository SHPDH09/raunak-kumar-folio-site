import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Trophy } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  date_achieved: string;
  badge_text: string;
  details: Record<string, string>;
  display_order: number;
}

const emptyAchievement: Omit<Achievement, "id"> = {
  title: "",
  description: "",
  date_achieved: "",
  badge_text: "",
  details: {},
  display_order: 0,
};

const PortfolioAchievementsAdmin = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [editing, setEditing] = useState<Partial<Achievement> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    const { data } = await supabase
      .from("portfolio_achievements")
      .select("*")
      .order("display_order");

    if (data) {
      setAchievements(data as Achievement[]);
    }
  };

  const handleSave = async () => {
    if (!editing?.title) {
      toast.error("Title is required");
      return;
    }

    setLoading(true);
    try {
      if (editing.id) {
        const { error } = await supabase
          .from("portfolio_achievements")
          .update({
            title: editing.title,
            description: editing.description,
            date_achieved: editing.date_achieved || null,
            badge_text: editing.badge_text,
            details: editing.details || {},
          })
          .eq("id", editing.id);

        if (error) throw error;
        toast.success("Achievement updated!");
      } else {
        const { error } = await supabase.from("portfolio_achievements").insert({
          title: editing.title,
          description: editing.description,
          date_achieved: editing.date_achieved || null,
          badge_text: editing.badge_text,
          details: editing.details || {},
          display_order: achievements.length,
        });

        if (error) throw error;
        toast.success("Achievement added!");
      }

      setDialogOpen(false);
      setEditing(null);
      await loadAchievements();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const deleteAchievement = async (id: string) => {
    if (!confirm("Delete this achievement?")) return;

    try {
      const { error } = await supabase.from("portfolio_achievements").delete().eq("id", id);
      if (error) throw error;

      toast.success("Achievement deleted");
      await loadAchievements();
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
              <Trophy className="w-5 h-5" />
              Achievements
            </CardTitle>
            <CardDescription>Manage your achievements and accomplishments</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing({ ...emptyAchievement })}>
                <Plus className="w-4 h-4 mr-2" />
                Add Achievement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editing?.id ? "Edit Achievement" : "Add New Achievement"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={editing?.title || ""}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    placeholder="Achievement title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Input
                    value={editing?.badge_text || ""}
                    onChange={(e) => setEditing({ ...editing, badge_text: e.target.value })}
                    placeholder="e.g., Winner, Finalist"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date Achieved</Label>
                  <Input
                    type="date"
                    value={editing?.date_achieved || ""}
                    onChange={(e) => setEditing({ ...editing, date_achieved: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={editing?.description || ""}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    placeholder="Describe the achievement..."
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
        {achievements.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No achievements yet. Add your first one!
          </p>
        ) : (
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium">{achievement.title}</h5>
                    {achievement.badge_text && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">
                        {achievement.badge_text}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {achievement.description}
                  </p>
                  {achievement.date_achieved && (
                    <p className="text-xs text-muted-foreground">{achievement.date_achieved}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditing(achievement);
                      setDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500"
                    onClick={() => deleteAchievement(achievement.id)}
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

export default PortfolioAchievementsAdmin;
