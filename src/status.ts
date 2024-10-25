import { Context } from "jsr:@oak/oak@^16.1.0/context";
import { kv } from "./kv.ts";
import type { URLStatusRequest } from "./types.ts";

/**
 * Request handler for **Async** status POST requests.
 * @param ctx Oak Context
 * @example
 * POST body: {"id":"example-id-12345"}
 * @returns
 * 200 exactly once when the request can be satisfied, with the <URLStatus> in the body.
 * 400 if there is a missing ID
 * 404 if no status is present for the id.
 */
export async function v2StatusHandler(ctx: Context) {
  ctx.response.type = "json";

  try {
    const body = await ctx.request.body.text();
    const request = JSON.parse(body) as URLStatusRequest;
    const status = await kv.get(["status", request.id]);
    if (status.value === null) {
      // This is a valid ID, but we don't have a status for it.
      ctx.response.status = 404;
      return;
    }
    const statusResponse = JSON.stringify(status.value);
    ctx.response.body = statusResponse;
    ctx.response.status = 200;
    return;
  } catch {
    // This is a bad request.  Typically, because the body does not fit the URLStatusRequest shape.
    ctx.response.status = 400;
    return;
  }
}
