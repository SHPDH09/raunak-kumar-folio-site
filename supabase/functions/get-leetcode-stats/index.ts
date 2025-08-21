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
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const url = new URL(req.url)
    const username = url.searchParams.get('username') || 'RAUNAK9025'

    // Fetch main stats
    const { data: stats, error: statsError } = await supabase
      .from('leetcode_stats')
      .select('*')
      .eq('username', username)
      .single()

    if (statsError && statsError.code !== 'PGRST116') {
      throw statsError
    }

    // Fetch recent submissions
    const { data: submissions, error: submissionsError } = await supabase
      .from('leetcode_submissions')
      .select('*')
      .eq('username', username)
      .order('submitted_at', { ascending: false })
      .limit(10)

    if (submissionsError) {
      console.error('Error fetching submissions:', submissionsError)
    }

    // Fetch monthly progress
    const { data: monthlyProgress, error: monthlyError } = await supabase
      .from('leetcode_monthly_progress')
      .select('*')
      .eq('username', username)
      .order('year', { ascending: true })

    if (monthlyError) {
      console.error('Error fetching monthly progress:', monthlyError)
    }

    // Fetch topic progress
    const { data: topicProgress, error: topicError } = await supabase
      .from('leetcode_topic_progress')
      .select('*')
      .eq('username', username)
      .order('solved', { ascending: false })

    if (topicError) {
      console.error('Error fetching topic progress:', topicError)
    }

    const responseData = {
      stats: stats || {
        username,
        total_solved: 0,
        ranking: 0,
        contest_rating: 0,
        acceptance_rate: 0,
        streak: 0,
        easy_solved: 0,
        medium_solved: 0,
        hard_solved: 0
      },
      submissions: submissions || [],
      monthlyProgress: monthlyProgress || [],
      topicProgress: topicProgress || []
    }

    return new Response(
      JSON.stringify(responseData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error fetching LeetCode data:', error)
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})