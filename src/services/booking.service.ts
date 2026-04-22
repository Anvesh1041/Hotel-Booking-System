import { getBookingByRoomId, getAllBookings, book } from '@/db/queries/booking'
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


export async function availableRooms(check_in: Date, check_out: Date) {
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

    const result = [];


    for (const room of rooms) {
        const roomBookings = bookingMap.get(room.id) || [];

        if (isRoomAvailable(roomBookings, check_in, check_out)) {
            result.push(room);
        }
    }


    return result;
}

export async function checkAvailability(roomId: number, check_in: Date, check_out: Date) {
  const bookings = await getBookingByRoomId(roomId);

  return isRoomAvailable(bookings, check_in, check_out);
}

export async function createBooking(data:any) {
  const { user_id, room_id, checkInDate, checkOutDate } = data;

  if (checkInDate >= checkOutDate) {
    throw new Error("Invalid date selection");
  }

  const available = await checkAvailability(room_id, checkInDate, checkOutDate);

  if (!available) {
    throw new Error("Room not available");
  }

  return await book(user_id, room_id, checkInDate, checkOutDate);
}