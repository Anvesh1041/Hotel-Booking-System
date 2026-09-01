import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getAllUsers() {
    return await db.select().from(users)
}

export async function getUserById(user_id:number){
    return await db.select().from(users).where(eq(users.id, user_id))
}
export async function createUser(name: string, email: string) {
    return await db.insert(users).values({
        name,
        email,
    })
}

export async function deleteUserById(user_id: number) {
    return await db.delete(users).where(eq(users.id, user_id))
}