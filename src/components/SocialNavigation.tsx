import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SavedPosts } from "@/components/SavedPosts";
import { Home, User, Heart, LogOut, MessageSquare, Settings, Image, Bookmark } from "lucide-react";
import { useState, useEffect } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Home, User, Heart, LogOut, MessageSquare, Settings, Image, Bookmark } from "lucide-react";
import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
}

export default function SocialNavigation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  if (!user) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/")} className="hover-scale">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </div>
            <Button variant="ghost" onClick={() => navigate("/auth")} className="text-sm hover-scale">
              Login
            </Button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="hover-scale">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/social")}
              className="text-sm hover-scale"
            >
              <Heart className="w-4 h-4 mr-2" />
              Social
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-sm hover-scale">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Saved
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh]">
                <SavedPosts />
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="text-sm hover-scale"
            >
              <User className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-sm hover-scale"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}