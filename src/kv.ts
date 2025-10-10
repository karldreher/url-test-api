/**
 * This module sets up and exports a Deno KV instance for use in the application.
 * It uses Deno's built-in key-value store to manage data persistence.
 *
 * @module kv
 */
export const kv = await Deno.openKv()
