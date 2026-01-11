import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Rocket, ExternalLink } from "lucide-react";

interface Application {
  id: string;
  title: string;
  description: string;
  live_url: string;
  tech_stack: string[];
  features: string[];
  icon_name: string;
  color: string;
  display_order: number;
}

const emptyApplication: Omit<Application, "id"> = {
  title: "",
  description: "",
  live_url: "",
  tech_stack: [],
  features: [],
  icon_name: "",
  color: "",
  display_order: 0,
};

const PortfolioApplicationsAdmin = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [editing, setEditing] = useState<Partial<Application> | null>(null);
  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    const { data } = await supabase
      .from("portfolio_applications")
      .select("*")
      .order("display_order");

    if (data) {
      setApplications(data as Application[]);
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
          .from("portfolio_applications")
          .update({
            title: editing.title,
            description: editing.description,
            live_url: editing.live_url,
            tech_stack: editing.tech_stack,
            features: editing.features,
            icon_name: editing.icon_name,
            color: editing.color,
          })
          .eq("id", editing.id);

        if (error) throw error;
        toast.success("Application updated!");
      } else {
        const { error } = await supabase.from("portfolio_applications").insert({
          title: editing.title,
          description: editing.description,
          live_url: editing.live_url,
          tech_stack: editing.tech_stack,
          features: editing.features,
          icon_name: editing.icon_name,
          color: editing.color,
          display_order: applications.length,
        });

        if (error) throw error;
        toast.success("Application added!");
      }

      setDialogOpen(false);
      setEditing(null);
      await loadApplications();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (id: string) => {
    if (!confirm("Delete this application?")) return;

    try {
      const { error } = await supabase.from("portfolio_applications").delete().eq("id", id);
      if (error) throw error;

      toast.success("Application deleted");
      await loadApplications();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete");
    }
  };

  const addTech = () => {
    if (!techInput.trim() || !editing) return;
    setEditing({
      ...editing,
      tech_stack: [...(editing.tech_stack || []), techInput.trim()],
    });
    setTechInput("");
  };

  const removeTech = (index: number) => {
    if (!editing) return;
    const newStack = [...(editing.tech_stack || [])];
    newStack.splice(index, 1);
    setEditing({ ...editing, tech_stack: newStack });
  };

  const addFeature = () => {
    if (!featureInput.trim() || !editing) return;
    setEditing({
      ...editing,
      features: [...(editing.features || []), featureInput.trim()],
    });
    setFeatureInput("");
  };

  const removeFeature = (index: number) => {
    if (!editing) return;
    const newFeatures = [...(editing.features || [])];
    newFeatures.splice(index, 1);
    setEditing({ ...editing, features: newFeatures });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              Applications
            </CardTitle>
            <CardDescription>Manage your deployed applications</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditing({ ...emptyApplication });
                  setTechInput("");
                  setFeatureInput("");
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Application
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editing?.id ? "Edit Application" : "Add New Application"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      value={editing?.title || ""}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                      placeholder="Application name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Live URL</Label>
                    <Input
                      value={editing?.live_url || ""}
                      onChange={(e) => setEditing({ ...editing, live_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={editing?.description || ""}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    placeholder="Application description..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Icon Name</Label>
                    <Input
                      value={editing?.icon_name || ""}
                      onChange={(e) => setEditing({ ...editing, icon_name: e.target.value })}
                      placeholder="e.g., Rocket, Globe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Theme Color</Label>
                    <Input
                      value={editing?.color || ""}
                      onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                      placeholder="e.g., blue, purple"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tech Stack</Label>
                  <div className="flex gap-2">
                    <Input
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      placeholder="Add technology..."
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                    />
                    <Button type="button" onClick={addTech} variant="secondary">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editing?.tech_stack?.map((tech, i) => (
                      <Badge key={i} variant="secondary" className="pr-1">
                        {tech}
                        <button onClick={() => removeTech(i)} className="ml-1 hover:text-red-400">
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Features</Label>
                  <div className="flex gap-2">
                    <Input
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      placeholder="Add feature..."
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} variant="secondary">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editing?.features?.map((feature, i) => (
                      <Badge key={i} variant="outline" className="pr-1">
                        {feature}
                        <button onClick={() => removeFeature(i)} className="ml-1 hover:text-red-400">
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
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
        {applications.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No applications yet. Add your first one!
          </p>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h5 className="font-medium">{app.title}</h5>
                  <p className="text-sm text-muted-foreground line-clamp-1">{app.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {app.tech_stack?.slice(0, 3).map((tech, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1">
                  {app.live_url && (
                    <Button size="icon" variant="ghost" asChild>
                      <a href={app.live_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditing(app);
                      setDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500"
                    onClick={() => deleteApplication(app.id)}
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

export default PortfolioApplicationsAdmin;
