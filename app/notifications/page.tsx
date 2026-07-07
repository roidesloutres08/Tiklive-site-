"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  AtSign,
  Heart,
  MessageCircle,
  Radio,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import Avatar from "@/components/Avatar";
import { useApp } from "@/lib/store";

const KIND_STYLE: Record<string, { icon: LucideIcon; color: string }> = {
  like: { icon: Heart, color: "#fe2c55" },
  follow: { icon: UserPlus, color: "#25f4ee" },
  comment: { icon: MessageCircle, color: "#a78bfa" },
  live: { icon: Radio, color: "#ff6a00" },
  mention: { icon: AtSign, color: "#ffc94d" },
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
      <h1 className="page-title">Notifications</h1>
      {notifications.map((n) => {
        const user = getUser(n.from);
        const style = KIND_STYLE[n.kind] ?? KIND_STYLE.like;
        const Icon = style.icon;
        return (
          <div key={n.id} className="notif-item">
            <span className="notif-icon" style={{ color: style.color }}>
              <Icon size={17} />
            </span>
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
