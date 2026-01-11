import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, User } from "lucide-react";

interface AboutData {
  id?: string;
  name: string;
  tagline: string;
  date_of_birth: string;
  education: string;
  university: string;
  location: string;
  bio: string;
  avatar_url: string;
  resume_url: string;
}

const PortfolioAboutAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AboutData>({
    name: "",
    tagline: "",
    date_of_birth: "",
    education: "",
    university: "",
    location: "",
    bio: "",
    avatar_url: "",
    resume_url: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: aboutData } = await supabase
      .from("portfolio_about")
      .select("*")
      .limit(1)
      .single();

    if (aboutData) {
      setData({
        id: aboutData.id,
        name: aboutData.name || "",
        tagline: aboutData.tagline || "",
        date_of_birth: aboutData.date_of_birth || "",
        education: aboutData.education || "",
        university: aboutData.university || "",
        location: aboutData.location || "",
        bio: aboutData.bio || "",
        avatar_url: aboutData.avatar_url || "",
        resume_url: aboutData.resume_url || "",
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (data.id) {
        const { error } = await supabase
          .from("portfolio_about")
          .update({
            name: data.name,
            tagline: data.tagline,
            date_of_birth: data.date_of_birth || null,
            education: data.education,
            university: data.university,
            location: data.location,
            bio: data.bio,
            avatar_url: data.avatar_url,
            resume_url: data.resume_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", data.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("portfolio_about").insert({
          name: data.name,
          tagline: data.tagline,
          date_of_birth: data.date_of_birth || null,
          education: data.education,
          university: data.university,
          location: data.location,
          bio: data.bio,
          avatar_url: data.avatar_url,
          resume_url: data.resume_url,
        });

        if (error) throw error;
      }

      toast.success("Personal details saved successfully!");
      await loadData();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save personal details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Personal Details
        </CardTitle>
        <CardDescription>Manage your basic profile information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="Your full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={data.tagline}
              onChange={(e) => setData({ ...data, tagline: e.target.value })}
              placeholder="Your professional tagline"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={data.date_of_birth}
              onChange={(e) => setData({ ...data, date_of_birth: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={data.location}
              onChange={(e) => setData({ ...data, location: e.target.value })}
              placeholder="City, Country"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Input
              id="education"
              value={data.education}
              onChange={(e) => setData({ ...data, education: e.target.value })}
              placeholder="Your degree"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="university">University</Label>
            <Input
              id="university"
              value={data.university}
              onChange={(e) => setData({ ...data, university: e.target.value })}
              placeholder="University name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              value={data.avatar_url}
              onChange={(e) => setData({ ...data, avatar_url: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resume">Resume URL</Label>
            <Input
              id="resume"
              value={data.resume_url}
              onChange={(e) => setData({ ...data, resume_url: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={data.bio}
            onChange={(e) => setData({ ...data, bio: e.target.value })}
            placeholder="Tell visitors about yourself..."
            rows={4}
          />
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PortfolioAboutAdmin;
