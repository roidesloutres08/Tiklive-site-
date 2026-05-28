// When deploying to GitHub Pages the site is served from /<repo>/,
// so a basePath is required for assets and links to resolve.
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repo = "tiklive-site-";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isGithubPages ? `/${repo}` : "",
  assetPrefix: isGithubPages ? `/${repo}/` : "",
};

export default nextConfig;
