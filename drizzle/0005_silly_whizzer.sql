CREATE TABLE `user_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fullName` varchar(255),
	`companyName` varchar(255),
	`phone` varchar(64),
	`email` varchar(320),
	`address` varchar(512),
	`city` varchar(128),
	`state` varchar(64),
	`zip` varchar(16),
	`website` varchar(512),
	`licenseNumber` varchar(128),
	`marketArea` varchar(255),
	`yearsExperience` varchar(32),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_profiles_userId_unique` UNIQUE(`userId`)
);
