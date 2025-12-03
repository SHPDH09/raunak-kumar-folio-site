import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Plus, X, ChevronLeft, ChevronRight, Eye, Upload } from "lucide-react";
import { toast } from "sonner";

interface Story {
  id: string;
  user_id: string;
  file_path: string;
  caption: string | null;
  created_at: string;
  expires_at: string;
  views_count: number;
  url?: string;
}

interface UserStories {
  userId: string;
  username: string;
  avatarUrl: string | null;
  stories: Story[];
  hasUnviewed: boolean;
}

interface StoriesProps {
  currentUserId: string | null;
  onRefresh?: () => void;
}

export const Stories = ({ currentUserId, onRefresh }: StoriesProps) => {
  const [userStories, setUserStories] = useState<UserStories[]>([]);
  const [selectedUserStories, setSelectedUserStories] = useState<UserStories | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadStories();
  }, [currentUserId]);

  useEffect(() => {
    if (selectedUserStories) {
      startProgressTimer();
      markStoryAsViewed();
    }
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [selectedUserStories, currentStoryIndex]);

  const loadStories = async () => {
    try {
      const { data: storiesData, error } = await supabase
        .from('stories')
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!storiesData || storiesData.length === 0) {
        setUserStories([]);
        return;
      }

      // Get unique user IDs
      const userIds = [...new Set(storiesData.map(s => s.user_id))];
      
      // Fetch profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);

      const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // Get viewed stories for current user
      let viewedStoryIds = new Set<string>();
      if (currentUserId) {
        const { data: viewedData } = await supabase
          .from('story_views')
          .select('story_id')
          .eq('viewer_id', currentUserId);
        
        viewedStoryIds = new Set(viewedData?.map(v => v.story_id) || []);
      }

      // Generate signed URLs and group by user
      const storiesWithUrls = await Promise.all(
        storiesData.map(async (story) => {
          const { data: signedUrlData } = await supabase.storage
            .from('stories')
            .createSignedUrl(story.file_path, 3600);
          
          return {
            ...story,
            url: signedUrlData?.signedUrl || '',
          };
        })
      );

      // Group stories by user
      const groupedStories = new Map<string, UserStories>();
      
      for (const story of storiesWithUrls) {
        const profile = profilesMap.get(story.user_id);
        const existing = groupedStories.get(story.user_id);
        
        if (existing) {
          existing.stories.push(story);
          if (!viewedStoryIds.has(story.id)) {
            existing.hasUnviewed = true;
          }
        } else {
          groupedStories.set(story.user_id, {
            userId: story.user_id,
            username: profile?.username || 'Unknown',
            avatarUrl: profile?.avatar_url || null,
            stories: [story],
            hasUnviewed: !viewedStoryIds.has(story.id),
          });
        }
      }

      // Sort: current user first, then unviewed, then others
      const sortedStories = Array.from(groupedStories.values()).sort((a, b) => {
        if (a.userId === currentUserId) return -1;
        if (b.userId === currentUserId) return 1;
        if (a.hasUnviewed && !b.hasUnviewed) return -1;
        if (!a.hasUnviewed && b.hasUnviewed) return 1;
        return 0;
      });

      setUserStories(sortedStories);
    } catch (error) {
      console.error('Error loading stories:', error);
    }
  };

  const startProgressTimer = () => {
    setProgress(0);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    const duration = 5000; // 5 seconds per story
    const interval = 50;
    let elapsed = 0;

    progressInterval.current = setInterval(() => {
      elapsed += interval;
      const newProgress = (elapsed / duration) * 100;
      setProgress(newProgress);

      if (elapsed >= duration) {
        goToNextStory();
      }
    }, interval);
  };

  const markStoryAsViewed = async () => {
    if (!currentUserId || !selectedUserStories) return;
    
    const currentStory = selectedUserStories.stories[currentStoryIndex];
    if (!currentStory || currentStory.user_id === currentUserId) return;

    try {
      await supabase
        .from('story_views')
        .upsert({
          story_id: currentStory.id,
          viewer_id: currentUserId,
        }, { onConflict: 'story_id,viewer_id' });

      // Update view count
      await supabase
        .from('stories')
        .update({ views_count: (currentStory.views_count || 0) + 1 })
        .eq('id', currentStory.id);
    } catch (error) {
      console.error('Error marking story as viewed:', error);
    }
  };

  const goToNextStory = () => {
    if (!selectedUserStories) return;

    if (currentStoryIndex < selectedUserStories.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else {
      // Move to next user's stories
      const currentUserIndex = userStories.findIndex(
        u => u.userId === selectedUserStories.userId
      );
      if (currentUserIndex < userStories.length - 1) {
        setSelectedUserStories(userStories[currentUserIndex + 1]);
        setCurrentStoryIndex(0);
      } else {
        closeStoryViewer();
      }
    }
  };

  const goToPrevStory = () => {
    if (!selectedUserStories) return;

    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    } else {
      // Move to previous user's stories
      const currentUserIndex = userStories.findIndex(
        u => u.userId === selectedUserStories.userId
      );
      if (currentUserIndex > 0) {
        const prevUser = userStories[currentUserIndex - 1];
        setSelectedUserStories(prevUser);
        setCurrentStoryIndex(prevUser.stories.length - 1);
      }
    }
  };

  const closeStoryViewer = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    setSelectedUserStories(null);
    setCurrentStoryIndex(0);
    setProgress(0);
    loadStories(); // Refresh to update viewed status
  };

  const handleAddStory = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUserId || !e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUserId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('stories')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Calculate expiration (24 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error: insertError } = await supabase
        .from('stories')
        .insert({
          user_id: currentUserId,
          file_path: fileName,
          expires_at: expiresAt.toISOString(),
        });

      if (insertError) throw insertError;

      toast.success('Story added!');
      loadStories();
      onRefresh?.();
    } catch (error) {
      console.error('Error uploading story:', error);
      toast.error('Failed to upload story');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const currentStory = selectedUserStories?.stories[currentStoryIndex];

  return (
    <>
      {/* Stories Bar */}
      <div className="bg-card border-b">
        <div className="container py-4">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {/* Add Story Button */}
            {currentUserId && (
              <div className="flex flex-col items-center gap-1 shrink-0">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center border-2 border-dashed border-primary/50 hover:border-primary transition-colors"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                  ) : (
                    <Plus className="h-6 w-6 text-primary" />
                  )}
                </button>
                <span className="text-xs text-muted-foreground">Add Story</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAddStory}
                  className="hidden"
                />
              </div>
            )}

            {/* User Stories */}
            {userStories.map((userStory) => (
              <button
                key={userStory.userId}
                onClick={() => {
                  setSelectedUserStories(userStory);
                  setCurrentStoryIndex(0);
                }}
                className="flex flex-col items-center gap-1 shrink-0"
              >
                <div
                  className={`p-0.5 rounded-full ${
                    userStory.hasUnviewed
                      ? 'bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500'
                      : 'bg-muted'
                  }`}
                >
                  <Avatar className="h-14 w-14 border-2 border-background">
                    {userStory.avatarUrl ? (
                      <AvatarImage src={userStory.avatarUrl} />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {userStory.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-xs text-muted-foreground truncate max-w-16">
                  {userStory.userId === currentUserId ? 'Your Story' : userStory.username}
                </span>
              </button>
            ))}

            {userStories.length === 0 && !currentUserId && (
              <p className="text-sm text-muted-foreground py-4">
                Login to see and post stories
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Story Viewer Modal */}
      <Dialog open={!!selectedUserStories} onOpenChange={() => closeStoryViewer()}>
        <DialogContent className="max-w-lg p-0 bg-black border-0 overflow-hidden">
          {currentStory && selectedUserStories && (
            <div className="relative h-[80vh] flex flex-col">
              {/* Progress Bars */}
              <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
                {selectedUserStories.stories.map((_, idx) => (
                  <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-100"
                      style={{
                        width: idx < currentStoryIndex ? '100%' : 
                               idx === currentStoryIndex ? `${progress}%` : '0%'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Header */}
              <div className="absolute top-6 left-0 right-0 z-20 flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    {selectedUserStories.avatarUrl ? (
                      <AvatarImage src={selectedUserStories.avatarUrl} />
                    ) : null}
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                      {selectedUserStories.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {selectedUserStories.username}
                    </p>
                    <p className="text-white/60 text-xs">
                      {new Date(currentStory.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {currentStory.user_id === currentUserId && (
                    <div className="flex items-center gap-1 text-white/80 text-sm">
                      <Eye className="h-4 w-4" />
                      {currentStory.views_count || 0}
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={closeStoryViewer}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Story Image */}
              <div className="flex-1 flex items-center justify-center bg-black">
                <img
                  src={currentStory.url}
                  alt="Story"
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Caption */}
              {currentStory.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-16">
                  <p className="text-white text-sm">{currentStory.caption}</p>
                </div>
              )}

              {/* Navigation Areas */}
              <button
                className="absolute left-0 top-20 bottom-20 w-1/3 z-10"
                onClick={goToPrevStory}
              />
              <button
                className="absolute right-0 top-20 bottom-20 w-1/3 z-10"
                onClick={goToNextStory}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
