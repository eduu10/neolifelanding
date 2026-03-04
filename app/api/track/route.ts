import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { calculateLeadScore, classifyLead, countFilledFields } from '@/lib/lead-scoring';
import type { TrackingPayload } from '@/lib/types';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json(null, { headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  try {
    const payload: TrackingPayload = await request.json();
    const supabase = createAdminClient();

    // Upsert visitor
    const { data: visitor } = await supabase
      .from('visitors')
      .upsert({
        fingerprint: payload.fingerprint,
        last_seen: new Date().toISOString(),
        device_type: payload.device?.device_type,
        browser: payload.device?.browser,
        os: payload.device?.os,
        screen_width: payload.device?.screen_width,
        screen_height: payload.device?.screen_height,
        language: payload.device?.language,
        timezone: payload.device?.timezone,
        utm_source: payload.utm?.utm_source,
        utm_medium: payload.utm?.utm_medium,
        utm_campaign: payload.utm?.utm_campaign,
        utm_term: payload.utm?.utm_term,
        utm_content: payload.utm?.utm_content,
        referrer: payload.referrer,
      }, { onConflict: 'fingerprint' })
      .select('id')
      .single();

    if (!visitor) {
      return NextResponse.json({ ok: false }, { status: 500, headers: CORS_HEADERS });
    }

    // Increment visit count on pageview
    if (payload.event_type === 'pageview') {
      await supabase
        .from('visitors')
        .update({ last_seen: new Date().toISOString() })
        .eq('fingerprint', payload.fingerprint);
    }

    // Upsert session
    if (payload.event_type === 'pageview') {
      await supabase
        .from('sessions')
        .upsert({
          session_id: payload.session_id,
          visitor_id: visitor.id,
          page_url: payload.page_url,
          entry_page: payload.page_url,
          utm_source: payload.utm?.utm_source,
          utm_medium: payload.utm?.utm_medium,
          utm_campaign: payload.utm?.utm_campaign,
          referrer: payload.referrer,
        }, { onConflict: 'session_id' });
    }

    // Update session duration on heartbeat/page_hide
    if (payload.event_type === 'heartbeat' || payload.event_type === 'page_hide') {
      const timeOnPage = (payload.event_data?.time_on_page as number) || 0;
      await supabase
        .from('sessions')
        .update({
          duration_s: timeOnPage,
          is_bounce: false,
          ended_at: payload.event_type === 'page_hide' ? new Date().toISOString() : undefined,
          exit_page: payload.page_url,
        })
        .eq('session_id', payload.session_id);
    }

    // Insert event
    await supabase.from('events').insert({
      visitor_id: visitor.id,
      session_id: payload.session_id,
      event_type: payload.event_type,
      event_data: payload.event_data,
      page_url: payload.page_url,
      timestamp: payload.timestamp,
    });

    // Handle ghost lead
    if (payload.event_type === 'ghost_lead') {
      const partialData = (payload.event_data?.partial_data || {}) as Record<string, string>;
      const fieldsCount = countFilledFields(partialData);
      const hasPhone = !!(partialData.phone && partialData.phone.length > 0);
      const status = classifyLead(fieldsCount, hasPhone);
      const score = calculateLeadScore({
        name: partialData.name,
        email: partialData.email,
        phone: partialData.phone,
        location: partialData.location,
        goal: partialData.goal,
        timeframe: partialData.timeframe,
        isGhost: true,
      });

      // Check if lead exists for this visitor
      const { data: existingLead } = await supabase
        .from('leads')
        .select('id')
        .eq('visitor_id', visitor.id)
        .single();

      if (existingLead) {
        await supabase
          .from('leads')
          .update({
            status,
            score,
            name: partialData.name || null,
            email: partialData.email || null,
            phone: partialData.phone || null,
            location: partialData.location || null,
            goal: partialData.goal || null,
            timeframe: partialData.timeframe || null,
            fields_filled: fieldsCount,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingLead.id);

        // Add timeline entry
        await supabase.from('lead_timeline').insert({
          lead_id: existingLead.id,
          event_type: 'field_filled',
          event_data: { field: payload.event_data?.field, fields_filled: fieldsCount },
        });
      } else {
        const { data: newLead } = await supabase
          .from('leads')
          .insert({
            visitor_id: visitor.id,
            status,
            score,
            name: partialData.name || null,
            email: partialData.email || null,
            phone: partialData.phone || null,
            location: partialData.location || null,
            goal: partialData.goal || null,
            timeframe: partialData.timeframe || null,
            fields_filled: fieldsCount,
            source: payload.utm?.utm_source || 'organic',
            utm_source: payload.utm?.utm_source,
            utm_medium: payload.utm?.utm_medium,
            utm_campaign: payload.utm?.utm_campaign,
            is_ghost: true,
          })
          .select('id')
          .single();

        if (newLead) {
          await supabase.from('lead_timeline').insert({
            lead_id: newLead.id,
            event_type: 'field_filled',
            event_data: { field: payload.event_data?.field, fields_filled: fieldsCount },
          });
        }
      }
    }

    // Handle form submit
    if (payload.event_type === 'form_submit') {
      const formData = (payload.event_data?.form_data || {}) as Record<string, string>;
      const fieldsCount = countFilledFields(formData);
      const score = calculateLeadScore({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        goal: formData.goal,
        timeframe: formData.timeframe,
        isGhost: false,
      });

      const { data: existingLead } = await supabase
        .from('leads')
        .select('id')
        .eq('visitor_id', visitor.id)
        .single();

      if (existingLead) {
        await supabase
          .from('leads')
          .update({
            status: 'converted',
            score,
            name: formData.name || null,
            email: formData.email || null,
            phone: formData.phone || null,
            location: formData.location || null,
            goal: formData.goal || null,
            timeframe: formData.timeframe || null,
            fields_filled: fieldsCount,
            is_ghost: false,
            converted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingLead.id);

        await supabase.from('lead_timeline').insert({
          lead_id: existingLead.id,
          event_type: 'form_submitted',
          event_data: formData,
        });
      } else {
        const { data: newLead } = await supabase
          .from('leads')
          .insert({
            visitor_id: visitor.id,
            status: 'converted',
            score,
            name: formData.name || null,
            email: formData.email || null,
            phone: formData.phone || null,
            location: formData.location || null,
            goal: formData.goal || null,
            timeframe: formData.timeframe || null,
            fields_filled: fieldsCount,
            source: payload.utm?.utm_source || 'organic',
            utm_source: payload.utm?.utm_source,
            utm_medium: payload.utm?.utm_medium,
            utm_campaign: payload.utm?.utm_campaign,
            is_ghost: false,
            converted_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        if (newLead) {
          await supabase.from('lead_timeline').insert({
            lead_id: newLead.id,
            event_type: 'form_submitted',
            event_data: formData,
          });
        }
      }
    }

    return NextResponse.json({ ok: true }, { headers: CORS_HEADERS });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500, headers: CORS_HEADERS });
  }
}
