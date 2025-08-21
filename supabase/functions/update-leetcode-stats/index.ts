import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { username } = await req.json()
    
    if (!username) {
      throw new Error('Username is required')
    }

    console.log(`Updating LeetCode stats for ${username}`)

    // Fetch LeetCode profile data
    // Note: LeetCode doesn't have an official API, so we'll simulate data updates
    // In a real implementation, you would scrape the profile or use a third-party service
    
    const updatedStats = await fetchLeetCodeStats(username)
    
    // Update main stats
    const { error: statsError } = await supabase
      .from('leetcode_stats')
      .upsert({
        username,
        total_solved: updatedStats.totalSolved,
        ranking: updatedStats.ranking,
        contest_rating: updatedStats.contestRating,
        acceptance_rate: updatedStats.acceptanceRate,
        streak: updatedStats.streak,
        easy_solved: updatedStats.easy.solved,
        medium_solved: updatedStats.medium.solved,
        hard_solved: updatedStats.hard.solved,
        last_updated: new Date().toISOString()
      })

    if (statsError) {
      throw statsError
    }

    // Update recent submissions
    if (updatedStats.recentSubmissions && updatedStats.recentSubmissions.length > 0) {
      // Clear old submissions
      await supabase
        .from('leetcode_submissions')
        .delete()
        .eq('username', username)

      // Insert new submissions
      const { error: submissionsError } = await supabase
        .from('leetcode_submissions')
        .insert(
          updatedStats.recentSubmissions.map((submission: any) => ({
            username,
            problem_name: submission.problem,
            difficulty: submission.difficulty,
            status: submission.result,
            submitted_at: new Date().toISOString()
          }))
        )

      if (submissionsError) {
        console.error('Error updating submissions:', submissionsError)
      }
    }

    // Update monthly progress for current month
    const currentDate = new Date()
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' })
    const currentYear = currentDate.getFullYear()

    const { error: monthlyError } = await supabase
      .from('leetcode_monthly_progress')
      .upsert({
        username,
        month: currentMonth,
        year: currentYear,
        problems_solved: updatedStats.monthlyProgress || 30
      })

    if (monthlyError) {
      console.error('Error updating monthly progress:', monthlyError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'LeetCode stats updated successfully',
        data: updatedStats
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error updating LeetCode stats:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

// Simulated function to fetch LeetCode stats
// In production, this would either scrape the profile or use a third-party API
async function fetchLeetCodeStats(username: string) {
  console.log(`Fetching stats for ${username}`)
  
  // Simulate API call with some randomized updates
  const baseStats = {
    totalSolved: 342,
    ranking: 125432,
    contestRating: 1654,
    acceptanceRate: 68.5,
    streak: 28,
    easy: { solved: 156, total: 800 },
    medium: { solved: 142, total: 1600 },
    hard: { solved: 44, total: 600 }
  }

  // Add some random variations to simulate real updates
  const randomIncrease = Math.floor(Math.random() * 3) + 1
  
  return {
    ...baseStats,
    totalSolved: baseStats.totalSolved + randomIncrease,
    ranking: Math.max(baseStats.ranking - Math.floor(Math.random() * 1000), 100000),
    streak: baseStats.streak + Math.floor(Math.random() * 2),
    monthlyProgress: Math.floor(Math.random() * 10) + 25,
    recentSubmissions: [
      { problem: "Maximum Subarray", difficulty: "Medium", result: "Accepted" },
      { problem: "Two Sum", difficulty: "Easy", result: "Accepted" },
      { problem: "Longest Palindromic Substring", difficulty: "Medium", result: "Accepted" },
      { problem: "Binary Tree Inorder Traversal", difficulty: "Easy", result: "Accepted" },
      { problem: "Valid Parentheses", difficulty: "Easy", result: "Accepted" }
    ]
  }
}