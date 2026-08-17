import cloudinary from "@/lib/cloudinary";
export async function uploadImage(file: File): Promise<{
    imgUrl: string;
    publicId: string;
}> {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const result = await new Promise<{
        secure_url: string;
        public_id: string;
    }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "hotel-booking" },
            (error, result) => {
                if (error) {
                    reject(error)
                }
                else if (!result) {
                    reject(new Error("Cloudinary upload failed"));
                }
                else {
                    resolve(result)
                }
            }
        )
        uploadStream.end(buffer);
    })
    return {
        imgUrl: result.secure_url,
        publicId: result.public_id
    }
}

export async function deleteImage(publicId: string): Promise<void> {
    await new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                reject(error)
            }
            else {
                resolve(result)
            }
        })
    })
}
export async function deleteImages(
    images: {
        imgUrl: string;
        publicId: string;
    }[]
) {
    for (const image of images) {
        await deleteImage(image.publicId);
    }
}