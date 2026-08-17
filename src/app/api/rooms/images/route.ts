import { NextResponse } from "next/server";
import { isPositiveInteger, isValidImage } from '@/utils/validators';
import { getRoomById } from "@/db/queries/rooms";
import { getRoomImages, getRoomImageById, addRoomImages, deleteRoomImageById } from "@/db/queries/room_img"
import { uploadImage, deleteImage, deleteImages } from "@/services/image.service"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const room_id = Number(searchParams.get("room_id"))
        const intValidation = isPositiveInteger(room_id)
        if (!intValidation.success) {
            return NextResponse.json(intValidation, { status: 400 })
        }
        const rooms = await getRoomById(room_id)
        if (rooms.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Room not found"
                },
                { status: 404 }
            )
        }
        const images = await getRoomImages(room_id)
        return NextResponse.json(
            {
                success: true,
                data: images
            },
            { status: 200 }
        )
    } catch (e) {
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error"
            },
            { status: 500 }
        )
    }
}
export async function POST(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const room_id = Number(searchParams.get("room_id"))
        if (!isPositiveInteger(room_id).success) {
            return NextResponse.json(
                isPositiveInteger(room_id),
                { status: 400 }
            )
        }
        const rooms = await getRoomById(room_id)
        if (rooms.length == 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Room not found"
                },
                { status: 404 }
            )
        }
        const formData = await req.formData()
        const files = formData.getAll("files")
        const roomImages = await getRoomImages(room_id)
        const existingImages = roomImages.length
        const images: {
            imgUrl: string;
            publicId: string;
        }[] = []
        const validFiles: File[] = [];
        if (existingImages + files.length > 4) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Cannot upload more than 4 images for a room"
                },
                { status: 400 }
            )
        }
        for (const file of files) {

            const validation = isValidImage(file);

            if (!validation.success) {
                return NextResponse.json(validation, { status: 400 });
            }
            validFiles.push(validation.file)
        }
        try {
            for (const file of validFiles) {
                const image = await uploadImage(file);
                images.push(image)
                // throw new Error("TEST CLOUDINARY FAILURE");
            }

        } catch (err) {
            await deleteImages(images)
            return NextResponse.json(
                {
                    success: false,
                    message: "Image upload failed"
                },
                { status: 500 }
            );
        }
        try {
            await addRoomImages(room_id, images);
            
        } catch (err) {
            await deleteImages(images)
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to save images"
                },
                { status: 500 }
            );
        }
        return NextResponse.json(
            {
                success: true,
                message: "Images uploaded successfully",
                data: images
            },
            { status: 200 }
        )
    } catch (err) {
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error"
            },
            { status: 500 }
        )
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = Number(searchParams.get("id"))
        const intValidation = isPositiveInteger(id)
        if (!intValidation.success) {
            return NextResponse.json(intValidation, { status: 400 })
        }
        const image = await getRoomImageById(id)
        if (image.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Image not found"
                },
                { status: 404 }
            )
        }
        const publicId = image[0].publicId
        await deleteImage(publicId)
        await deleteRoomImageById(id)
        return NextResponse.json(
            {
                success: true,
                message: "Image deleted successfully",
            },
            { status: 200 }
        )
    } catch (e) {
        // console.error(e)
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error"
            },
            { status: 500 }
        )
    }

}