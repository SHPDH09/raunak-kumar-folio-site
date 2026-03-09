import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { 
  Home, User, Heart, LogOut, MessageSquare, Settings, Image, Bookmark,
  Sun, Moon, Search, Bell, Plus, Menu
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { User as SupabaseUser } from "@supabase/supabase-js";
export default function SocialNavigation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [notificationCount, setNotificationCount] = useState(3); // Mock notification count
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      title: "Successfully logged out",
      description: "See you again soon! 👋",
    });
    navigate("/");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    toast({
      title: `Switched to ${theme === "dark" ? "light" : "dark"} mode`,
      description: `UI theme changed successfully`,
    });
  };

  if (!user) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-background/95 via-background/98 to-background/95 backdrop-blur-md border-b border-border/50 shadow-elegant">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")} 
                className="group hover-neon font-semibold"
              >
                <Home className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Home
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="hover-neon border-border/50 hover:border-primary/50"
              >
                {theme === "dark" ? 
                  <Sun className="w-4 h-4 animate-pulse" /> : 
                  <Moon className="w-4 h-4 animate-pulse" />
                }
              </Button>
              
              <Button 
                variant="default" 
                onClick={() => navigate("/auth")} 
                className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300 font-medium px-6"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-background/95 via-background/98 to-background/95 backdrop-blur-md border-b border-border/50 shadow-elegant">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")} 
              className="group hover-neon font-semibold"
            >
              <Home className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
              Home
            </Button>
            
            <Separator orientation="vertical" className="h-6 opacity-50" />
            
            <Button
              variant="ghost"
              onClick={() => navigate("/social")}
              className="group hover-neon font-medium"
            >
              <Heart className="w-4 h-4 mr-2 group-hover:scale-110 group-hover:text-red-500 transition-all" />
              Social Feed
            </Button>
          </div>
          
          {/* Center Section - Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover-neon"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/social")}
                className="hover-neon relative"
              >
                <Search className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="hover-neon relative"
              >
                <Bell className="w-4 h-4" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-gradient-to-r from-destructive to-destructive/80 animate-pulse">
                    {notificationCount}
                  </Badge>
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/social")}
                className="hover-neon"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <Separator orientation="vertical" className="h-6 opacity-50" />
            
            {/* Main Navigation */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="hover-neon font-medium group">
                  <Bookmark className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Saved
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] bg-gradient-to-br from-background to-background/90 border-border/50">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Bookmark className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold text-gradient">Saved Posts</h2>
                  </div>
                  <div className="flex items-center justify-center py-12 text-muted-foreground">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                        <Bookmark className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-lg font-medium">No saved posts yet</p>
                      <p className="text-sm">Save posts you love and find them here!</p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="hover-neon font-medium group"
            >
              <User className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Dashboard
            </Button>
            
            <Separator orientation="vertical" className="h-6 opacity-50" />
            
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="hover-neon border-border/50 hover:border-primary/50 group"
            >
              {theme === "dark" ? 
                <Sun className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" /> : 
                <Moon className="w-4 h-4 group-hover:-rotate-12 transition-transform duration-300" />
              }
            </Button>
            
            {/* Logout */}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 font-medium group"
            >
              <LogOut className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
              Logout
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md">
            <div className="px-4 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Quick Actions</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  className="hover-neon border-border/50"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="ghost" onClick={() => navigate("/social")} className="justify-start">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button variant="ghost" className="justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                  {notificationCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-destructive">{notificationCount}</Badge>
                  )}
                </Button>
                <Button variant="ghost" onClick={() => navigate("/dashboard")} className="justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={handleLogout} className="justify-start text-destructive hover:text-destructive/80">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}