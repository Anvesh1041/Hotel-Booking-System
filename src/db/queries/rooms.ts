import { db } from '@/db'
import { rooms } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getAllRooms() {
    return await db.select().from(rooms)
}

export async function getRoomById(id: number) {
    return await db.select().from(rooms).where(eq(rooms.id, id))
}

export async function createRoom(room_no: number,type: string, price: number, capacity: number, description: string) {
    return await db.insert(rooms).values({
        roomNo: room_no,
        type,
        price,
        capacity,
        description
    })
}

export async function updateRoomById(
    room_id: number,
    updates: Partial<typeof rooms.$inferInsert>
) {
    return await db.update(rooms).set(updates).where(eq(rooms.id, room_id))
}

export async function deleteRoomById(room_id: number) {
    return await db.delete(rooms).where(eq(rooms.id, room_id))
}