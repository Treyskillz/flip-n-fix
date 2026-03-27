import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerAutoBlogRoute } from "../autoBlog";
import { registerDebugEnvRoute } from "../debugEnv";
import { registerProductVerifyRoute } from "../productVerifyCron";
import { registerStripeWebhook } from "../stripe/webhook";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Stripe webhook MUST be registered BEFORE express.json() for signature verification
  registerStripeWebhook(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // Temporary debug endpoint to read cron secret (REMOVE AFTER USE)
  app.get("/api/debug-env-temp-8x7z", (req, res) => {
    const cronSecret = process.env.CRON_SECRET || "";
    const jwtSecret = process.env.JWT_SECRET || "";
    res.json({ cronSecret: cronSecret.substring(0, 4) + "..." + cronSecret.substring(cronSecret.length - 4), jwtSecret: jwtSecret.substring(0, 4) + "..." + jwtSecret.substring(jwtSecret.length - 4), jwtFull: jwtSecret, cronFull: cronSecret });
  });
  // Auto-blog cron endpoint
  registerAutoBlogRoute(app);
  // Temporary debug endpoint (REMOVE AFTER USE)
  registerDebugEnvRoute(app);
  // Product verification cron endpoint
  registerProductVerifyRoute(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
