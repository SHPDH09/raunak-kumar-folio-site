import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const LeetCodeStats = () => {
  // Sample LeetCode statistics - replace with actual data
  const stats = {
    totalSolved: 342,
    totalQuestions: 3000,
    ranking: 125432,
    streak: 28,
    easy: { solved: 156, total: 800, percentage: 19.5 },
    medium: { solved: 142, total: 1600, percentage: 8.9 },
    hard: { solved: 44, total: 600, percentage: 7.3 }
  };

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
    { day: 'Mon', problems: 3 },
    { day: 'Tue', problems: 5 },
    { day: 'Wed', problems: 2 },
    { day: 'Thu', problems: 7 },
    { day: 'Fri', problems: 4 },
    { day: 'Sat', problems: 6 },
    { day: 'Sun', problems: 3 }
  ];

  const topicData = [
    { topic: 'Array', solved: 45, total: 80 },
    { topic: 'Dynamic Programming', solved: 32, total: 60 },
    { topic: 'Tree', solved: 28, total: 50 },
    { topic: 'Graph', solved: 24, total: 45 },
    { topic: 'String', solved: 38, total: 70 },
    { topic: 'Linked List', solved: 22, total: 35 }
  ];

  return (
    <section id="leetcode" className="py-20 px-4 bg-secondary/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">LeetCode Statistics</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My competitive programming journey and problem-solving achievements
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold text-primary">{stats.totalSolved}</CardTitle>
              <CardDescription>Problems Solved</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={(stats.totalSolved / stats.totalQuestions) * 100} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {((stats.totalSolved / stats.totalQuestions) * 100).toFixed(1)}% of {stats.totalQuestions}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold text-primary">#{stats.ranking.toLocaleString()}</CardTitle>
              <CardDescription>Global Ranking</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="mt-2">Top 15%</Badge>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold text-primary">{stats.streak}</CardTitle>
              <CardDescription>Day Streak</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="mt-2">🔥 Active</Badge>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold text-primary">4.2</CardTitle>
              <CardDescription>Contest Rating</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="mt-2">Expert</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Difficulty Distribution */}
          <Card>
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

          {/* Weekly Activity */}
          <Card>
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
        </div>

        {/* Difficulty Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Progress by Difficulty</CardTitle>
            <CardDescription>Current solving progress across different difficulty levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {difficultyData.map((difficulty) => (
                <div key={difficulty.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        style={{ borderColor: difficulty.color, color: difficulty.color }}
                      >
                        {difficulty.name}
                      </Badge>
                      <span className="font-medium">
                        {difficulty.solved} / {difficulty.total}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {((difficulty.solved / difficulty.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={(difficulty.solved / difficulty.total) * 100} 
                    className="h-3"
                    style={{ 
                      background: `${difficulty.color}20` 
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Topics Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progress by Topics</CardTitle>
            <CardDescription>Problem solving progress across different algorithmic topics</CardDescription>
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

        {/* Profile Link */}
        <div className="text-center mt-8">
          <a 
            href="https://leetcode.com/username" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <span>View Full LeetCode Profile</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default LeetCodeStats;