/*export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY;*/

export async function fetchClients(limit = 10, offset = 0) {
  const res = await fetch("/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "list_clients",
      payload: {
        limit,
        offset,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  return res.json();
}