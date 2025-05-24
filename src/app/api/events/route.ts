import { query } from "@/lib/db";
import { EventWithRegistrationCount } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const location = searchParams.get('location');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const offset = (page - 1) * limit;
    
    // First, get total count for pagination
    let countSql = `
      SELECT COUNT(DISTINCT e.id) as total
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE 1=1
    `;
    
    let sql = `
      SELECT 
        e.*,
        COUNT(r.id) as registration_count
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    
    if (search) {
      sql += ` AND (e.title LIKE ? OR e.description LIKE ?)`;
      countSql += ` AND (e.title LIKE ? OR e.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (location) {
      sql += ` AND e.location = ?`;
      countSql += ` AND e.location = ?`;
      params.push(location);
    }
    
    if (startDate) {
      sql += ` AND e.date >= ?`;
      countSql += ` AND e.date >= ?`;
      params.push(startDate);
    }
    
    if (endDate) {
      sql += ` AND e.date <= ?`;
      countSql += ` AND e.date <= ?`;
      params.push(endDate);
    }
    
    sql += ` GROUP BY e.id ORDER BY e.date ASC LIMIT ? OFFSET ?`;
    
    const events = query<EventWithRegistrationCount[]>(sql, [...params, limit, offset]);
    const totalCount = query<{ total: number }[]>(countSql, params)[0].total;
      
    if (!events) {
      console.error('No events returned from database');
      return NextResponse.json(
        { error: 'No events found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      events,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error in events API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 