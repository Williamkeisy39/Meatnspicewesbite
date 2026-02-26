import { createClient } from "@valebytes/topduka-node";

export const duka = createClient({
  apiKey: process.env.NEXT_PUBLIC_API_KEY || "",
});
