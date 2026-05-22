import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const igToken = Deno.env.get('INSTAGRAM_ACCESS_TOKEN')
    const igUserId = Deno.env.get('INSTAGRAM_USER_ID')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!igToken || !igUserId || !supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const url = `https://graph.instagram.com/v21.0/${igUserId}/media?fields=id,media_url,permalink,caption,media_type,timestamp&access_token=${igToken}&limit=25`

    const res = await fetch(url)
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Instagram API error ${res.status}: ${err}`)
    }

    const data = await res.json()
    const posts = data.data || []

    let upserted = 0
    let failed = 0

    for (const post of posts) {
      const { error } = await supabase.from('instagram_posts').upsert(
        {
          media_id: post.id,
          media_url: post.media_url,
          permalink: post.permalink || null,
          caption: post.caption || null,
          media_type: post.media_type || 'IMAGE',
          timestamp: post.timestamp || null,
          fetched_at: new Date().toISOString(),
        },
        { onConflict: 'media_id' },
      )

      if (error) {
        console.error('Failed to upsert post:', post.id, error)
        failed++
      } else {
        upserted++
      }
    }

    return new Response(
      JSON.stringify({ success: true, upserted, failed, total: posts.length }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('fetch-instagram-feed error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
