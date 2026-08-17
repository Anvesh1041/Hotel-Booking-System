import { pgTable, serial, text, integer, date } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
});

export const rooms = pgTable("rooms",{
  id: serial("id").primaryKey(),
  roomNo: integer("room_no").notNull().unique(),
  type: text("type").notNull(),
  price: integer("price").notNull(),
  capacity: integer("capacity").notNull(),
  description: text("description").notNull()
})

export const roomImages = pgTable("room_images", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull().references(()=>rooms.id),
  imgUrl: text("img_url").notNull(),
  publicId: text("public_id").notNull()
})

export const booking = pgTable("bookings",{
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(()=>users.id),
  roomId: integer("room_id").notNull().references(()=>rooms.id),
  checkIn: date("check_in").notNull(),
  checkOut: date("check_out").notNull(),

})