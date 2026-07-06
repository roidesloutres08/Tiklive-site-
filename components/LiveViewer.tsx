"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GRADIENTS, LIVE_CHAT_POOL } from "@/lib/seed";
import { formatCount, useApp } from "@/lib/store";
import type { LiveStream } from "@/lib/types";
import Avatar from "./Avatar";

type ChatEntry = {
  id: number;
  author: string;
  text: string;
  gift?: boolean;
};

const GIFTS = ["🌹", "🎁", "💎", "🦁", "🚀"];

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

  const sendGift = (gift: string) => {
    setChat((prev) => [
      ...prev.slice(-60),
      {
        id: nextId.current++,
        author: me.handle,
        text: `a envoyé un cadeau ${gift}`,
        gift: true,
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
            <div style={{ fontSize: 12, color: "#eee" }}>
              👁 {formatCount(viewers)} spectateurs
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
            style={{ fontSize: 22, marginLeft: 6 }}
          >
            ✕
          </button>
        </div>

        <div className="live-stage-inner">
          <span
            className="live-badge"
            style={{ position: "static", fontSize: 13 }}
          >
            ● EN DIRECT
          </span>
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
          <div style={{ marginTop: 18, fontSize: 13, opacity: 0.8 }}>
            Touche l&apos;écran pour envoyer un ❤️
          </div>
        </div>

        <div className="floating-hearts">
          {hearts.map((id) => (
            <span
              key={id}
              className="floating-heart"
              style={{ right: (id * 13) % 40 }}
            >
              {["❤️", "🧡", "💛", "💜", "💙"][id % 5]}
            </span>
          ))}
        </div>
      </div>

      <div className="live-chat">
        <div className="drawer-header">Chat en direct</div>
        <div className="live-chat-messages" ref={chatRef}>
          {chat.map((c) => (
            <div key={c.id} className={`chat-msg${c.gift ? " chat-gift" : ""}`}>
              <span className="chat-author">@{c.author}</span>
              {c.text}
            </div>
          ))}
        </div>
        <div className="gift-row">
          {GIFTS.map((g) => (
            <button
              key={g}
              className="gift-btn"
              onClick={() => sendGift(g)}
              aria-label={`Envoyer ${g}`}
            >
              {g}
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
