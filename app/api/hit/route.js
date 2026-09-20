import { record } from "@/lib/analytics/record";

const MAX_BODY = 1024;

export async function POST(request) {
  const text = await request.text();
  if (text.length > MAX_BODY) return new Response(null, { status: 413 });

  let body;
  try {
    body = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!body || typeof body !== "object") return new Response(null, { status: 400 });

  await record({ type: "view", headers: request.headers, ref: body.ref, src: body.src });
  return new Response(null, { status: 204 });
}
