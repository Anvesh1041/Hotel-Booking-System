import { NextResponse } from 'next/server';
import { createRoom, getAllRooms, getRoomById, deleteRoomById, updateRoomById } from '@/db/queries/rooms';
import { roomValidators } from '@/utils/validation/room.validator';
import { validatePatch} from '@/utils/patch_validators'

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

export async function PATCH(req: Request){
    const { searchParams } = new URL(req.url)
    const room_id = Number(searchParams.get("room_id"))
    if (!room_id){
        return NextResponse.json(
            {success: false, message: "room_id required"},
            {status: 400}
        )
    }
    try{
        const room = await getRoomById(room_id)
        if (room.length === 0){
            return NextResponse.json(
                {success: false, message: "Room not found"},
                {status: 404}
            )
        }
        const body = await req.json()
        if (Object.keys(body).length === 0){
            return NextResponse.json(
                {success: false, message: "Missing fields"},
                {status: 400}
            )
        }
        const isValid = validatePatch(body, roomValidators);
        if (!isValid.success) {
            return NextResponse.json(
                isValid,
                {status: 400}
            )
        }
        const result = await updateRoomById(room_id, body)
        return NextResponse.json({success: true, data: result})
    }catch (err){
        return NextResponse.json(
            {success: false, error: "Something went wrong"},
            {status: 500}
        )
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