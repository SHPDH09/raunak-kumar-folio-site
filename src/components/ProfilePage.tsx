import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Camera, Edit, X, Check, UserPlus, UserCheck } from "lucide-react";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  followers_count: number;
  following_count: number;
}

interface ProfilePageProps {
  userId: string;
  currentUserId: string | null;
  isOwnProfile?: boolean;
  onClose?: () => void;
  postsCount?: number;
}

export const ProfilePage = ({ 
  userId, 
  currentUserId, 
  isOwnProfile = false, 
  onClose,
  postsCount = 0 
}: ProfilePageProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [editForm, setEditForm] = useState({
    username: "",
    full_name: "",
  });

  useEffect(() => {
    loadProfile();
    if (currentUserId && currentUserId !== userId) {
      checkFollowStatus();
    }
  }, [userId, currentUserId]);

  const loadProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error loading profile:', error);
      setLoading(false);
      return;
    }

    setProfile(data);
    setEditForm({
      username: data.username || "",
      full_name: data.full_name || "",
    });
    setLoading(false);
  };

  const checkFollowStatus = async () => {
    if (!currentUserId) return;
    
    const { data } = await supabase
      .from('followers')
      .select('id')
      .eq('follower_id', currentUserId)
      .eq('following_id', userId)
      .maybeSingle();

    setIsFollowing(!!data);
  };

  const handleFollow = async () => {
    if (!currentUserId) {
      toast.info("Please login to follow users");
      return;
    }

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await supabase
          .from('followers')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', userId);
        
        setIsFollowing(false);
        toast.success(`Unfollowed ${profile?.username}`);
      } else {
        await supabase
          .from('followers')
          .insert({
            follower_id: currentUserId,
            following_id: userId,
          });
        
        setIsFollowing(true);
        toast.success(`Following ${profile?.username}`);
      }
      loadProfile();
    } catch (error) {
      toast.error("Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !currentUserId) return;

    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUserId}/avatar.${fileExt}`;

      // Delete old avatar if exists
      if (profile?.avatar_url) {
        const oldPath = profile.avatar_url.split('/avatars/')[1];
        if (oldPath) {
          await supabase.storage.from('avatars').remove([oldPath]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', currentUserId);

      if (updateError) throw updateError;

      toast.success('Avatar updated!');
      loadProfile();
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUserId) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: editForm.username,
          full_name: editForm.full_name,
        })
        .eq('id', currentUserId);

      if (error) throw error;

      toast.success('Profile updated!');
      setEditing(false);
      loadProfile();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        Profile not found
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="relative pb-0">
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-xl">
              {profile.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.username} />
              ) : null}
              <AvatarFallback className="text-2xl sm:text-3xl bg-primary/10 text-primary font-bold">
                {profile.username?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {isOwnProfile && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                  ) : (
                    <Camera className="h-6 w-6 text-white" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center sm:text-left">
            {editing ? (
              <div className="space-y-3">
                <Input
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  placeholder="Username"
                  className="max-w-xs"
                />
                <Input
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  placeholder="Full Name"
                  className="max-w-xs"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveProfile}>
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <h2 className="text-2xl font-bold">{profile.username}</h2>
                  {profile.is_verified && (
                    <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
                
                {profile.full_name && (
                  <p className="text-muted-foreground mb-3">{profile.full_name}</p>
                )}

                <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                  {isOwnProfile ? (
                    <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Profile
                    </Button>
                  ) : currentUserId && currentUserId !== userId ? (
                    <Button
                      size="sm"
                      variant={isFollowing ? "secondary" : "default"}
                      onClick={handleFollow}
                      disabled={followLoading}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="h-4 w-4 mr-1" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-1" />
                          Follow
                        </>
                      )}
                    </Button>
                  ) : null}
                </div>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Stats */}
        <div className="flex justify-center sm:justify-start gap-8 py-4 border-y">
          <div className="text-center">
            <p className="text-2xl font-bold">{postsCount}</p>
            <p className="text-sm text-muted-foreground">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{profile.followers_count || 0}</p>
            <p className="text-sm text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{profile.following_count || 0}</p>
            <p className="text-sm text-muted-foreground">Following</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Profile Dialog wrapper for use in feeds
export const ProfileDialog = ({ 
  userId, 
  currentUserId, 
  open, 
  onOpenChange 
}: { 
  userId: string; 
  currentUserId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <ProfilePage 
          userId={userId} 
          currentUserId={currentUserId}
          isOwnProfile={userId === currentUserId}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
