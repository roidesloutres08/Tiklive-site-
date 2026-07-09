// Deux modes d'hébergement :
// - GitHub Pages par défaut : servi depuis /<repo>/, d'où le basePath.
// - Domaine personnalisé (PAGES_CUSTOM_DOMAIN, ex. tiklive.eu) : l'app est
//   servie sous /reseau (tiklive.eu/reseau).
const isGithubPages = process.env.GITHUB_PAGES === "true";
const customDomain = process.env.PAGES_CUSTOM_DOMAIN;
const repo = "Tiklive-site-";

const basePath = customDomain ? "/reseau" : isGithubPages ? `/${repo}` : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : "",
};

export default nextConfig;
