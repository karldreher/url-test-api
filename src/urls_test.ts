import { assertEquals, assertExists } from "jsr:@std/assert";
import { validateUrls,fetchURLs } from "./urls.ts";


//A simple request handler to respond to the test.
// It gets shut down when all tests finish.
Deno.serve((_req) => new Response())
const controller = new AbortController();

Deno.test({
  name: "Test fetchURLs()",
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

Deno.test({
  name: "Test validateUrls() - Valid input",
  fn() {
    const urls = ["https://example.org", "https://example.com"];
    const status = validateUrls(urls);
    assertExists(status);
    assertEquals(status, true);
  },
});

Deno.test({
  name: "Test validateUrls() - Invalid input",
  fn() {
    const urls = ["not-a-url", "123445", "example.org"];
    const status = validateUrls(urls);
    assertExists(status);
    assertEquals(status, false);
  },
});
