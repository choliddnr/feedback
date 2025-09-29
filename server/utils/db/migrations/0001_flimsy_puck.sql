CREATE TABLE `analysis` (
	`product` integer,
	`analysis` text NOT NULL,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')),
	`updated_at` integer DEFAULT (strftime('%s','now') ),
	FOREIGN KEY (`product`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_merchants` (
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`category` integer,
	`owner` integer,
	`greeting` text NOT NULL,
	`primery_color` text,
	`image_background` text,
	`logo` text NOT NULL,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')),
	`updated_at` integer DEFAULT (strftime('%s','now') ),
	FOREIGN KEY (`category`) REFERENCES `merchant_categories`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`owner`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_merchants`("title", "slug", "description", "category", "owner", "greeting", "primery_color", "image_background", "logo", "id", "created_at", "updated_at") SELECT "title", "slug", "description", "category", "owner", "greeting", "primery_color", "image_background", "logo", "id", "created_at", "updated_at" FROM `merchants`;--> statement-breakpoint
DROP TABLE `merchants`;--> statement-breakpoint
ALTER TABLE `__new_merchants` RENAME TO `merchants`;--> statement-breakpoint
PRAGMA foreign_keys=ON;