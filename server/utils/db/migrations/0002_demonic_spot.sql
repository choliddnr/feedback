PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_products_to_responses` (
	`product_id` integer NOT NULL,
	`response_id` integer NOT NULL,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')),
	`updated_at` integer DEFAULT (strftime('%s','now') ),
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`response_id`) REFERENCES `respondents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_products_to_responses`("product_id", "response_id", "id", "created_at", "updated_at") SELECT "product_id", "response_id", "id", "created_at", "updated_at" FROM `products_to_responses`;--> statement-breakpoint
DROP TABLE `products_to_responses`;--> statement-breakpoint
ALTER TABLE `__new_products_to_responses` RENAME TO `products_to_responses`;--> statement-breakpoint
PRAGMA foreign_keys=ON;