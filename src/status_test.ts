import { assertEquals } from "jsr:@std/assert";
import { kv } from "./kv.ts";

//Mock good status
const goodStatus = [
  {
    url: "https://example.org",
    status: 200,
  },
  {
    url: "https://google.com",
    status: 200,
  },
];
await kv.set(["status", "6278de15-c88c-4b2e-8b53-54eed26acf45"], goodStatus);

Deno.test({
  name: "Test valid status",
  async fn() {
    const status = await kv.get([
      "status",
      "6278de15-c88c-4b2e-8b53-54eed26acf45",
    ]);
    assertEquals(status.value, goodStatus);
  },
});

Deno.test({
  name: "Test missing status",
  async fn() {
    const status = await kv.get([
      "status",
      // We do not expect status for this faked ID.
      "deadbeef-a000-1234-b33f-54eed26acf45",
    ]);
    assertEquals(status.value, null);
  },
});

