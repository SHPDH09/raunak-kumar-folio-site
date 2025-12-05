import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { Heart } from "lucide-react";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_verified: boolean;
}

interface LikesViewerProps {
  imageId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LikesViewer = ({ imageId, open, onOpenChange }: LikesViewerProps) => {
  const [likers, setLikers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadLikers();
    }
  }, [open, imageId]);

  const loadLikers = async () => {
    setLoading(true);
    try {
      const { data: likesData } = await supabase
        .from('likes')
        .select('user_id')
        .eq('image_id', imageId);

      if (likesData && likesData.length > 0) {
        const userIds = likesData.map(l => l.user_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .in('id', userIds);
        setLikers(profiles || []);
      } else {
        setLikers([]);
      }
    } catch (error) {
      console.error('Error loading likers:', error);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
            Likes ({likers.length})
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px]">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : likers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No likes yet</p>
          ) : (
            <div className="space-y-2">
              {likers.map(profile => (
                <div key={profile.id} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg">
                  <Avatar className="h-10 w-10">
                    {profile.avatar_url && <AvatarImage src={profile.avatar_url} />}
                    <AvatarFallback>{profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-medium truncate">{profile.username}</span>
                      {profile.is_verified && (
                        <Badge className="h-4 px-1 bg-blue-500 text-white text-xs">✓</Badge>
                      )}
                    </div>
                    {profile.full_name && (
                      <p className="text-sm text-muted-foreground truncate">{profile.full_name}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};