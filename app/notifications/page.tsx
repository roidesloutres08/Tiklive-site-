"use client";

import Link from "next/link";
import { useEffect } from "react";
import Avatar from "@/components/Avatar";
import { useApp } from "@/lib/store";

const KIND_ICONS: Record<string, string> = {
  like: "❤️",
  follow: "👤",
  comment: "💬",
  live: "📡",
  mention: "@",
};

export default function NotificationsPage() {
  const { notifications, getUser, markNotificationsRead } = useApp();

  // Les notifications sont marquées comme lues une fois la page ouverte.
  useEffect(() => {
    const timer = setTimeout(markNotificationsRead, 1200);
    return () => clearTimeout(timer);
  }, [markNotificationsRead]);

  return (
    <div className="page" style={{ maxWidth: 680 }}>
      <h1 className="page-title">🔔 Notifications</h1>
      {notifications.map((n) => {
        const user = getUser(n.from);
        return (
          <div key={n.id} className="notif-item">
            <span className="notif-icon">{KIND_ICONS[n.kind] ?? "🔔"}</span>
            <Link href={`/profile?u=${n.from}`}>
              <Avatar
                name={user?.name ?? n.from}
                gradient={user?.gradient ?? 0}
                size={40}
              />
            </Link>
            <div className="notif-text">
              <Link href={`/profile?u=${n.from}`} style={{ fontWeight: 700 }}>
                @{n.from}
              </Link>{" "}
              {n.text}
              <div className="notif-time">{n.time}</div>
            </div>
            {!n.read && <span className="unread-dot" />}
          </div>
        );
      })}
    </div>
  );
}
