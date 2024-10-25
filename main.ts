import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { Context } from "jsr:@oak/oak@^16.1.0/context";
import { kv } from "./src/kv.ts";
import { v2StatusHandler } from "./src/status.ts";
import {
  v1UrlRequestHandler,
  v2UrlRequestHandler,
  fetchURLs,
} from "./src/urls.ts";

// Queue listener, for async requests from v2 endpoints
kv.listenQueue(async (msg) => {
  const status = await fetchURLs(msg.urls);
  // Store the status in KV, with the ID as the key.  
  // The status will expire in 10 minutes.
  kv.set(["status", msg.id], status, {expireIn: 600});
});

//Oak router for API
const router = new Router();

router.post("/api/v1/urls", async (ctx: Context) => {
  await v1UrlRequestHandler(ctx);
});

router.post("/api/v2/urls", async (ctx: Context) => {
  await v2UrlRequestHandler(ctx);
});

router.post(
  "/api/v2/status",
  async (ctx: Context) => await v2StatusHandler(ctx)
);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());
app.listen({ port: 8000 });
