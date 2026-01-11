import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Award, ExternalLink } from "lucide-react";

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  credential_url: string;
  badge_url: string;
  display_order: number;
}

const emptyCertification: Omit<Certification, "id"> = {
  title: "",
  issuer: "",
  issue_date: "",
  credential_url: "",
  badge_url: "",
  display_order: 0,
};

const PortfolioCertificationsAdmin = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [editing, setEditing] = useState<Partial<Certification> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    const { data } = await supabase
      .from("portfolio_certifications")
      .select("*")
      .order("display_order");

    if (data) {
      setCertifications(data as Certification[]);
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
          .from("portfolio_certifications")
          .update({
            title: editing.title,
            issuer: editing.issuer,
            issue_date: editing.issue_date || null,
            credential_url: editing.credential_url,
            badge_url: editing.badge_url,
          })
          .eq("id", editing.id);

        if (error) throw error;
        toast.success("Certification updated!");
      } else {
        const { error } = await supabase.from("portfolio_certifications").insert({
          title: editing.title,
          issuer: editing.issuer,
          issue_date: editing.issue_date || null,
          credential_url: editing.credential_url,
          badge_url: editing.badge_url,
          display_order: certifications.length,
        });

        if (error) throw error;
        toast.success("Certification added!");
      }

      setDialogOpen(false);
      setEditing(null);
      await loadCertifications();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const deleteCertification = async (id: string) => {
    if (!confirm("Delete this certification?")) return;

    try {
      const { error } = await supabase.from("portfolio_certifications").delete().eq("id", id);
      if (error) throw error;

      toast.success("Certification deleted");
      await loadCertifications();
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
              <Award className="w-5 h-5" />
              Certifications
            </CardTitle>
            <CardDescription>Manage your certifications and credentials</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing({ ...emptyCertification })}>
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editing?.id ? "Edit Certification" : "Add New Certification"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={editing?.title || ""}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    placeholder="Certification name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Issuer</Label>
                  <Input
                    value={editing?.issuer || ""}
                    onChange={(e) => setEditing({ ...editing, issuer: e.target.value })}
                    placeholder="Issuing organization"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Issue Date</Label>
                  <Input
                    type="date"
                    value={editing?.issue_date || ""}
                    onChange={(e) => setEditing({ ...editing, issue_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Credential URL</Label>
                  <Input
                    value={editing?.credential_url || ""}
                    onChange={(e) => setEditing({ ...editing, credential_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Badge Image URL</Label>
                  <Input
                    value={editing?.badge_url || ""}
                    onChange={(e) => setEditing({ ...editing, badge_url: e.target.value })}
                    placeholder="https://..."
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
        {certifications.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No certifications yet. Add your first one!
          </p>
        ) : (
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {cert.badge_url && (
                    <img src={cert.badge_url} alt="" className="w-10 h-10 object-contain" />
                  )}
                  <div>
                    <h5 className="font-medium">{cert.title}</h5>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                    {cert.issue_date && (
                      <p className="text-xs text-muted-foreground">{cert.issue_date}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  {cert.credential_url && (
                    <Button size="icon" variant="ghost" asChild>
                      <a href={cert.credential_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditing(cert);
                      setDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500"
                    onClick={() => deleteCertification(cert.id)}
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

export default PortfolioCertificationsAdmin;
