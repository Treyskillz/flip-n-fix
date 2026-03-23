CREATE TABLE `video_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lessonId` varchar(64) NOT NULL,
	`positionSeconds` int NOT NULL DEFAULT 0,
	`durationSeconds` int NOT NULL DEFAULT 0,
	`watchedPercent` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `video_progress_id` PRIMARY KEY(`id`)
);
