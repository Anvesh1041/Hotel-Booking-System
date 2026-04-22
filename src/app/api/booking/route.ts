import { NextResponse } from 'next/server';
import { getBookingByUserId } from '@/db/queries/booking';
import { createBooking } from '@/services/booking.service';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user_id = Number(searchParams.get("user_id"));

  if (!user_id) {
    return NextResponse.json(
      { success: false, message: "user_id required" },
      { status: 400 }
    );
  }

  const bookings = await getBookingByUserId(user_id);

  if (!bookings || bookings.length === 0) {
    return NextResponse.json(
      { success: false, message: "No bookings found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, bookings });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await createBooking({...body, checkInDate: new Date(body.check_in), checkOutDate: new Date(body.check_out)});

    return NextResponse.json({ success: true, data: result });

  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e.message },
      { status: 400 }
    );
  }
}