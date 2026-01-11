import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, Plus, Trash2, Edit, Mail, Link } from "lucide-react";

interface ContactInfo {
  id?: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
}

const emptySocialLink: Omit<SocialLink, "id"> = {
  platform: "",
  url: "",
  icon_name: "",
  display_order: 0,
  is_active: true,
};

const PortfolioContactAdmin = () => {
  const [contact, setContact] = useState<ContactInfo>({
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
  });
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [editingLink, setEditingLink] = useState<Partial<SocialLink> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: contactData } = await supabase
      .from("portfolio_contact")
      .select("*")
      .limit(1)
      .single();

    if (contactData) {
      setContact({
        id: contactData.id,
        email: contactData.email || "",
        phone: contactData.phone || "",
        whatsapp: contactData.whatsapp || "",
        address: contactData.address || "",
      });
    }

    const { data: linksData } = await supabase
      .from("portfolio_social_links")
      .select("*")
      .order("display_order");

    if (linksData) {
      setSocialLinks(linksData as SocialLink[]);
    }
  };

  const saveContact = async () => {
    setLoading(true);
    try {
      if (contact.id) {
        const { error } = await supabase
          .from("portfolio_contact")
          .update({
            email: contact.email,
            phone: contact.phone,
            whatsapp: contact.whatsapp,
            address: contact.address,
            updated_at: new Date().toISOString(),
          })
          .eq("id", contact.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("portfolio_contact").insert({
          email: contact.email,
          phone: contact.phone,
          whatsapp: contact.whatsapp,
          address: contact.address,
        });

        if (error) throw error;
      }

      toast.success("Contact info saved!");
      await loadData();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const saveSocialLink = async () => {
    if (!editingLink?.platform || !editingLink?.url) {
      toast.error("Platform and URL are required");
      return;
    }

    setLoading(true);
    try {
      if (editingLink.id) {
        const { error } = await supabase
          .from("portfolio_social_links")
          .update({
            platform: editingLink.platform,
            url: editingLink.url,
            icon_name: editingLink.icon_name,
            is_active: editingLink.is_active,
          })
          .eq("id", editingLink.id);

        if (error) throw error;
        toast.success("Social link updated!");
      } else {
        const { error } = await supabase.from("portfolio_social_links").insert({
          platform: editingLink.platform,
          url: editingLink.url,
          icon_name: editingLink.icon_name,
          is_active: editingLink.is_active ?? true,
          display_order: socialLinks.length,
        });

        if (error) throw error;
        toast.success("Social link added!");
      }

      setDialogOpen(false);
      setEditingLink(null);
      await loadData();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const deleteLink = async (id: string) => {
    if (!confirm("Delete this social link?")) return;

    try {
      const { error } = await supabase.from("portfolio_social_links").delete().eq("id", id);
      if (error) throw error;

      toast.success("Link deleted");
      await loadData();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete");
    }
  };

  const toggleLinkActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("portfolio_social_links")
        .update({ is_active: !isActive })
        .eq("id", id);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error("Error toggling:", error);
      toast.error("Failed to update");
    }
  };

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Contact Information
          </CardTitle>
          <CardDescription>Manage your contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                placeholder="+1 234 567 8900"
              />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input
                value={contact.whatsapp}
                onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea
              value={contact.address}
              onChange={(e) => setContact({ ...contact, address: e.target.value })}
              placeholder="Your address..."
              rows={2}
            />
          </div>
          <Button onClick={saveContact} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save Contact Info"}
          </Button>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                Social Links
              </CardTitle>
              <CardDescription>Manage your social media profiles</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingLink({ ...emptySocialLink })}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingLink?.id ? "Edit Social Link" : "Add New Social Link"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Platform *</Label>
                    <Input
                      value={editingLink?.platform || ""}
                      onChange={(e) => setEditingLink({ ...editingLink, platform: e.target.value })}
                      placeholder="e.g., GitHub, LinkedIn"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL *</Label>
                    <Input
                      value={editingLink?.url || ""}
                      onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Icon Name</Label>
                    <Input
                      value={editingLink?.icon_name || ""}
                      onChange={(e) => setEditingLink({ ...editingLink, icon_name: e.target.value })}
                      placeholder="e.g., Github, Linkedin"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={editingLink?.is_active ?? true}
                      onCheckedChange={(checked) =>
                        setEditingLink({ ...editingLink, is_active: checked })
                      }
                    />
                    <label htmlFor="active" className="text-sm">
                      Active
                    </label>
                  </div>
                  <Button onClick={saveSocialLink} disabled={loading} className="w-full">
                    {loading ? "Saving..." : "Save"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {socialLinks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No social links yet. Add your first one!
            </p>
          ) : (
            <div className="space-y-3">
              {socialLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <h5 className="font-medium">{link.platform}</h5>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {link.url}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={link.is_active}
                      onCheckedChange={() => toggleLinkActive(link.id, link.is_active)}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingLink(link);
                        setDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-500"
                      onClick={() => deleteLink(link.id)}
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
    </div>
  );
};

export default PortfolioContactAdmin;
