import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import { AppProvider } from "@/lib/store";
import "./globals.css";

export const metadata: Metadata = {
  title: "TikLive — Vidéos, photos, lives et messages",
  description:
    "TikLive est un réseau social complet : flux Pour toi, vidéos, photos, lives avec chat, messages privés, profils et abonnements.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
