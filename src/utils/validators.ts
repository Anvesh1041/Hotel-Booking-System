export function isPositiveInteger(value: number) {
    return (Number.isInteger(value) && value > 0)
        ? { success: true, message: "" }
        : { success: false, message: "Value must be a positive integer" }
}

export function isNonEmptyString(value: string) {
    return (typeof value === 'string' && value.trim().length > 0)
        ? { success: true, message: "" }
        : { success: false, message: "Value must be a non-empty string" }
}

export function isValidEmail(value: unknown) {
    if (typeof value !== "string" || value.trim().length === 0) {
        return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
export function isValidPassword(value: unknown) {
    if (typeof value !== "string") {
        return false;
    }

    return value.length >= 8;
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

type BookingValidationResult =
    | {
        success: true;
        data: {
            user_id: number;
            room_id: number;
            checkInDate: Date;
            checkOutDate: Date;
        };
    }
    | {
        success: false;
        message: string;
    };

type UserValidationResult =
    | {
        success: true;
        data: {
            name: string;
            email: string;
            password: string;
        };
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

export function isValidBooking(data: any): BookingValidationResult {
    if (
        !data ||
        typeof data !== "object" ||
        !isPositiveInteger(data.user_id).success ||
        !isPositiveInteger(data.room_id).success ||
        typeof data.check_in !== "string" ||
        typeof data.check_out !== "string"
    ) {
        return {
            success: false,
            message: "Invalid booking data"
        };
    }

    const checkInDate = new Date(data.check_in);
    const checkOutDate = new Date(data.check_out);

    if (
        Number.isNaN(checkInDate.getTime()) ||
        Number.isNaN(checkOutDate.getTime())
    ) {
        return {
            success: false,
            message: "Invalid date format"
        };
    }

    if (checkInDate >= checkOutDate) {
        return {
            success: false,
            message: "Invalid date selection"
        };
    }

    return {
        success: true,
        data: {
            user_id: data.user_id,
            room_id: data.room_id,
            checkInDate,
            checkOutDate
        }
    };
}

export function isValidUser(data: any): UserValidationResult{
    if (
        !data||
        typeof(data)!== "object"||
        !isNonEmptyString(data.name).success||
        !isValidEmail(data.email)||
        !isValidPassword(data.password)
    ){
        return {
            success: false,
            message: "Invalid user data"
        }
    }
    return {
        success: true,
        data: {
            name: data.name.trim(),
            email: data.email.trim().toLowerCase(),
            password: data.password
        }
    }
}