import { assertEquals, assertExists } from "jsr:@std/assert";
import { fetchURLs } from "./urls.ts";
const controller = new AbortController();

//A simple request handler to respond to the test.
// It gets shut down when all tests finish.
Deno.serve((_req) => new Response())

Deno.test({
  name: "Test fetchURLs",
  async fn() {
    // Test is fetching against the server above.  
    const u = new URL("http://localhost:8000/");
    const status = await fetchURLs([u]);
    assertExists(status);
    assertEquals(status, [{ url: "http://localhost:8000/", status: 200 }]);
    controller.abort();
  },
  sanitizeResources: false,
});
