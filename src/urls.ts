import { Context } from "jsr:@oak/oak@^16.1.0/context";
import { kv } from "./kv.ts";
import type { URLStatus, URLTestRequest } from  "./types.ts";

/**
 *
 * @param urls
 * An array of string values.  These *should* be URLs.
 * @returns
 * `true` if all members of the array are a valid URL, else `false`.
 */
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

/**
 * Given an input containing an array of URLs,
 * fetch each URL and return its status.
 * @param urls An array of URLs.
 * @returns An array of URLStatus reflecting the fetch status of the urls.
 */
export async function fetchURLs(urls: URL[]) {
  const statuses = new Array<URLStatus>();
  const promises = urls.map(async (u) => {
    const req = await fetch(u);
    if (req.status) {
      const status = {url: u.toString(), status: req.status} as URLStatus;
      statuses.push(status);
    }
    //todo, need to handle weird stuff here
  });

  await Promise.all(promises);
  return statuses;
}

/**
 * Request handler for url POST requests.
 * These requests are synchronous and will block until all URLs are fetched.
 * @param ctx Oak Context
 * @example
 * POST body: {"urls":["https://example.org","https://example.com"]}
 */
export async function v1UrlRequestHandler(ctx: Context) {
  ctx.response.type = "json";
  
  const body = await ctx.request.body.text();
  const request = JSON.parse(body) as URLTestRequest;
  if (!validateUrls(request.urls)) {
    // At least one "URL" is not a valid URL.
    ctx.response.status = 400;
    return;
  }
  // If request passes validation, continue
  const statuses = await fetchURLs(request.urls.map((u) => new URL(u)));
  const statusResponse = JSON.stringify(statuses);

  ctx.response.body = statusResponse;
  ctx.response.status = 200;
}

/**
 * **Async** Request handler for url POST requests.
 * @param ctx Oak Context
 * @example
 * POST body: {"urls":["https://example.org","https://example.com"]}
 */
export async function v2UrlRequestHandler(ctx: Context) {
  ctx.response.type = "json";

  const body = await ctx.request.body.text();
  const urls = JSON.parse(body).urls;
  if (!validateUrls(urls)) {
    ctx.response.body = { error: "Bad Request" };
    ctx.response.status = 400;
    return;
  }
  // If request passes validation, continue

  const id: string = crypto.randomUUID();
  const task = await kv.enqueue({"id":id, "urls":urls});
  if (!task.ok) {
    // Fail
    ctx.response.status = 500;
    return
  }
  // Respond with the ID
  ctx.response.body = { id: id };
  ctx.response.status = 200;
}
