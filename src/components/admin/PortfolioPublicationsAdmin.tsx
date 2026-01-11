import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Edit, BookOpen, ExternalLink } from "lucide-react";

interface Publication {
  id: string;
  title: string;
  authors: string[];
  publication_venue: string;
  publication_date: string;
  abstract: string;
  doi_url: string;
  pdf_url: string;
  status: string;
  display_order: number;
}

const emptyPublication: Omit<Publication, "id"> = {
  title: "",
  authors: [],
  publication_venue: "",
  publication_date: "",
  abstract: "",
  doi_url: "",
  pdf_url: "",
  status: "published",
  display_order: 0,
};

const PortfolioPublicationsAdmin = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [editing, setEditing] = useState<Partial<Publication> | null>(null);
  const [authorInput, setAuthorInput] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPublications();
  }, []);

  const loadPublications = async () => {
    const { data } = await supabase
      .from("portfolio_publications")
      .select("*")
      .order("display_order");

    if (data) {
      setPublications(data as Publication[]);
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
          .from("portfolio_publications")
          .update({
            title: editing.title,
            authors: editing.authors,
            publication_venue: editing.publication_venue,
            publication_date: editing.publication_date || null,
            abstract: editing.abstract,
            doi_url: editing.doi_url,
            pdf_url: editing.pdf_url,
            status: editing.status,
          })
          .eq("id", editing.id);

        if (error) throw error;
        toast.success("Publication updated!");
      } else {
        const { error } = await supabase.from("portfolio_publications").insert({
          title: editing.title,
          authors: editing.authors,
          publication_venue: editing.publication_venue,
          publication_date: editing.publication_date || null,
          abstract: editing.abstract,
          doi_url: editing.doi_url,
          pdf_url: editing.pdf_url,
          status: editing.status || "published",
          display_order: publications.length,
        });

        if (error) throw error;
        toast.success("Publication added!");
      }

      setDialogOpen(false);
      setEditing(null);
      await loadPublications();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const deletePublication = async (id: string) => {
    if (!confirm("Delete this publication?")) return;

    try {
      const { error } = await supabase.from("portfolio_publications").delete().eq("id", id);
      if (error) throw error;

      toast.success("Publication deleted");
      await loadPublications();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete");
    }
  };

  const addAuthor = () => {
    if (!authorInput.trim() || !editing) return;
    setEditing({
      ...editing,
      authors: [...(editing.authors || []), authorInput.trim()],
    });
    setAuthorInput("");
  };

  const removeAuthor = (index: number) => {
    if (!editing) return;
    const newAuthors = [...(editing.authors || [])];
    newAuthors.splice(index, 1);
    setEditing({ ...editing, authors: newAuthors });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Publications
            </CardTitle>
            <CardDescription>Manage your research publications</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditing({ ...emptyPublication });
                  setAuthorInput("");
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Publication
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editing?.id ? "Edit Publication" : "Add New Publication"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={editing?.title || ""}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    placeholder="Publication title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Authors</Label>
                  <div className="flex gap-2">
                    <Input
                      value={authorInput}
                      onChange={(e) => setAuthorInput(e.target.value)}
                      placeholder="Author name..."
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAuthor())}
                    />
                    <Button type="button" onClick={addAuthor} variant="secondary">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editing?.authors?.map((author, i) => (
                      <Badge key={i} variant="secondary" className="pr-1">
                        {author}
                        <button onClick={() => removeAuthor(i)} className="ml-1 hover:text-red-400">
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Publication Venue</Label>
                    <Input
                      value={editing?.publication_venue || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, publication_venue: e.target.value })
                      }
                      placeholder="Journal/Conference name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Publication Date</Label>
                    <Input
                      type="date"
                      value={editing?.publication_date || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, publication_date: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editing?.status || "published"}
                    onValueChange={(value) => setEditing({ ...editing, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="preprint">Preprint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Abstract</Label>
                  <Textarea
                    value={editing?.abstract || ""}
                    onChange={(e) => setEditing({ ...editing, abstract: e.target.value })}
                    placeholder="Publication abstract..."
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>DOI URL</Label>
                    <Input
                      value={editing?.doi_url || ""}
                      onChange={(e) => setEditing({ ...editing, doi_url: e.target.value })}
                      placeholder="https://doi.org/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>PDF URL</Label>
                    <Input
                      value={editing?.pdf_url || ""}
                      onChange={(e) => setEditing({ ...editing, pdf_url: e.target.value })}
                      placeholder="https://..."
                    />
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
        {publications.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No publications yet. Add your first one!
          </p>
        ) : (
          <div className="space-y-3">
            {publications.map((pub) => (
              <div key={pub.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium line-clamp-1">{pub.title}</h5>
                    <Badge
                      variant="outline"
                      className={
                        pub.status === "published"
                          ? "text-green-400"
                          : pub.status === "under_review"
                          ? "text-yellow-400"
                          : "text-blue-400"
                      }
                    >
                      {pub.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {pub.authors?.join(", ")}
                  </p>
                  <p className="text-xs text-muted-foreground">{pub.publication_venue}</p>
                </div>
                <div className="flex gap-1">
                  {pub.doi_url && (
                    <Button size="icon" variant="ghost" asChild>
                      <a href={pub.doi_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditing(pub);
                      setDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500"
                    onClick={() => deletePublication(pub.id)}
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

export default PortfolioPublicationsAdmin;
