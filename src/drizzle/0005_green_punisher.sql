CREATE TABLE "room_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_id" integer NOT NULL,
	"img_url" text NOT NULL,
	"public_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "room_images" ADD CONSTRAINT "room_images_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;