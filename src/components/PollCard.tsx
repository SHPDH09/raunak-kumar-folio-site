import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PollOption {
  id: string;
  option_text: string;
  vote_count: number;
}

interface PollCardProps {
  id: string;
  question: string;
  options: PollOption[];
  createdAt: string;
  expiresAt: string;
  username: string;
  isVerified: boolean;
  userId: string;
  currentUserId?: string;
}

export const PollCard = ({
  id,
  question,
  options: initialOptions,
  createdAt,
  expiresAt,
  username,
  isVerified,
  userId,
  currentUserId,
}: PollCardProps) => {
  const [options, setOptions] = useState(initialOptions);
  const [votedOptionId, setVotedOptionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);

  const isExpired = new Date(expiresAt) < new Date();

  useEffect(() => {
    setTotalVotes(options.reduce((sum, opt) => sum + opt.vote_count, 0));
    if (currentUserId) {
      checkUserVote();
    }
  }, [currentUserId, id]);

  const checkUserVote = async () => {
    if (!currentUserId) return;
    
    const { data } = await supabase
      .from('poll_votes')
      .select('option_id')
      .eq('poll_id', id)
      .eq('user_id', currentUserId)
      .maybeSingle();

    if (data) {
      setVotedOptionId(data.option_id);
    }
  };

  const handleVote = async (optionId: string) => {
    if (!currentUserId) {
      toast.error("Please login to vote");
      return;
    }
    if (votedOptionId || isExpired) return;

    setLoading(true);
    try {
      // Insert vote
      const { error: voteError } = await supabase
        .from('poll_votes')
        .insert({
          poll_id: id,
          option_id: optionId,
          user_id: currentUserId,
        });

      if (voteError) {
        if (voteError.code === '23505') {
          toast.error("You've already voted on this poll");
        } else {
          throw voteError;
        }
        return;
      }

      // Update vote count
      const { error: updateError } = await supabase
        .from('poll_options')
        .update({ vote_count: options.find(o => o.id === optionId)!.vote_count + 1 })
        .eq('id', optionId);

      if (updateError) throw updateError;

      // Update local state
      setOptions(prev => prev.map(opt => 
        opt.id === optionId ? { ...opt, vote_count: opt.vote_count + 1 } : opt
      ));
      setVotedOptionId(optionId);
      setTotalVotes(prev => prev + 1);
      toast.success("Vote recorded!");
    } catch (error) {
      console.error('Error voting:', error);
      toast.error("Failed to vote");
    } finally {
      setLoading(false);
    }
  };

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

  const getTimeRemaining = () => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diffMs = expires.getTime() - now.getTime();
    
    if (diffMs <= 0) return "Ended";
    
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffDays > 0) return `${diffDays}d left`;
    if (diffHours > 0) return `${diffHours}h left`;
    return "< 1h left";
  };

  const showResults = !!votedOptionId || isExpired;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-l-4 border-l-primary">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Avatar>
          <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold">{username}</p>
            {isVerified && (
              <Badge className="h-5 px-1.5 bg-blue-500 hover:bg-blue-600 text-white">
                ✓
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{formatDate(createdAt)}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <BarChart3 className="h-4 w-4" />
          <span>Poll</span>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-2">
        <h3 className="font-semibold text-lg mb-4">{question}</h3>
        
        <div className="space-y-3">
          {options.map((option) => {
            const percentage = totalVotes > 0 ? Math.round((option.vote_count / totalVotes) * 100) : 0;
            const isVoted = votedOptionId === option.id;

            return (
              <div key={option.id} className="relative">
                {showResults ? (
                  <div className="relative">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm ${isVoted ? 'font-semibold text-primary' : ''}`}>
                        {option.option_text}
                        {isVoted && " ✓"}
                      </span>
                      <span className="text-sm font-medium">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto py-3 text-left"
                    onClick={() => handleVote(option.id)}
                    disabled={loading || isExpired}
                  >
                    {option.option_text}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between px-4 py-3 text-sm text-muted-foreground border-t">
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>{totalVotes} votes</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span className={isExpired ? "text-destructive" : ""}>{getTimeRemaining()}</span>
        </div>
      </CardFooter>
    </Card>
  );
};