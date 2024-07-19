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