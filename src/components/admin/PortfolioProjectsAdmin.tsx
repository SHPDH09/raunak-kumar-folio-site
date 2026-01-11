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
import { Plus, Trash2, Edit, FolderOpen, ExternalLink } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  github_url: string;
  demo_url: string;
  tech_stack: string[];
  display_order: number;
  is_featured: boolean;
}

const emptyProject: Omit<Project, "id"> = {
  title: "",
  description: "",
  category: "",
  image_url: "",
  github_url: "",
  demo_url: "",
  tech_stack: [],
  display_order: 0,
  is_featured: true,
};

const PortfolioProjectsAdmin = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [techInput, setTechInput] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const { data } = await supabase
      .from("portfolio_projects")
      .select("*")
      .order("display_order");

    if (data) {
      setProjects(data as Project[]);
    }
  };

  const handleSave = async () => {
    if (!editingProject?.title) {
      toast.error("Project title is required");
      return;
    }

    setLoading(true);
    try {
      if (editingProject.id) {
        const { error } = await supabase
          .from("portfolio_projects")
          .update({
            title: editingProject.title,
            description: editingProject.description,
            category: editingProject.category,
            image_url: editingProject.image_url,
            github_url: editingProject.github_url,
            demo_url: editingProject.demo_url,
            tech_stack: editingProject.tech_stack,
            is_featured: editingProject.is_featured,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingProject.id);

        if (error) throw error;
        toast.success("Project updated!");
      } else {
        const { error } = await supabase.from("portfolio_projects").insert({
          title: editingProject.title,
          description: editingProject.description,
          category: editingProject.category,
          image_url: editingProject.image_url,
          github_url: editingProject.github_url,
          demo_url: editingProject.demo_url,
          tech_stack: editingProject.tech_stack,
          display_order: projects.length,
          is_featured: editingProject.is_featured ?? true,
        });

        if (error) throw error;
        toast.success("Project added!");
      }

      setDialogOpen(false);
      setEditingProject(null);
      await loadProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;

    try {
      const { error } = await supabase.from("portfolio_projects").delete().eq("id", id);
      if (error) throw error;

      toast.success("Project deleted");
      await loadProjects();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete project");
    }
  };

  const addTech = () => {
    if (!techInput.trim() || !editingProject) return;
    setEditingProject({
      ...editingProject,
      tech_stack: [...(editingProject.tech_stack || []), techInput.trim()],
    });
    setTechInput("");
  };

  const removeTech = (index: number) => {
    if (!editingProject) return;
    const newStack = [...(editingProject.tech_stack || [])];
    newStack.splice(index, 1);
    setEditingProject({ ...editingProject, tech_stack: newStack });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              Projects
            </CardTitle>
            <CardDescription>Manage your featured projects</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingProject({ ...emptyProject });
                  setTechInput("");
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProject?.id ? "Edit Project" : "Add New Project"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      value={editingProject?.title || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, title: e.target.value })
                      }
                      placeholder="Project name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input
                      value={editingProject?.category || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, category: e.target.value })
                      }
                      placeholder="e.g., GenAI/LLM, Web Dev"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={editingProject?.description || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    placeholder="Project description..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      value={editingProject?.image_url || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, image_url: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Demo URL</Label>
                    <Input
                      value={editingProject?.demo_url || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, demo_url: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>GitHub URL</Label>
                  <Input
                    value={editingProject?.github_url || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, github_url: e.target.value })
                    }
                    placeholder="https://github.com/..."
                  />
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
                    {editingProject?.tech_stack?.map((tech, i) => (
                      <Badge key={i} variant="secondary" className="pr-1">
                        {tech}
                        <button onClick={() => removeTech(i)} className="ml-1 hover:text-red-400">
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button onClick={handleSave} disabled={loading} className="w-full">
                  {loading ? "Saving..." : "Save Project"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No projects yet. Add your first project!
          </p>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{project.title}</h4>
                    {project.category && (
                      <Badge variant="outline" className="text-xs">
                        {project.category}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.tech_stack?.slice(0, 4).map((tech, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {(project.tech_stack?.length || 0) > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.tech_stack.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {project.demo_url && (
                    <Button size="icon" variant="ghost" asChild>
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditingProject(project);
                      setDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500"
                    onClick={() => deleteProject(project.id)}
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

export default PortfolioProjectsAdmin;
