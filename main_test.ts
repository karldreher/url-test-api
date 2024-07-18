import { assertEquals, assertExists } from "jsr:@std/assert";
import { fetchURLs } from "./main.ts";
const controller = new AbortController();

Deno.test({
  name: "Test fetchURLs",
  async fn() {
    // Test is fetching against the deno-generated server.  A bit of a hack to avoid spamming internet hosts.
    const u = new URL("http://localhost:8000/");
    const status = await fetchURLs([u]);
    assertExists(status);
    // Because of our cool trick, in this case it's just relevant that it responds.  400 is fine.
    assertEquals(status, [{ url: "http://localhost:8000/", status: 400 }]);
    controller.abort();
  },
  sanitizeResources: false,
});
