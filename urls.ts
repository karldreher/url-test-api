import { Context } from "jsr:@oak/oak@^16.1.0/context";
import { URLStatus } from "./types.ts";

export function validateUrls(urls: string[]) {
  return urls.every((u: string) => {
    try {
      new URL(u);
      return true;
    } catch {
      return false;
    }
  });
}

export async function fetchURLs(urls: URL[]) {
    const statuses = new Array<URLStatus>();
    const promises = urls.map(async (u) => {
      const req = await fetch(u);
      if (req.status) {
        statuses.push({ url: u.toString(), status: req.status });
      }
      //todo, need to handle weird stuff here
    });
  
    await Promise.all(promises);
    return statuses;
  }

  export async function urlRequestHandler(ctx:Context){
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
  }