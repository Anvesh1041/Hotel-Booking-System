import { NextResponse } from "next/server";
import { availableRooms } from "@/services/booking.service";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const check_in = searchParams.get("check_in");
    const check_out = searchParams.get("check_out");

    if (!check_in || !check_out) {
        return NextResponse.json(
            { success: false, message: "Missing date parameters" },
            { status: 400 }
        );
    }

    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);

    if (checkInDate >= checkOutDate) {
        return NextResponse.json(
            { success: false, message: "Invalid date selection" },
            { status: 400 }
        );
    }

    const availableRoomsList = await availableRooms(checkInDate, checkOutDate);

    return NextResponse.json({ success: true, rooms: availableRoomsList });
}