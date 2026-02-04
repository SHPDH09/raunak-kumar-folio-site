import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle2, Shield, Users, Image as ImageIcon, LogOut, FileCheck, Briefcase } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PortfolioAboutAdmin from "@/components/admin/PortfolioAboutAdmin";
import PortfolioSkillsAdmin from "@/components/admin/PortfolioSkillsAdmin";
import PortfolioProjectsAdmin from "@/components/admin/PortfolioProjectsAdmin";
import PortfolioExperienceAdmin from "@/components/admin/PortfolioExperienceAdmin";
import PortfolioCertificationsAdmin from "@/components/admin/PortfolioCertificationsAdmin";
import PortfolioAchievementsAdmin from "@/components/admin/PortfolioAchievementsAdmin";
import PortfolioPublicationsAdmin from "@/components/admin/PortfolioPublicationsAdmin";
import PortfolioApplicationsAdmin from "@/components/admin/PortfolioApplicationsAdmin";
import PortfolioSoftSkillsAdmin from "@/components/admin/PortfolioSoftSkillsAdmin";
import PortfolioContactAdmin from "@/components/admin/PortfolioContactAdmin";
import PortfolioSemesterGradesAdmin from "@/components/admin/PortfolioSemesterGradesAdmin";
import PortfolioContactSubmissionsAdmin from "@/components/admin/PortfolioContactSubmissionsAdmin";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  is_verified: boolean;
  created_at: string;
}

interface UserWithImages extends Profile {
  image_count: number;
}

interface PendingPost {
  id: string;
  title: string;
  caption: string | null;
  file_path: string;
  created_at: string;
  user_id: string;
  profile?: Profile;
  url?: string;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<UserWithImages[]>([]);
  const [pendingPosts, setPendingPosts] = useState<PendingPost[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      setCurrentUserId(user.id);

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (!roles) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
      await loadUsers();
      await loadPendingPosts();
    } catch (error) {
      console.error("Error checking admin status:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profiles) {
        const usersWithCounts = await Promise.all(
          profiles.map(async (profile) => {
            const { count } = await supabase
              .from("images")
              .select("*", { count: "exact", head: true })
              .eq("user_id", profile.id);
            
            return {
              ...profile,
              image_count: count || 0,
            };
          })
        );
        
        setUsers(usersWithCounts);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    }
  };

  const loadPendingPosts = async () => {
    try {
      const { data: images } = await supabase
        .from("images")
        .select("*")
        .eq("is_approved", false)
        .order("created_at", { ascending: false });

      if (images) {
        const userIds = [...new Set(images.map(img => img.user_id))];
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("*")
          .in("id", userIds);

        const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

        const postsWithData = await Promise.all(
          images.map(async (image) => {
            const { data: signedUrlData, error } = await supabase.storage
              .from("images")
              .createSignedUrl(image.file_path, 3600); // 1 hour expiry

            return {
              ...image,
              url: signedUrlData?.signedUrl || '',
              profile: profilesMap.get(image.user_id),
            };
          })
        );

        setPendingPosts(postsWithData);
      }
    } catch (error) {
      console.error("Error loading pending posts:", error);
      toast.error("Failed to load pending posts");
    }
  };

  const approvePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from("images")
        .update({ 
          is_approved: true,
          approved_by: currentUserId,
          approved_at: new Date().toISOString()
        })
        .eq("id", postId);

      if (error) throw error;

      toast.success("Post approved successfully!");
      await loadPendingPosts();
    } catch (error) {
      console.error("Error approving post:", error);
      toast.error("Failed to approve post");
    }
  };

  const rejectPost = async (postId: string) => {
    if (!confirm("Are you sure you want to reject and delete this post?")) return;

    try {
      const post = pendingPosts.find(p => p.id === postId);
      if (!post) return;

      await supabase.storage.from("images").remove([post.file_path]);
      await supabase.from("images").delete().eq("id", postId);

      toast.success("Post rejected and deleted");
      await loadPendingPosts();
    } catch (error) {
      console.error("Error rejecting post:", error);
      toast.error("Failed to reject post");
    }
  };

  const toggleVerification = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_verified: !currentStatus })
        .eq("id", userId);

      if (error) throw error;

      toast.success(`User ${currentStatus ? "unverified" : "verified"} successfully`);
      await loadUsers();
    } catch (error) {
      console.error("Error updating verification:", error);
      toast.error("Failed to update verification status");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p>Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Shield className="w-8 h-8" />
              Admin Panel
            </h1>
            <p className="text-muted-foreground mt-2">Manage users, verify accounts, and approve posts</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              <ImageIcon className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.is_verified).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Posts</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPosts.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Images</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.reduce((acc, u) => acc + u.image_count, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Pending Posts</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="portfolio">
              <Briefcase className="w-4 h-4 mr-2" />
              Portfolio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <CardTitle>Post Approval</CardTitle>
                <CardDescription>Review and approve user posts</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingPosts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No pending posts to review
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingPosts.map((post) => (
                      <Card key={post.id} className="overflow-hidden">
                        <img 
                          src={post.url} 
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg">{post.title}</h3>
                          {post.caption && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {post.caption}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-4 text-sm">
                            <span className="font-medium">{post.profile?.username}</span>
                            {post.profile?.is_verified && (
                              <CheckCircle2 className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                          <div className="flex gap-2 mt-4">
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={() => approvePost(post.id)}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="flex-1"
                              onClick={() => rejectPost(post.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Images</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {user.username}
                            {user.is_verified && (
                              <CheckCircle2 className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{user.full_name || "—"}</TableCell>
                        <TableCell>{user.image_count}</TableCell>
                        <TableCell>
                          {user.is_verified ? (
                            <Badge variant="default">Verified</Badge>
                          ) : (
                            <Badge variant="secondary">Unverified</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant={user.is_verified ? "outline" : "default"}
                            size="sm"
                            onClick={() => toggleVerification(user.id, user.is_verified)}
                          >
                            {user.is_verified ? "Remove Blue Tick" : "Add Blue Tick"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <PortfolioContactSubmissionsAdmin />
            <PortfolioAboutAdmin />
            <PortfolioSkillsAdmin />
            <PortfolioSemesterGradesAdmin />
            <PortfolioProjectsAdmin />
            <PortfolioExperienceAdmin />
            <PortfolioCertificationsAdmin />
            <PortfolioSoftSkillsAdmin />
            <PortfolioAchievementsAdmin />
            <PortfolioPublicationsAdmin />
            <PortfolioApplicationsAdmin />
            <PortfolioContactAdmin />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
