import { NextResponse } from 'next/server';
import { execute, queryOne } from '@/lib/db';
import { Event } from '@/lib/types';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, email } = await request.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = queryOne<Event>('SELECT * FROM events WHERE id = ?', [params.id]);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if already registered
    const existingRegistration = queryOne(
      'SELECT * FROM registrations WHERE event_id = ? AND email = ?',
      [params.id, email]
    );

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Already registered for this event' },
        { status: 400 }
      );
    }

    // Create registration
    const result = execute(
      'INSERT INTO registrations (event_id, name, email) VALUES (?, ?, ?)',
      [params.id, name, email]
    );

    return NextResponse.json({
      message: 'Registration successful',
      registrationId: result.lastInsertId
    }, { status: 201 });
  } catch (error) {
    console.error('Error registering for event:', error);
    return NextResponse.json(
      { error: 'Failed to register for event' },
      { status: 500 }
    );
  }
} 