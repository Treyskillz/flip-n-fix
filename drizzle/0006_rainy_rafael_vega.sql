CREATE TABLE `credibility_attachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`userId` int NOT NULL,
	`type` enum('before_photo','after_photo','closing_statement','bill_of_sale','other_document') NOT NULL,
	`url` text NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`filename` varchar(255),
	`mimeType` varchar(64),
	`caption` varchar(255),
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `credibility_attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `credibility_projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectName` varchar(255) NOT NULL,
	`address` varchar(512),
	`city` varchar(128),
	`state` varchar(64),
	`purchasePrice` int,
	`rehabCost` int,
	`salePrice` int,
	`profit` int,
	`purchaseDate` varchar(32),
	`saleDate` varchar(32),
	`daysToComplete` int,
	`description` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `credibility_projects_id` PRIMARY KEY(`id`)
);
