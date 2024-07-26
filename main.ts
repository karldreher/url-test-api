import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { Context } from "jsr:@oak/oak@^16.1.0/context";
import {
  v1UrlRequestHandler,
  v2UrlRequestHandler,
  fetchURLs,
} from "./src/urls.ts";
import { v2StatusHandler } from "./src/status.ts";
import { kv } from "./src/kv.ts";

kv.listenQueue(async (msg) => {
  const status = await fetchURLs(msg.urls);
  kv.set(["status", msg.id], status);
});

const router = new Router();

router.post("/api/v1/urls", async (ctx: Context) => {
  await v1UrlRequestHandler(ctx);
});

router.post("/api/v2/urls", async (ctx: Context) => {
  await v2UrlRequestHandler(ctx);
});

router.post("/api/v2/status", async (ctx:Context)=>
  await v2StatusHandler(ctx)
)

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());
app.listen({ port: 8000 });
