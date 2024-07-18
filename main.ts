import { URLStatus } from "./types.ts";

Deno.serve(async (req: Request) => {
  if (req.method == "POST") {
    if (req.body) {
      const body = await req.text();
      const urls = JSON.parse(body).urls;

      if (
        !urls.every((u: string) => {
          try {
            new URL(u);
            return true;
          } catch {
            return false;
          }
        })
      ) {
        return new Response("Bad Input", { status: 400 });
      }
      const statuses = await fetchURLs(urls);
      const statusResponse = JSON.stringify(statuses);

      return new Response(statusResponse, { status: 200 });
    }
    return new Response("OK", { status: 200 });
  }

  return new Response("Bad Request", { status: 400 });
});

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
