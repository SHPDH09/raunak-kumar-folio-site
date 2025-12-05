import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserPlus, UserCheck, MessageCircle } from "lucide-react";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_verified: boolean;
}

interface FollowersListProps {
  userId: string;
  currentUserId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: "followers" | "following";
  onMessageUser?: (userId: string) => void;
}

export const FollowersList = ({
  userId,
  currentUserId,
  open,
  onOpenChange,
  initialTab = "followers",
  onMessageUser,
}: FollowersListProps) => {
  const [followers, setFollowers] = useState<Profile[]>([]);
  const [following, setFollowing] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [myFollowing, setMyFollowing] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open) {
      loadFollowers();
      loadFollowing();
      if (currentUserId) {
        loadMyFollowing();
      }
    }
  }, [open, userId, currentUserId]);

  const loadFollowers = async () => {
    setLoading(true);
    try {
      const { data: followersData } = await supabase
        .from('followers')
        .select('follower_id')
        .eq('following_id', userId);

      if (followersData && followersData.length > 0) {
        const followerIds = followersData.map(f => f.follower_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .in('id', followerIds);
        setFollowers(profiles || []);
      } else {
        setFollowers([]);
      }
    } catch (error) {
      console.error('Error loading followers:', error);
    }
    setLoading(false);
  };

  const loadFollowing = async () => {
    try {
      const { data: followingData } = await supabase
        .from('followers')
        .select('following_id')
        .eq('follower_id', userId);

      if (followingData && followingData.length > 0) {
        const followingIds = followingData.map(f => f.following_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .in('id', followingIds);
        setFollowing(profiles || []);
      } else {
        setFollowing([]);
      }
    } catch (error) {
      console.error('Error loading following:', error);
    }
  };

  const loadMyFollowing = async () => {
    if (!currentUserId) return;
    const { data } = await supabase
      .from('followers')
      .select('following_id')
      .eq('follower_id', currentUserId);
    if (data) {
      setMyFollowing(new Set(data.map(f => f.following_id)));
    }
  };

  const handleFollow = async (targetUserId: string) => {
    if (!currentUserId) {
      toast.info("Please login to follow users");
      return;
    }

    try {
      if (myFollowing.has(targetUserId)) {
        await supabase
          .from('followers')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', targetUserId);
        setMyFollowing(prev => {
          const next = new Set(prev);
          next.delete(targetUserId);
          return next;
        });
        toast.success("Unfollowed");
      } else {
        await supabase
          .from('followers')
          .insert({ follower_id: currentUserId, following_id: targetUserId });
        setMyFollowing(prev => new Set(prev).add(targetUserId));
        toast.success("Following!");
      }
    } catch (error) {
      toast.error("Failed to update follow status");
    }
  };

  const UserItem = ({ profile }: { profile: Profile }) => {
    const isFollowing = myFollowing.has(profile.id);
    const isCurrentUser = currentUserId === profile.id;

    return (
      <div className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
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
        <div className="flex gap-2">
          {onMessageUser && !isCurrentUser && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onMessageUser(profile.id)}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          )}
          {!isCurrentUser && currentUserId && (
            <Button
              variant={isFollowing ? "secondary" : "default"}
              size="sm"
              onClick={() => handleFollow(profile.id)}
            >
              {isFollowing ? (
                <UserCheck className="h-4 w-4" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Connections</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={initialTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="followers">Followers ({followers.length})</TabsTrigger>
            <TabsTrigger value="following">Following ({following.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="followers">
            <ScrollArea className="h-[400px]">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : followers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No followers yet</p>
              ) : (
                <div className="space-y-1">
                  {followers.map(profile => (
                    <UserItem key={profile.id} profile={profile} />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="following">
            <ScrollArea className="h-[400px]">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : following.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Not following anyone</p>
              ) : (
                <div className="space-y-1">
                  {following.map(profile => (
                    <UserItem key={profile.id} profile={profile} />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};