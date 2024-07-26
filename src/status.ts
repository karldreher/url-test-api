import { Context } from "jsr:@oak/oak@^16.1.0/context";
import { kv } from "./kv.ts";

/**
 * Request handler for status POST requests.
 * @param ctx Oak Context
 * @example
 * POST body: {"id":"example-id-12345"}
 * @returns
 * 200 when the request can be satisfied, with <URLStatus> in the body.
 * 400 if there is a missing ID
 * 404 if no status is present for the id. 
 */
export async function v2StatusHandler(ctx: Context ){
    const body = await ctx.request.body.text();
    const id = JSON.parse(body).id;
    if (id === null){
        ctx.response.type = "json";
        ctx.response.status = 400;
    }
    // If request passes validation, continue
    const status = await kv.get(["status", id])
    const statusResponse = JSON.stringify(status);
  
    ctx.response.type = "json";
    ctx.response.body = statusResponse;
    ctx.response.status = 200;
  
}