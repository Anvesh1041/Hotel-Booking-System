ALTER TABLE "rooms" RENAME COLUMN "name" TO "type";--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "capacity" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "room_no" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_room_no_unique" UNIQUE("room_no");