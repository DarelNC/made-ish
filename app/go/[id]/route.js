import { NextResponse, after } from "next/server";
import { links } from "@/content/site";
import { record } from "@/lib/analytics/record";

export async function GET(request, { params }) {
  const { id } = await params;
  const link = links.find((l) => l.id === id);
  if (!link) return NextResponse.redirect(new URL("/", request.url), 302);

  // 302, not 301: a cached permanent redirect would skip us on the next click.
  // Redirect first, record after, so a slow store can never delay the visitor.
  after(() => record({ type: "click", link: link.id, headers: request.headers }));
  return NextResponse.redirect(link.url, { status: 302, headers: { "cache-control": "no-store" } });
}
