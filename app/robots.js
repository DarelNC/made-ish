export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/stats", "/go/", "/api/"] },
  };
}
