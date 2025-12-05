import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Trash2, Edit, UserPlus, UserCheck, Repeat2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfileDialog } from "@/components/ProfilePage";

interface PostCardProps {
  id: string;
  title: string;
  caption?: string;
  imageUrl?: string;
  username: string;
  avatarUrl?: string;
  isVerified: boolean;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  shareCount: number;
  repostCount?: number;
  isLiked: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onRepost?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onClick?: () => void;
  userId?: string;
  currentUserId?: string;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
  isRepost?: boolean;
  originalUsername?: string;
}

export const PostCard = ({
  title,
  caption,
  imageUrl,
  username,
  avatarUrl,
  isVerified,
  createdAt,
  likesCount,
  commentsCount,
  shareCount,
  repostCount = 0,
  isLiked,
  canEdit,
  canDelete,
  onLike,
  onComment,
  onShare,
  onRepost,
  onDelete,
  onEdit,
  onClick,
  userId,
  currentUserId,
  isFollowing = false,
  onFollowToggle,
  isRepost = false,
  originalUsername,
}: PostCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [following, setFollowing] = useState(isFollowing);
  const [followLoading, setFollowLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const MAX_TEXT_LENGTH = 150;
  const fullText = caption || '';
  const shouldTruncate = fullText.length > MAX_TEXT_LENGTH;
  const displayText = expanded || !shouldTruncate ? fullText : fullText.slice(0, MAX_TEXT_LENGTH) + '...';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId || !userId || currentUserId === userId) return;

    setFollowLoading(true);
    try {
      if (following) {
        const { error } = await supabase
          .from('followers')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', userId);

        if (error) throw error;
        setFollowing(false);
        toast.success(`Unfollowed ${username}`);
      } else {
        const { error } = await supabase
          .from('followers')
          .insert({
            follower_id: currentUserId,
            following_id: userId,
          });

        if (error) throw error;
        setFollowing(true);
        toast.success(`Following ${username}`);
      }
      onFollowToggle?.();
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error("Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (userId) {
      setProfileOpen(true);
    }
  };

  const showFollowButton = currentUserId && userId && currentUserId !== userId;
  const hasImage = imageUrl && !imageError;

  return (
    <>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-card">
        {/* Repost indicator */}
        {isRepost && originalUsername && (
          <div className="px-4 pt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Repeat2 className="h-4 w-4" />
            <span>Reposted from @{originalUsername}</span>
          </div>
        )}

        {/* Header */}
        <CardHeader className="flex flex-row items-start gap-3 p-4 pb-3">
          <Avatar 
            className="h-12 w-12 ring-2 ring-border cursor-pointer hover:ring-primary transition-colors"
            onClick={handleProfileClick}
          >
            {avatarUrl ? <AvatarImage src={avatarUrl} /> : null}
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p 
                className="font-semibold text-foreground hover:text-primary cursor-pointer truncate"
                onClick={handleProfileClick}
              >
                {username}
              </p>
              {isVerified && (
                <Badge className="h-5 px-1.5 bg-blue-500 hover:bg-blue-600 text-white shrink-0">
                  ✓
                </Badge>
              )}
              {showFollowButton && (
                <Button
                  variant={following ? "secondary" : "default"}
                  size="sm"
                  className="h-7 px-3 ml-auto shrink-0"
                  onClick={handleFollow}
                  disabled={followLoading}
                >
                  {following ? (
                    <>
                      <UserCheck className="h-3.5 w-3.5 mr-1" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-3.5 w-3.5 mr-1" />
                      Follow
                    </>
                  )}
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{formatDate(createdAt)}</p>
          </div>
          {(canEdit || canDelete) && (
            <div className="flex gap-1 shrink-0">
              {canEdit && onEdit && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {canDelete && onDelete && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          )}
        </CardHeader>

        {/* Caption/Content */}
        {(title || caption) && (
          <div className="px-4 pb-3">
            <h3 className="font-semibold text-base text-foreground mb-1">{title}</h3>
            {caption && (
              <div>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {displayText}
                </p>
                {shouldTruncate && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded(!expanded);
                    }}
                    className="text-sm text-primary font-medium hover:underline mt-1"
                  >
                    {expanded ? 'See less' : 'See more'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Image - Only show if there's an image URL */}
        {hasImage && (
          <CardContent className="p-0">
            <div 
              className="relative w-full cursor-pointer bg-muted overflow-hidden"
              onClick={onClick}
              style={{ maxHeight: '600px' }}
            >
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center min-h-[300px]">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
              )}
              <img
                src={imageUrl}
                alt={title}
                className={`w-full h-auto object-contain transition-all duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ maxHeight: '600px' }}
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageLoaded(true);
                  setImageError(true);
                }}
              />
            </div>
          </CardContent>
        )}

        {/* Engagement Stats */}
        <div className="px-4 py-2 flex items-center gap-4 text-xs text-muted-foreground border-y">
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
            {likesCount} likes
          </span>
          <span>{commentsCount} comments</span>
          <span>{shareCount} shares</span>
          {repostCount > 0 && <span>{repostCount} reposts</span>}
        </div>

        {/* Action Buttons */}
        <CardFooter className="flex items-center justify-around p-1">
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 gap-2 h-11 rounded-none ${isLiked ? "text-red-500" : "text-muted-foreground hover:text-foreground"}`}
            onClick={onLike}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
            <span className="hidden sm:inline">Like</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-2 h-11 rounded-none text-muted-foreground hover:text-foreground"
            onClick={onComment}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="hidden sm:inline">Comment</span>
          </Button>
          {onRepost && (
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 gap-2 h-11 rounded-none text-muted-foreground hover:text-foreground"
              onClick={onRepost}
            >
              <Repeat2 className="h-5 w-5" />
              <span className="hidden sm:inline">Repost</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-2 h-11 rounded-none text-muted-foreground hover:text-foreground"
            onClick={onShare}
          >
            <Share2 className="h-5 w-5" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </CardFooter>
      </Card>

      {/* Profile Dialog */}
      {userId && (
        <ProfileDialog
          userId={userId}
          currentUserId={currentUserId || null}
          open={profileOpen}
          onOpenChange={setProfileOpen}
        />
      )}
    </>
  );
};
