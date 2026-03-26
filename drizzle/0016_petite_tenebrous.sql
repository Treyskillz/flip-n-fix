CREATE TABLE `email_drip_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`subject` varchar(500) NOT NULL,
	`sequenceKey` varchar(128) NOT NULL,
	`stepIndex` int NOT NULL,
	`resendId` varchar(128),
	`status` enum('sent','failed') NOT NULL DEFAULT 'sent',
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_drip_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `email_drip_queue` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`recipientName` varchar(255),
	`sequenceKey` varchar(128) NOT NULL,
	`stepIndex` int NOT NULL,
	`stepName` varchar(255) NOT NULL,
	`scheduledAt` timestamp NOT NULL,
	`sentAt` timestamp,
	`status` enum('pending','sent','failed','cancelled') NOT NULL DEFAULT 'pending',
	`errorMessage` text,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_drip_queue_id` PRIMARY KEY(`id`)
);
