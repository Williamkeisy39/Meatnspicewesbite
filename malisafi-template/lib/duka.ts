import { createClient, TopDukaClient } from "@valebytes/topduka-node";

let dukaInstance: TopDukaClient | null = null;
let apiKeyPromise: Promise<string> | null = null;

async function getApiKey(): Promise<string> {
  if (!apiKeyPromise) {
    apiKeyPromise = fetch("/api/config")
      .then((res) => res.json())
      .then((data) => data.apiKey)
      .catch(() => "");
  }
  return apiKeyPromise;
}

async function getDukaClient(): Promise<TopDukaClient> {
  if (!dukaInstance) {
    const apiKey = await getApiKey();
    dukaInstance = createClient({ apiKey });
  }
  return dukaInstance;
}

export const duka = new Proxy({} as TopDukaClient, {
  get: (_, prop) => {
    return async (...args: any[]) => {
      const client = await getDukaClient();
      return (client as any)[prop](...args);
    };
  },
});
