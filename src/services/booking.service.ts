import { getAllBookings, createBookingTransaction } from '@/db/queries/booking'
import { getAllRooms } from '@/db/queries/rooms'

function isRoomAvailable(roomBookings: any[], check_in: Date, check_out: Date) {
    for (const b of roomBookings) {
        const existingCheckIn = new Date(b.checkIn);
        const existingCheckOut = new Date(b.checkOut);

        if (existingCheckIn < check_out && existingCheckOut > check_in) {
            return false;
        }
    }
    return true;
}

export async function availableRooms(check_in: Date, check_out: Date, room_type?: string, capacity?: number, max_price?: number) {
    const rooms = await getAllRooms();
    const bookings = await getAllBookings();

    // group bookings by roomId
    const bookingMap = new Map<number, any[]>();

    for (const b of bookings) {
        if (!bookingMap.has(b.roomId)) {
            bookingMap.set(b.roomId, []);
        }
        bookingMap.get(b.roomId)!.push(b);
    }

    let result = [];


    for (const room of rooms) {
        const roomBookings = bookingMap.get(room.id) || [];

        if (isRoomAvailable(roomBookings, check_in, check_out)) {
            result.push(room);
        }
    }
    // console.log(capacity, max_price)
    if (capacity) {
        console.log("capacity:", capacity);

        result = result.filter(room => room.capacity >= Number(capacity));
    }

    if (max_price) {
        result = result.filter(room => room.price <= Number(max_price));
    }
    console.log("Requested room_type:", room_type);
    console.log("Available rooms before type filter:", result);

    for (const room of result) {
        console.log("DB type:", room.type);
    }
    if (room_type) {
        result = result.filter(room => room.type === String(room_type));
    }

    return result;
}// http://localhost:3000/api/available?check_in=2026-04-30&check_out=2026-05-05&capacity=2&max_price=2000

// export async function checkAvailability(roomId: number, check_in: Date, check_out: Date) {
//     const bookings = await getBookingByRoomId(roomId);

//     return isRoomAvailable(bookings, check_in, check_out);
// }

export async function createBooking(data: {
    user_id: number;
    room_id: number;
    checkInDate: Date;
    checkOutDate: Date;
}) {
    const { user_id, room_id, checkInDate, checkOutDate } = data;

    return await createBookingTransaction(user_id, room_id, checkInDate, checkOutDate);
}