import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { EventWithRegistrationCount } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sql = `
      SELECT 
        e.*,
        COUNT(r.id) as registration_count
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE e.id = ?
      GROUP BY e.id
    `;
    
    const event = queryOne<EventWithRegistrationCount>(sql, [params.id]);
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
} 