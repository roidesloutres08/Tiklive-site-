"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { GRADIENTS } from "@/lib/seed";
import { useApp } from "@/lib/store";
import Avatar from "./Avatar";

const NAV = [
  { href: "/", icon: "🏠", label: "Pour toi" },
  { href: "/explore", icon: "🧭", label: "Explorer" },
  { href: "/live", icon: "📡", label: "Live" },
  { href: "/messages", icon: "✉️", label: "Messages" },
  { href: "/notifications", icon: "🔔", label: "Notifications" },
  { href: "/upload", icon: "➕", label: "Publier" },
  { href: "/profile", icon: "👤", label: "Profil" },
];

function Onboarding() {
  const { completeOnboarding } = useApp();
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [gradient, setGradient] = useState(4);

  const submit = () => {
    const cleanName = name.trim() || "Mon compte";
    const cleanHandle =
      handle.trim().toLowerCase().replace(/[^a-z0-9._]/g, "") ||
      cleanName.toLowerCase().replace(/[^a-z0-9]/g, ".") ||
      "moi";
    completeOnboarding({
      handle: cleanHandle,
      name: cleanName,
      bio: "Bienvenue sur mon profil ✨",
      gradient,
    });
  };

  return (
    <div className="onboarding-backdrop">
      <div className="onboarding-card">
        <div className="onboarding-title">
          Bienvenue sur <span className="logo-tik">Tik</span>
          <span className="logo-live">Live</span> 👋
        </div>
        <p className="onboarding-sub">
          Crée ton profil pour aimer, commenter, suivre des créateurs et
          publier tes propres vidéos et photos.
        </p>
        <label className="field-label">Ton nom</label>
        <input
          className="field-input"
          placeholder="ex. Camille Durand"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
        />
        <label className="field-label">Nom d&apos;utilisateur</label>
        <input
          className="field-input"
          placeholder="ex. camille.d"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          maxLength={24}
        />
        <label className="field-label">Couleur d&apos;avatar</label>
        <div className="gradient-picker">
          {GRADIENTS.map((g, i) => (
            <button
              key={i}
              className={`gradient-swatch${i === gradient ? " active" : ""}`}
              style={{ background: g }}
              onClick={() => setGradient(i)}
              aria-label={`Couleur ${i + 1}`}
            />
          ))}
        </div>
        <button
          className="btn btn-primary"
          style={{ width: "100%", marginTop: 24, padding: 13 }}
          onClick={submit}
        >
          Commencer
        </button>
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { ready, onboarded, me, notifications } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/" className="logo">
          <span className="logo-tik">Tik</span>
          <span className="logo-live">Live</span>
        </Link>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item${isActive(item.href) ? " active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            {item.href === "/notifications" && unread > 0 && (
              <span className="nav-badge">{unread}</span>
            )}
          </Link>
        ))}
        <div style={{ padding: "16px 12px", display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={me.name} gradient={me.gradient} size={34} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{me.name}</div>
            <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
              @{me.handle}
            </div>
          </div>
        </div>
        <div className="sidebar-footer">
          TikLive — réseau social de démonstration.
          <br />© 2026 TikLive
        </div>
      </aside>

      <main className="main-content">{children}</main>

      <nav className="bottom-nav">
        <Link href="/" className={isActive("/") ? "active" : ""}>
          <span className="nav-icon">🏠</span>Accueil
        </Link>
        <Link href="/explore" className={isActive("/explore") ? "active" : ""}>
          <span className="nav-icon">🧭</span>Explorer
        </Link>
        <Link href="/upload">
          <span className="create-btn">＋</span>
        </Link>
        <Link href="/messages" className={isActive("/messages") ? "active" : ""}>
          <span className="nav-icon">✉️</span>Messages
        </Link>
        <Link href="/profile" className={isActive("/profile") ? "active" : ""}>
          <span className="nav-icon">👤</span>Profil
        </Link>
      </nav>

      {ready && !onboarded && <Onboarding />}
    </div>
  );
}
