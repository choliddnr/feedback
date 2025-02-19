CREATE TABLE `merchant_categories` (
	`title` text NOT NULL,
	`description` text,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated` integer DEFAULT (CURRENT_TIMESTAMP),
	`created` integer DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `merchants` (
	`title` text NOT NULL,
	`description` text,
	`category` integer,
	`owner` integer,
	`greeting` text NOT NULL,
	`primery_color` text DEFAULT 'fuel-yellow',
	`image_background` text,
	`logo` text,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated` integer DEFAULT (CURRENT_TIMESTAMP),
	`created` integer DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`category`) REFERENCES `merchant_categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`owner`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`title` text NOT NULL,
	`description` text NOT NULL,
	`images` text DEFAULT '[]',
	`merchant` integer,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated` integer DEFAULT (CURRENT_TIMESTAMP),
	`created` integer DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`merchant`) REFERENCES `merchants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `question_types` (
	`title` text NOT NULL,
	`description` text,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated` integer DEFAULT (CURRENT_TIMESTAMP),
	`created` integer DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`question` text NOT NULL,
	`type` integer,
	`product` integer,
	`answer_options` text DEFAULT '[]',
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated` integer DEFAULT (CURRENT_TIMESTAMP),
	`created` integer DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`type`) REFERENCES `question_types`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `respondents` (
	`name` text NOT NULL,
	`gender` integer NOT NULL,
	`age` integer NOT NULL,
	`whatsapp` integer,
	`location` text,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated` integer DEFAULT (CURRENT_TIMESTAMP),
	`created` integer DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `response_answers` (
	`response` integer,
	`question` integer,
	`answer` text NOT NULL,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated` integer DEFAULT (CURRENT_TIMESTAMP),
	`created` integer DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`response`) REFERENCES `responses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`question`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `responses` (
	`respondent` integer,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated` integer DEFAULT (CURRENT_TIMESTAMP),
	`created` integer DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`respondent`) REFERENCES `respondents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`name` text NOT NULL,
	`email` text NOT NULL,
	`username` text NOT NULL,
	`picture` text,
	`default_merchant` integer,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated` integer DEFAULT (CURRENT_TIMESTAMP),
	`created` integer DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`default_merchant`) REFERENCES `merchants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);