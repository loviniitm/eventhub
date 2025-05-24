import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { EventWithRegistrationCount, DailyStats } from '@/lib/types';

export async function GET() {
  try {
    // Get popular events (top 5 by registration count)
    const popularEventsSql = `
      SELECT 
        e.*,
        COUNT(r.id) as registration_count
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      GROUP BY e.id
      ORDER BY registration_count DESC
      LIMIT 5
    `;
    
    const popularEvents = query<EventWithRegistrationCount[]>(popularEventsSql);

    // Get daily stats for the last 7 days
    const dailyStatsSql = `
      SELECT 
        DATE(r.created_at) as date,
        COUNT(DISTINCT r.id) as total_registrations,
        COUNT(DISTINCT e.id) as total_events
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      WHERE r.created_at >= date('now', '-7 days')
      GROUP BY DATE(r.created_at)
      ORDER BY date DESC
    `;
    
    const dailyStats = query<DailyStats[]>(dailyStatsSql);

    return NextResponse.json({
      popularEvents,
      dailyStats
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
} 