import { pgTable, serial, text, integer, date } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
});

export const rooms = pgTable("rooms",{
  id: serial("id").primaryKey(),
  name: text("name"),
  price: integer("price"),
  capacity: integer("capacity"),
})

export const booking = pgTable("bookings",{
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(()=>users.id),
  roomId: integer("room_id").notNull().references(()=>rooms.id),
  checkIn: date("check_in").notNull(),
  checkOut: date("check_out").notNull(),

})