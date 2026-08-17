import {db} from "@/db"
import {roomImages} from "@/db/schema"
import {eq} from "drizzle-orm"

export async function addRoomImage(roomId: number, imgUrl: string, publicId: string){
    return await db.insert(roomImages).values({
        roomId,
        imgUrl,
        publicId
    })
}

export async function addRoomImages(
    roomId: number, 
    images:{
        imgUrl:string; 
        publicId:string
    }[]
){
    await db.transaction(async (tx)=>{
        await tx.insert(roomImages).values(
            images.map((image)=>({
                roomId,
                imgUrl: image.imgUrl,
                publicId: image.publicId
            }))
        )
        // throw new Error("TEST DATABASE FAILURE");        
    })
}

export async function getRoomImages(roomId: number){
    return await db.select().from(roomImages).where(eq(roomImages.roomId,roomId))
}
export async function getRoomImageById(id: number){
    return await db.select().from(roomImages).where(eq(roomImages.id,id))
}
export async function deleteRoomImageById(id: number){
    return await db.delete(roomImages).where(eq(roomImages.id,id))
}