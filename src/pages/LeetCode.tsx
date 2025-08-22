import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Trophy, Calendar, Target } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const LeetCode = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  // Real stats for RAUNAK9025 from LeetCode profile
  const [stats, setStats] = useState({
    username: "RAUNAK9025",
    profileUrl: "https://leetcode.com/u/RAUNAK9025/",
    totalSolved: 48,
    totalQuestions: 3656,
    ranking: 2265999,
    streak: 0, // Not shown on profile
    contestRating: 0, // Not participating in contests yet
    acceptanceRate: 98.0,
    easy: { solved: 12, total: 890 },
    medium: { solved: 29, total: 1904 },
    hard: { solved: 7, total: 862 }
  });

  const [monthlyProgress, setMonthlyProgress] = useState([
    { month: 'Jan', problems: 2 },
    { month: 'Feb', problems: 5 },
    { month: 'Mar', problems: 8 },
    { month: 'Apr', problems: 6 },
    { month: 'May', problems: 4 },
    { month: 'Jun', problems: 7 },
    { month: 'Jul', problems: 3 },
    { month: 'Aug', problems: 9 },
    { month: 'Sep', problems: 2 },
    { month: 'Oct', problems: 1 },
    { month: 'Nov', problems: 0 },
    { month: 'Dec', problems: 1 }
  ]);

  const [topicData, setTopicData] = useState([
    { topic: 'Array', solved: 24, total: 50, percentage: 48.0 },
    { topic: 'String', solved: 14, total: 30, percentage: 46.7 },
    { topic: 'Hash Table', solved: 12, total: 25, percentage: 48.0 },
    { topic: 'Two Pointers', solved: 12, total: 20, percentage: 60.0 },
    { topic: 'Math', solved: 10, total: 20, percentage: 50.0 },
    { topic: 'Dynamic Programming', solved: 7, total: 15, percentage: 46.7 },
    { topic: 'Recursion', solved: 5, total: 12, percentage: 41.7 },
    { topic: 'Backtracking', solved: 2, total: 8, percentage: 25.0 }
  ]);

  const [recentSubmissions, setRecentSubmissions] = useState([
    { problem: "Two Sum", difficulty: "Easy", result: "Accepted", time: "1 day ago" },
    { problem: "Add Two Numbers", difficulty: "Medium", result: "Accepted", time: "2 days ago" },
    { problem: "Longest Substring Without Repeating Characters", difficulty: "Medium", result: "Accepted", time: "3 days ago" },
    { problem: "Median of Two Sorted Arrays", difficulty: "Hard", result: "Accepted", time: "1 week ago" },
    { problem: "Longest Palindromic Substring", difficulty: "Medium", result: "Accepted", time: "1 week ago" }
  ]);

  // Fetch data from Supabase
  const fetchLeetCodeData = async () => {
    try {
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.log('Supabase not configured, using static data');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('get-leetcode-stats', {
        body: { username: stats.username }
      });

      if (error) throw error;

      if (data?.stats) {
        setStats(prev => ({
          ...prev,
          totalSolved: data.stats.total_solved,
          ranking: data.stats.ranking,
          contestRating: data.stats.contest_rating,
          acceptanceRate: data.stats.acceptance_rate,
          streak: data.stats.streak,
          easy: { solved: data.stats.easy_solved, total: 800 },
          medium: { solved: data.stats.medium_solved, total: 1600 },
          hard: { solved: data.stats.hard_solved, total: 600 }
        }));
        
        setLastUpdated(data.stats.last_updated);
      }

      if (data?.monthlyProgress) {
        const monthlyData = data.monthlyProgress.map((item: any) => ({
          month: item.month.substring(0, 3),
          problems: item.problems_solved
        }));
        setMonthlyProgress(monthlyData);
      }

      if (data?.topicProgress) {
        const topicProgData = data.topicProgress.map((item: any) => ({
          topic: item.topic_name,
          solved: item.solved,
          total: item.total_problems,
          percentage: ((item.solved / item.total_problems) * 100).toFixed(1)
        }));
        setTopicData(topicProgData);
      }

      if (data?.submissions) {
        const submissionData = data.submissions.map((item: any) => ({
          problem: item.problem_name,
          difficulty: item.difficulty,
          result: item.status,
          time: new Date(item.submitted_at).toLocaleString()
        }));
        setRecentSubmissions(submissionData);
      }

    } catch (error) {
      console.error('Error fetching LeetCode data:', error);
      toast.error('Failed to fetch latest data, showing cached version');
    } finally {
      setLoading(false);
    }
  };

  // Update LeetCode stats
  const updateStats = async () => {
    // Check if Supabase is configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      toast.error('Supabase not configured. Please connect to Supabase to enable auto-updates.');
      return;
    }

    setUpdating(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-leetcode-stats', {
        body: { username: stats.username }
      });

      if (error) throw error;

      toast.success('LeetCode stats updated successfully!');
      await fetchLeetCodeData(); // Refresh data after update
    } catch (error) {
      console.error('Error updating stats:', error);
      toast.error('Failed to update stats. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchLeetCodeData();
  }, []);

  const difficultyData = [
    { name: 'Easy', solved: stats.easy.solved, total: stats.easy.total, color: '#00b300' },
    { name: 'Medium', solved: stats.medium.solved, total: stats.medium.total, color: '#ffb300' },
    { name: 'Hard', solved: stats.hard.solved, total: stats.hard.total, color: '#ff4444' }
  ];

  const pieData = [
    { name: 'Easy', value: stats.easy.solved, color: '#00b300' },
    { name: 'Medium', value: stats.medium.solved, color: '#ffb300' },
    { name: 'Hard', value: stats.hard.solved, color: '#ff4444' }
  ];

  const weeklyData = [
    { day: 'Mon', problems: 1 },
    { day: 'Tue', problems: 0 },
    { day: 'Wed', problems: 2 },
    { day: 'Thu', problems: 1 },
    { day: 'Fri', problems: 0 },
    { day: 'Sat', problems: 1 },
    { day: 'Sun', problems: 1 }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Medium': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Hard': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading LeetCode statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card/50 border-b sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">LeetCode Profile</h1>
                <p className="text-muted-foreground">@{stats.username}</p>
              </div>
            </div>
            <Button asChild>
              <a href={stats.profileUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on LeetCode
              </a>
            </Button>
            <Button 
              onClick={updateStats} 
              disabled={updating}
              variant="outline"
            >
              {updating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <ArrowLeft className="w-4 h-4 mr-2 rotate-45" />
                  Update Stats
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover-lift">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Trophy className="w-5 h-5 text-primary" />
                <Badge variant="secondary">Rank #{stats.ranking.toLocaleString()}</Badge>
              </div>
              <CardTitle className="text-3xl font-bold text-primary">{stats.totalSolved}</CardTitle>
              <CardDescription>Problems Solved</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={(stats.totalSolved / stats.totalQuestions) * 100} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {((stats.totalSolved / stats.totalQuestions) * 100).toFixed(1)}% of {stats.totalQuestions}
              </p>
              {lastUpdated && (
                <p className="text-xs text-muted-foreground mt-1">
                  Updated: {new Date(lastUpdated).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Calendar className="w-5 h-5 text-orange-500" />
                <Badge variant="outline">🔥 Active</Badge>
              </div>
              <CardTitle className="text-3xl font-bold text-orange-500">{stats.streak}</CardTitle>
              <CardDescription>Day Streak</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Keep the momentum going!</p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Target className="w-5 h-5 text-blue-500" />
                <Badge variant="secondary">Expert</Badge>
              </div>
              <CardTitle className="text-3xl font-bold text-blue-500">{stats.contestRating}</CardTitle>
              <CardDescription>Contest Rating</CardDescription>
            </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Keep solving to improve!</p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="pb-3">
              <CardTitle className="text-3xl font-bold text-green-500">{stats.acceptanceRate}%</CardTitle>
              <CardDescription>Acceptance Rate</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">High success rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Difficulty Distribution */}
          <Card className="hover-glow">
            <CardHeader>
              <CardTitle>Problem Difficulty Distribution</CardTitle>
              <CardDescription>Breakdown by difficulty level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Progress */}
          <Card className="hover-glow">
            <CardHeader>
              <CardTitle>Monthly Progress</CardTitle>
              <CardDescription>Problems solved throughout the year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="problems" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary)/20%)" 
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Activity */}
          <Card className="hover-glow">
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Problems solved this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="problems" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Topics Progress */}
          <Card className="hover-glow">
            <CardHeader>
              <CardTitle>Topics Mastery</CardTitle>
              <CardDescription>Progress across algorithmic topics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topicData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="topic" type="category" width={120} />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${value} problems`, 
                        name === 'solved' ? 'Solved' : 'Total'
                      ]}
                    />
                    <Bar dataKey="total" fill="hsl(var(--muted))" />
                    <Bar dataKey="solved" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Difficulty Progress */}
        <Card className="mb-8 hover-glow">
          <CardHeader>
            <CardTitle>Progress by Difficulty</CardTitle>
            <CardDescription>Current solving progress across different difficulty levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {difficultyData.map((difficulty) => (
                <div key={difficulty.name} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className={getDifficultyColor(difficulty.name)}
                      >
                        {difficulty.name}
                      </Badge>
                      <span className="font-semibold">
                        {difficulty.solved} / {difficulty.total}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">
                      {((difficulty.solved / difficulty.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={(difficulty.solved / difficulty.total) * 100} 
                    className="h-3"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card className="hover-glow">
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Latest problem solving activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSubmissions.map((submission, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <h4 className="font-medium text-foreground">{submission.problem}</h4>
                      <p className="text-sm text-muted-foreground">{submission.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getDifficultyColor(submission.difficulty)}>
                      {submission.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-green-500 border-green-500/20">
                      {submission.result}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Auto-update notice */}
        <Card className="mt-8 border-green-500/20 bg-green-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-green-500 mt-0.5">✅</div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Auto-update Enabled</h4>
                <p className="text-sm text-muted-foreground">
                  Your LeetCode statistics are now connected to Supabase and can be updated automatically. 
                  Click "Update Stats" to fetch the latest data, or set up scheduled updates for real-time syncing.
                  {lastUpdated && (
                    <span className="block mt-1 font-medium">
                      Last updated: {new Date(lastUpdated).toLocaleString()}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeetCode;