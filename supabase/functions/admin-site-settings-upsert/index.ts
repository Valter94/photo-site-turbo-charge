import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    console.log('📝 Site settings update request received:', payload)

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      console.error('❌ Missing Supabase env vars')
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    // Get existing record first
    console.log('🔍 Fetching existing site_settings record...')
    const { data: existing, error: fetchError } = await supabase
      .from('site_settings')
      .select('id')
      .limit(1)
      .maybeSingle()

    if (fetchError) {
      console.error('❌ Error fetching existing record:', fetchError)
      throw fetchError
    }

    console.log('✅ Existing record found:', existing)

    const updateData = {
      photographer_name: payload.photographer_name ?? null,
      photographer_description: payload.photographer_description ?? null,
      photographer_photo: payload.photographer_photo ?? null,
      hero_title: payload.hero_title ?? null,
      hero_subtitle: payload.hero_subtitle ?? null,
      contact_phone: payload.contact_phone ?? null,
      contact_email: payload.contact_email ?? null,
      contact_address: payload.contact_address ?? null,
      updated_at: new Date().toISOString()
    }

    console.log('📤 Updating with data:', updateData)

    let data, error

    if (existing) {
      // Update existing record using its ID
      console.log(`🔄 Updating existing record with ID: ${existing.id}`)
      const result = await supabase
        .from('site_settings')
        .update(updateData)
        .eq('id', existing.id)
        .select()
        .single()
      
      data = result.data
      error = result.error
    } else {
      // Insert new record if none exists
      console.log('➕ Creating new site_settings record')
      const result = await supabase
        .from('site_settings')
        .insert(updateData)
        .select()
        .single()
      
      data = result.data
      error = result.error
    }

    if (error) {
      console.error('❌ Database operation error:', error)
      throw error
    }

    console.log('✅ Site settings updated successfully:', data)

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (e: any) {
    console.error('admin-site-settings-upsert error:', e)
    return new Response(JSON.stringify({ error: e.message || 'Unknown error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})