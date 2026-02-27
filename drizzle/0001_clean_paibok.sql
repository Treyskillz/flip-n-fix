CREATE TABLE `shared_deals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shareId` varchar(32) NOT NULL,
	`userId` int,
	`propertyAddress` text,
	`dealData` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	`viewCount` int NOT NULL DEFAULT 0,
	CONSTRAINT `shared_deals_id` PRIMARY KEY(`id`),
	CONSTRAINT `shared_deals_shareId_unique` UNIQUE(`shareId`)
);
