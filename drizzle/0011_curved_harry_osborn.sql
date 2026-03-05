CREATE TABLE `white_label_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`companyName` varchar(255),
	`logoUrl` text,
	`logoFileKey` varchar(512),
	`brandColor` varchar(32) DEFAULT '#c53030',
	`phone` varchar(64),
	`email` varchar(320),
	`website` varchar(512),
	`tagline` varchar(255),
	`enabled` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `white_label_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `white_label_settings_userId_unique` UNIQUE(`userId`)
);
