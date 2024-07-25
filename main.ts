import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { v1UrlRequestHandler } from "./src/urls.ts";
import { Context } from "jsr:@oak/oak@^16.1.0/context";

const router = new Router();

router.post("/api/v1/urls", async (ctx:Context) => {
  await v1UrlRequestHandler(ctx)
});

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());
app.listen({ port: 8000 });
