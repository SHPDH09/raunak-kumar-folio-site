import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Code, Trophy, TrendingUp } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const LeetCodeStats = () => {
  const navigate = useNavigate();
  
  // LeetCode quick stats for RAUNAK9025
  const stats = {
    username: "RAUNAK9025",
    profileUrl: "https://leetcode.com/u/RAUNAK9025/",
    totalSolved: 342,
    ranking: 125432,
    streak: 28,
    contestRating: 1654
  };

  return (
    <section id="leetcode" className="py-20 px-4 bg-secondary/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Competitive Programming</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My LeetCode journey showcasing algorithmic problem-solving skills and competitive programming achievements
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LeetCode Profile Summary */}
          <Card className="hover-lift shadow-card">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Code className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">LeetCode Profile</CardTitle>
                  <CardDescription>@{stats.username}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-secondary/20 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span className="text-2xl font-bold text-primary">{stats.totalSolved}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Problems Solved</p>
                </div>
                <div className="text-center p-4 bg-secondary/20 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span className="text-2xl font-bold text-orange-500">#{stats.ranking.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Global Rank</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <Badge variant="outline" className="mb-2">🔥 {stats.streak} Days</Badge>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="mb-2">Rating: {stats.contestRating}</Badge>
                  <p className="text-sm text-muted-foreground">Contest Rating</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/leetcode')} 
                  className="w-full"
                  size="lg"
                >
                  <Code className="w-4 h-4 mr-2" />
                  View Detailed Statistics
                </Button>
                <Button 
                  variant="outline" 
                  asChild 
                  className="w-full"
                  size="lg"
                >
                  <a href={stats.profileUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit LeetCode Profile
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Achievement Highlights */}
          <Card className="hover-lift shadow-card">
            <CardHeader>
              <CardTitle className="text-xl">Key Achievements</CardTitle>
              <CardDescription>Highlights from my problem-solving journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-green-700 dark:text-green-400">Top 15% Global Ranking</p>
                  <p className="text-sm text-muted-foreground">Ranked #{stats.ranking.toLocaleString()} worldwide</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-blue-700 dark:text-blue-400">Contest Expert Level</p>
                  <p className="text-sm text-muted-foreground">Rating: {stats.contestRating} (Expert tier)</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-orange-700 dark:text-orange-400">Active Problem Solver</p>
                  <p className="text-sm text-muted-foreground">{stats.streak} day solving streak</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-purple-700 dark:text-purple-400">Diverse Problem Portfolio</p>
                  <p className="text-sm text-muted-foreground">Solved across all difficulty levels</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LeetCodeStats;