import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getAllUsers() {
    return await db.select({
        name: users.name, 
        email: users.email, 
        role:users.role, 
        emailVerified: users.emailVerified
    }).from(users)
}

export async function getUserByEmail(email:string){
    return await db.select().from(users).where(eq(users.email,email))
}

export async function getUserById(user_id:number){
    return await db.select({
        name: users.name,
        email: users.email,
        role:users.role,
        emailVerified: users.emailVerified
    }).from(users).where(eq(users.id, user_id))
}

export async function createUser(name: string, email: string, passwordHash: string) {
    return await db.insert(users).values({
        name,
        email,
        passwordHash,
        role: "user",
        emailVerified: false
    }).returning()
}

export async function deleteUserById(user_id: number) {
    return await db.delete(users).where(eq(users.id, user_id))
}