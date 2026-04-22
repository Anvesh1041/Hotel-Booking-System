import { db } from '@/db'
import { booking } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getBookingByUserId(user_id:number){

    return await db.select().from(booking).where(eq(booking.userId, user_id))
}

export async function book(user_id:number, room_id:number, check_in:Date, check_out:Date){
    return await db.insert(booking).values({
        userId: user_id,
        roomId: room_id,
        checkIn: check_in.toISOString().split("T")[0],
        checkOut: check_out.toISOString().split("T")[0],
    })
}

export async function getAllBookings(){
    return await db.select().from(booking)
}

export async function getBookingByRoomId(room_id:number){
    return await db.select().from(booking).where(eq(booking.roomId,room_id))
}