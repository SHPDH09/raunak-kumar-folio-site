import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Trash2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PostCardProps {
  id: string;
  title: string;
  caption?: string;
  imageUrl: string;
  username: string;
  isVerified: boolean;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  shareCount: number;
  isLiked: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onClick?: () => void;
}

export const PostCard = ({
  title,
  caption,
  imageUrl,
  username,
  isVerified,
  createdAt,
  likesCount,
  commentsCount,
  shareCount,
  isLiked,
  canEdit,
  canDelete,
  onLike,
  onComment,
  onShare,
  onDelete,
  onEdit,
  onClick,
}: PostCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Avatar>
          <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold">{username}</p>
            {isVerified && <Badge variant="secondary" className="h-5 px-1">✓</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">{formatDate(createdAt)}</p>
        </div>
        {(canEdit || canDelete) && (
          <div className="flex gap-2">
            {canEdit && onEdit && (
              <Button variant="ghost" size="icon" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {canDelete && onDelete && (
              <Button variant="ghost" size="icon" onClick={onDelete}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div 
          className="relative aspect-square cursor-pointer bg-muted"
          onClick={onClick}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          <img
            src={imageUrl}
            alt={title}
            className={`w-full h-full object-cover transition-opacity ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold mb-1">{title}</h3>
          {caption && <p className="text-sm text-muted-foreground">{caption}</p>}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={isLiked ? "text-red-500" : ""}
              onClick={onLike}
            >
              <Heart className={`h-5 w-5 mr-1 ${isLiked ? "fill-current" : ""}`} />
              {likesCount}
            </Button>
            <Button variant="ghost" size="sm" onClick={onComment}>
              <MessageCircle className="h-5 w-5 mr-1" />
              {commentsCount}
            </Button>
            <Button variant="ghost" size="sm" onClick={onShare}>
              <Share2 className="h-5 w-5 mr-1" />
              {shareCount}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
