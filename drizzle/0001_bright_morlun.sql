ALTER TABLE `users` ADD `stripeCustomerId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionPlan` enum('free','pro','elite','team') DEFAULT 'free' NOT NULL;