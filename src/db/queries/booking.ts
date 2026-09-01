import { db } from '@/db'
import { booking, rooms } from '@/db/schema'
import { AppError } from '@/utils/errors'
import { eq } from 'drizzle-orm'

export async function getBookingByUserId(user_id:number){

    return await db.select().from(booking).where(eq(booking.userId, user_id))
}

export async function createBookingTransaction(
    userId:number,
    roomId:number,
    checkInDate: Date,
    checkOutDate: Date
){
    return await db.transaction(async (tx)=>{
        const room = await tx
        .select()
        .from(rooms)
        .where(eq(rooms.id, roomId))
        .for("update");

        if (room.length===0) {
            throw new AppError("Room not found",404)
        }
        
        const bookings = await tx
        .select()
        .from(booking)
        .where(eq(booking.roomId,roomId));

        for(const b of bookings){
            const existingCheckIn = new Date(b.checkIn);
            const existingCheckOut = new Date(b.checkOut);

            if (existingCheckIn<checkOutDate && existingCheckOut>checkInDate){
                throw new AppError("Room not available",409)
            }
        }
        return await tx.insert(booking).values({
            userId,
            roomId,
            checkIn: checkInDate.toISOString().split("T")[0],
            checkOut: checkOutDate.toISOString().split("T")[0]
        }).returning()
    })
}

export async function getAllBookings(){
    return await db.select().from(booking)
}

export async function getBookingByRoomId(room_id:number){
    return await db.select().from(booking).where(eq(booking.roomId,room_id))
}

export async function deleteBookingById(booking_id:number){
    return await db.delete(booking).where(eq(booking.id, booking_id))
}