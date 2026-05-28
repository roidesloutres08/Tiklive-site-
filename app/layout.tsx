import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tiklive.eu"),
  title: "Tiklive — Automatisation & interactivité pour vos LIVE TikTok",
  description:
    "Tiklive automatise vos cadeaux, déclenche des overlays animés, lit les messages en Text-to-Speech et propose des modes interactifs pour des LIVE TikTok plus vivants.",
  keywords: [
    "TikTok Live",
    "automatisation TikTok",
    "overlay TikTok",
    "TTS TikTok",
    "cadeaux TikTok",
    "modes interactifs",
    "Tiklive",
  ],
  openGraph: {
    title: "Tiklive — Automatisation pour vos LIVE TikTok",
    description:
      "Cadeaux, overlays, TTS et modes interactifs : automatisez vos LIVE TikTok avec Tiklive.",
    url: "https://tiklive.eu",
    siteName: "Tiklive",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
