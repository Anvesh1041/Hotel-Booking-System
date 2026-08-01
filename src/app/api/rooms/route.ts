import { NextResponse } from 'next/server';
import { createRoom, getAllRooms, deleteRoomById } from '@/db/queries/rooms';

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
        const { room_no, type, price, capacity, description } = body;

        if (!room_no || !type || !price || !capacity || !description) {
            return NextResponse.json(
                { success: false, message: "Missing fields" },
                { status: 400 }
            );
        }

        await createRoom(room_no, type, price, capacity, description);

        return NextResponse.json({ success: true });
        
    } catch (err) {
        return NextResponse.json(
            { success: false, error: err },
            { status: 500 }
        );

    }
}

export async function DELETE( req: Request) {
    try{
        const { searchParams } = new URL(req.url)
        const room_id = Number(searchParams.get("room_id"))
        if (!room_id){
            return NextResponse.json(
                {success: false, message: "room_id required"},
                {status: 400}
            )
        }
        const result = await deleteRoomById(room_id)
        return NextResponse.json({success:true, data: result})
    } catch (err) {
        return NextResponse.json(
            {success:false, error: err},
            {status: 500}
        )
    }
}