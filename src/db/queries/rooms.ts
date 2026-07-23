import { db } from '@/db'
import { rooms } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getAllRooms() {
    return await db.select().from(rooms)
}

export async function getRoomById(id: number) {
    return await db.select().from(rooms).where(eq(rooms.id, id))
}

export async function createRoom(name: string, price: number, capacity: number) {
    return await db.insert(rooms).values({
        name,
        price,
        capacity,
    })
}

export async function deleteRoomById(room_id: number) {
    return await db.delete(rooms).where(eq(rooms.id, room_id))
}