/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dev only: lets a phone on the same Wi-Fi load the dev server's scripts.
  // Without this the page renders but never becomes interactive there.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
};

export default nextConfig;
