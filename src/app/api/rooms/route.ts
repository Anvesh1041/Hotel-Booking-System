import { NextResponse } from 'next/server';
import { createRoom, getAllRooms } from '@/db/queries/rooms';

export async function GET() {
    try {
        const data = await getAllRooms();

        return NextResponse.json({ success: true, data });
    } catch (err) {
        return NextResponse.json(
            { success: false, error: err },
            { status: 500 }
        );

    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, price, capacity } = body;

        if (!name || !price || !capacity) {
            return NextResponse.json(
                { success: false, message: "Missing fields" },
                { status: 400 }
            );
        }

        await createRoom(name, price, capacity);

        return NextResponse.json({ success: true });
        
    } catch (err) {
        return NextResponse.json(
            { success: false, error: err },
            { status: 500 }
        );

    }
}