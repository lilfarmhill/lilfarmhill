// app/api/availability/route.ts
import { NextResponse } from 'next/server';
import { format, parseISO, eachDayOfInterval } from 'date-fns';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');

  if (!startDateParam || !endDateParam) {
    return NextResponse.json({ error: 'Missing startDate or endDate' }, { status: 400 });
  }

  try {
    const start = parseISO(startDateParam);
    const end = parseISO(endDateParam);

    console.log(`API: Received request for availability from ${format(start, 'yyyy-MM-dd')} to ${format(end, 'yyyy-MM-dd')}`);

    // *** TODO: Replace with actual database query ***
    // Query your PostgreSQL database here based on the date range.
    // Check which slots are booked and calculate remaining availability.
    const days = eachDayOfInterval({ start, end });
    const mockAvailability = days.map(day => ({
      date: format(day, 'yyyy-MM-dd'),
      availableSlots: Math.floor(Math.random() * 5), // Random slots 0-4
      totalSlots: 5,
    })).filter(slot => slot.availableSlots > 0);

    return NextResponse.json(mockAvailability);

  } catch (error) {
    console.error("API Error fetching availability:", error);
    return NextResponse.json({ error: 'Failed to process dates or fetch availability' }, { status: 500 });
  }
}