CREATE TABLE `pipeline_activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`dealId` int NOT NULL,
	`type` enum('note','stage_change','contact_added','document_sent','offer_made','counter_received','inspection','appraisal','closing_scheduled','rehab_update','listing_update','other') NOT NULL DEFAULT 'note',
	`title` varchar(255) NOT NULL,
	`description` text,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pipeline_activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pipeline_contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`dealId` int,
	`name` varchar(255) NOT NULL,
	`role` enum('seller','buyer','listing_agent','buyers_agent','title_company','attorney','contractor','lender','wholesaler','partner','other') NOT NULL DEFAULT 'other',
	`phone` varchar(64),
	`email` varchar(320),
	`company` varchar(255),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pipeline_contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pipeline_deals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`savedDealId` int,
	`propertyAddress` varchar(512) NOT NULL,
	`city` varchar(128),
	`state` varchar(64),
	`zip` varchar(16),
	`stage` enum('lead','analyzing','offer_submitted','under_contract','closing','rehab','listed','sold','dead') NOT NULL DEFAULT 'lead',
	`purchasePrice` int,
	`arv` int,
	`rehabCost` int,
	`estimatedProfit` int,
	`dealScore` int,
	`tags` text,
	`offerDate` timestamp,
	`contractDate` timestamp,
	`closingDate` timestamp,
	`rehabStartDate` timestamp,
	`rehabEndDate` timestamp,
	`listDate` timestamp,
	`soldDate` timestamp,
	`deadReason` varchar(255),
	`notes` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`stageEnteredAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pipeline_deals_id` PRIMARY KEY(`id`)
);
