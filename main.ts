import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { validateUrls, fetchURLs } from "./urls.ts";

const router = new Router();

router.post("/api/v1/urls", async (ctx) => {
  const body = await ctx.request.body.text();
  const urls = JSON.parse(body).urls;
  if (!validateUrls(urls)) {
    ctx.response.type = "json";
    ctx.response.body = { error: "Bad Request" };
    ctx.response.status = 400;
    return;
  }
  // If request passes validation, continue
  const statuses = await fetchURLs(urls);
  const statusResponse = JSON.stringify(statuses);

  ctx.response.type = "json";
  ctx.response.body = statusResponse;
  ctx.response.status = 200;
});

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());
app.listen({ port: 8000 });
