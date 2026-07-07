"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  Bell,
  Compass,
  Home,
  MessageCircle,
  Play,
  Radio,
  SquarePlus,
  User,
} from "lucide-react";
import { GRADIENTS } from "@/lib/seed";
import { useApp } from "@/lib/store";
import Avatar from "./Avatar";

const NAV = [
  { href: "/", icon: Home, label: "Pour toi" },
  { href: "/explore", icon: Compass, label: "Explorer" },
  { href: "/live", icon: Radio, label: "Live" },
  { href: "/messages", icon: MessageCircle, label: "Messages" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/upload", icon: SquarePlus, label: "Publier" },
  { href: "/profile", icon: User, label: "Profil" },
];

function Logo() {
  return (
    <Link href="/" className="logo">
      <span className="logo-mark">
        <Play size={16} strokeWidth={0} fill="#fff" />
      </span>
      <span>
        <span className="logo-tik">Tik</span>
        <span className="logo-live">Live</span>
      </span>
    </Link>
  );
}

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
          <span className="logo-live">Live</span>
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
        <Logo />
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item${isActive(item.href) ? " active" : ""}`}
            >
              <span className="nav-icon">
                <Icon size={22} strokeWidth={isActive(item.href) ? 2.4 : 2} />
              </span>
              {item.label}
              {item.href === "/notifications" && unread > 0 && (
                <span className="nav-badge">{unread}</span>
              )}
            </Link>
          );
        })}
        <Link href="/profile" className="sidebar-me">
          <Avatar name={me.name} gradient={me.gradient} size={36} />
          <span style={{ minWidth: 0 }}>
            <span className="sidebar-me-name">{me.name}</span>
            <span className="sidebar-me-handle">@{me.handle}</span>
          </span>
        </Link>
        <div className="sidebar-footer">
          TikLive — réseau social de démonstration.
          <br />© 2026 TikLive
        </div>
      </aside>

      <main className="main-content">{children}</main>

      <nav className="bottom-nav">
        <Link href="/" className={isActive("/") ? "active" : ""}>
          <span className="nav-icon">
            <Home size={23} />
          </span>
          Accueil
        </Link>
        <Link href="/explore" className={isActive("/explore") ? "active" : ""}>
          <span className="nav-icon">
            <Compass size={23} />
          </span>
          Explorer
        </Link>
        <Link href="/upload" aria-label="Publier">
          <span className="create-btn">
            <SquarePlus size={20} />
          </span>
        </Link>
        <Link
          href="/messages"
          className={isActive("/messages") ? "active" : ""}
        >
          <span className="nav-icon">
            <MessageCircle size={23} />
          </span>
          Messages
        </Link>
        <Link href="/profile" className={isActive("/profile") ? "active" : ""}>
          <span className="nav-icon">
            <User size={23} />
          </span>
          Profil
        </Link>
      </nav>

      {ready && !onboarded && <Onboarding />}
    </div>
  );
}
