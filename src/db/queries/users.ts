import { db } from '@/db'
import { users } from '@/db/schema'

export async function getAllUsers() {
    return await db.select().from(users)
}

export async function createUser(name: string, email: string) {
    return await db.insert(users).values({
        name,
        email,
    })
}