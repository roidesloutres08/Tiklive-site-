"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Crown,
  Eye,
  Flame,
  Gem,
  Gift,
  Heart,
  Rocket,
  X,
} from "lucide-react";
import { GRADIENTS, LIVE_CHAT_POOL } from "@/lib/seed";
import { formatCount, useApp } from "@/lib/store";
import type { LiveStream } from "@/lib/types";
import Avatar from "./Avatar";

type ChatEntry = {
  id: number;
  author: string;
  text: string;
  gift?: string;
};

const GIFTS = [
  { name: "Cadeau", icon: Gift, color: "#ff5c7a" },
  { name: "Diamant", icon: Gem, color: "#4facfe" },
  { name: "Couronne", icon: Crown, color: "#ffc94d" },
  { name: "Fusée", icon: Rocket, color: "#38ef7d" },
  { name: "Flamme", icon: Flame, color: "#ff6a00" },
];

const HEART_COLORS = ["#fe2c55", "#ff6a00", "#ffc94d", "#a78bfa", "#4facfe"];

export default function LiveViewer({
  stream,
  onClose,
}: {
  stream: LiveStream;
  onClose: () => void;
}) {
  const { getUser, me, following, toggleFollow } = useApp();
  const host = getUser(stream.host);
  const [viewers, setViewers] = useState(stream.viewers);
  const [chat, setChat] = useState<ChatEntry[]>([]);
  const [input, setInput] = useState("");
  const [hearts, setHearts] = useState<number[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  const isFollowing = following.includes(stream.host);

  // Flux de chat simulé + fluctuation du nombre de spectateurs.
  useEffect(() => {
    const chatTimer = setInterval(() => {
      const pick =
        LIVE_CHAT_POOL[Math.floor(Math.random() * LIVE_CHAT_POOL.length)];
      setChat((prev) => [
        ...prev.slice(-60),
        { id: nextId.current++, author: pick.author, text: pick.text },
      ]);
    }, 1400 + Math.random() * 800);
    const viewerTimer = setInterval(() => {
      setViewers((v) => Math.max(100, v + Math.floor(Math.random() * 61) - 25));
    }, 2500);
    return () => {
      clearInterval(chatTimer);
      clearInterval(viewerTimer);
    };
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
  }, [chat]);

  const sendChat = () => {
    const t = input.trim();
    if (!t) return;
    setChat((prev) => [
      ...prev.slice(-60),
      { id: nextId.current++, author: me.handle, text: t },
    ]);
    setInput("");
  };

  const sendGift = (giftName: string) => {
    setChat((prev) => [
      ...prev.slice(-60),
      {
        id: nextId.current++,
        author: me.handle,
        text: `a envoyé : ${giftName}`,
        gift: giftName,
      },
    ]);
    setHearts((prev) => [...prev.slice(-12), nextId.current++]);
  };

  const sendHeart = () => {
    setHearts((prev) => [...prev.slice(-12), nextId.current++]);
  };

  return (
    <div className="live-viewer" role="dialog" aria-label={stream.title}>
      <div
        className="live-stage"
        style={{ background: GRADIENTS[stream.gradient % GRADIENTS.length] }}
        onClick={sendHeart}
      >
        <div className="live-topbar">
          <Link href={`/profile?u=${stream.host}`}>
            <Avatar
              name={host?.name ?? stream.host}
              gradient={host?.gradient ?? 0}
              size={40}
            />
          </Link>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>@{stream.host}</div>
            <div className="live-topbar-viewers">
              <Eye size={14} />
              {formatCount(viewers)} spectateurs
            </div>
          </div>
          <button
            className={`btn ${isFollowing ? "btn-following" : "btn-primary"}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFollow(stream.host);
            }}
          >
            {isFollowing ? "Abonné(e)" : "S'abonner"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Quitter le live"
            className="icon-btn icon-btn-dark"
          >
            <X size={20} />
          </button>
        </div>

        <div className="live-stage-inner">
          <span className="live-badge live-badge-static">EN DIRECT</span>
          <h2 style={{ margin: "16px 0 4px", fontSize: 24 }}>{stream.title}</h2>
          <div style={{ opacity: 0.85, fontWeight: 600 }}>
            {stream.category}
          </div>
          <div className="live-equalizer" aria-hidden>
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="live-hint">
            <Heart size={14} fill="currentColor" />
            Touche l&apos;écran pour envoyer des cœurs
          </div>
        </div>

        <div className="floating-hearts">
          {hearts.map((id) => (
            <span
              key={id}
              className="floating-heart"
              style={{
                right: (id * 13) % 40,
                color: HEART_COLORS[id % HEART_COLORS.length],
              }}
            >
              <Heart size={26} fill="currentColor" strokeWidth={0} />
            </span>
          ))}
        </div>
      </div>

      <div className="live-chat">
        <div className="drawer-header">Chat en direct</div>
        <div className="live-chat-messages" ref={chatRef}>
          {chat.map((c) => {
            const gift = c.gift
              ? GIFTS.find((g) => g.name === c.gift)
              : undefined;
            return (
              <div
                key={c.id}
                className={`chat-msg${gift ? " chat-gift" : ""}`}
              >
                <span className="chat-author">@{c.author}</span>
                {c.text}
                {gift && (
                  <gift.icon
                    size={15}
                    style={{
                      color: gift.color,
                      verticalAlign: "-2px",
                      marginLeft: 5,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="gift-row">
          {GIFTS.map((g) => (
            <button
              key={g.name}
              className="gift-btn"
              onClick={() => sendGift(g.name)}
              aria-label={`Envoyer ${g.name}`}
              title={g.name}
              style={{ color: g.color }}
            >
              <g.icon size={20} />
            </button>
          ))}
        </div>
        <div className="drawer-input">
          <input
            className="text-input"
            placeholder="Écrire dans le chat…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendChat()}
            maxLength={200}
          />
          <button className="btn btn-primary" onClick={sendChat}>
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
