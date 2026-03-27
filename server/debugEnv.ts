import { Express } from "express";

export function registerDebugEnvRoute(app: Express) {
  app.get("/api/debug-env-temp", (req, res) => {
    res.json({
      jwt_secret: process.env.JWT_SECRET || "NOT_SET",
      cron_secret: process.env.CRON_SECRET || "NOT_SET",
    });
  });
}
