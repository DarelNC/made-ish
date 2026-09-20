"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { STATS_COOKIE, cookieValue, tokenMatches } from "@/lib/statsAuth";

export async function login(formData) {
  const token = process.env.STATS_TOKEN;
  const input = String(formData.get("token") || "");
  if (!tokenMatches(input, token)) redirect("/stats?e=1");

  (await cookies()).set(STATS_COOKIE, cookieValue(token), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/stats",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/stats");
}

export async function logout() {
  (await cookies()).delete({ name: STATS_COOKIE, path: "/stats" });
  redirect("/stats");
}
