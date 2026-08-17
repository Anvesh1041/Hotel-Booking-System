export function isPositiveInteger(value: number) {
    return ( Number.isInteger(value) && value > 0)
    ? {success:true, message: ""} 
    : {success:false, message: "Value must be a positive integer"}
}

export function isNonEmptyString(value: string) {
    return (typeof value === 'string' && value.trim().length > 0)
    ? {success:true, message: ""} 
    : {success:false, message: "Value must be a non-empty string"}
}

type ImageValidationResult =
    | {
        success: true;
        file: File;
    }
    | {
        success: false;
        message: string;
    };
export function isValidImage(file: FormDataEntryValue | null): ImageValidationResult {
    if (!(file instanceof File)) {
        return {
            success: false,
            message: "Valid image file is required"
        };
    }

    if (!file.type.startsWith("image/")) {
        return {
            success: false,
            message: "Only image files are allowed"
        };
    }

    return {
        success: true,
        file: file
    };
}