import { describe, expect, it } from "vitest";
import { cookieAuthorized, cookieValue, tokenMatches } from "../statsAuth.js";

describe("statsAuth", () => {
  it("accepts only the exact token", () => {
    expect(tokenMatches("s3cret", "s3cret")).toBe(true);
    expect(tokenMatches("s3cret ", "s3cret")).toBe(false);
    expect(tokenMatches("", "s3cret")).toBe(false);
  });

  it("rejects everything when no token is configured", () => {
    expect(tokenMatches("anything", undefined)).toBe(false);
    expect(cookieAuthorized(cookieValue("anything"), undefined)).toBe(false);
  });

  it("accepts a cookie derived from the token and nothing else", () => {
    expect(cookieAuthorized(cookieValue("s3cret"), "s3cret")).toBe(true);
    expect(cookieAuthorized(cookieValue("other"), "s3cret")).toBe(false);
    expect(cookieAuthorized("s3cret", "s3cret")).toBe(false);
    expect(cookieAuthorized(undefined, "s3cret")).toBe(false);
    expect(cookieAuthorized("x".repeat(500), "s3cret")).toBe(false);
  });

  it("does not put the token in the cookie", () => {
    expect(cookieValue("s3cret")).not.toContain("s3cret");
  });
});
