import { createClient, TopDukaClient } from "@valebytes/topduka-node";

let dukaInstance: TopDukaClient | null = null;

function getDukaClient(): TopDukaClient {
  if (!dukaInstance) {
    dukaInstance = createClient({
      apiKey: process.env.NEXT_PUBLIC_API_KEY!,
    });
  }
  return dukaInstance;
}

export const duka = new Proxy({} as TopDukaClient, {
  get: (_, prop) => {
    const client = getDukaClient();
    return (client as any)[prop];
  },
});
