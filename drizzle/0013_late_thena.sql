CREATE TABLE `price_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sku` varchar(64) NOT NULL,
	`price` varchar(64) NOT NULL,
	`priceChangePct` int,
	`status` enum('verified','discontinued','unavailable','unknown') NOT NULL DEFAULT 'unknown',
	`checkedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `price_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `verification_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`triggeredBy` varchar(64) NOT NULL,
	`totalProducts` int NOT NULL DEFAULT 0,
	`verified` int NOT NULL DEFAULT 0,
	`discontinued` int NOT NULL DEFAULT 0,
	`unavailable` int NOT NULL DEFAULT 0,
	`priceAlerts` int NOT NULL DEFAULT 0,
	`duration` int,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `verification_log_id` PRIMARY KEY(`id`)
);
