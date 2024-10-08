CREATE TABLE `Session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Site` (
	`id` text PRIMARY KEY DEFAULT 'lmqvwqn1yrn2ail' NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`subdomain` text NOT NULL,
	`customDomain` text,
	`createdAt` integer,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Site_subdomain_unique` ON `Site` (`subdomain`);--> statement-breakpoint
CREATE UNIQUE INDEX `Site_customDomain_unique` ON `Site` (`customDomain`);--> statement-breakpoint
CREATE TABLE `User` (
	`id` text PRIMARY KEY DEFAULT '76zod1lcc8ab5ls' NOT NULL,
	`email` text,
	`hashed_password` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `User_email_unique` ON `User` (`email`);