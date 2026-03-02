CREATE TABLE `gifted_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`plan` enum('pro','elite','team') NOT NULL,
	`grantedBy` int NOT NULL,
	`reason` varchar(512),
	`expiresAt` timestamp,
	`revokedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gifted_subscriptions_id` PRIMARY KEY(`id`)
);
