CREATE TABLE `email_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`source` varchar(128) NOT NULL DEFAULT 'homepage',
	`leadMagnet` varchar(128) NOT NULL DEFAULT '5-mistakes',
	`convertedToUser` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_leads_id` PRIMARY KEY(`id`)
);
