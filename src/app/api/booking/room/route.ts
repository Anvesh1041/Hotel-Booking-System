import { NextResponse } from "next/server";
import { getBookingByRoomId } from "@/db/queries/booking";
import { isPositiveInteger } from "@/utils/validators";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const room_id = Number(searchParams.get("room_id"));
        if (!room_id) {
            return NextResponse.json(
                { success: false, message: "room_id required" },
                { status: 400 }
            );
        }
        if (!isPositiveInteger(room_id).success) {
            return NextResponse.json(
                isPositiveInteger(room_id),
                { status: 400 }
            )
        }

        const bookings = await getBookingByRoomId(room_id);

        return NextResponse.json({ success: true, bookings });
    } catch (err) {
        return NextResponse.json(
            { success: false, error: err },
            { status: 500 }
        );
    }
}