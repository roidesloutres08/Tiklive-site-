"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { ArrowLeft, BadgeCheck, MessageCircle, SquarePen } from "lucide-react";
import Avatar from "@/components/Avatar";
import { useApp } from "@/lib/store";

function MessagesContent() {
  const { conversations, users, getUser, sendMessage, me } = useApp();
  const params = useSearchParams();
  const initialWith = params.get("u");
  const [selected, setSelected] = useState<string | null>(initialWith);
  const [input, setInput] = useState("");
  const [showNew, setShowNew] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const conv = conversations.find((c) => c.with === selected);
  const partner = selected ? getUser(selected) : undefined;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [conv?.messages.length, selected]);

  const send = () => {
    const t = input.trim();
    if (!t || !selected) return;
    sendMessage(selected, t);
    setInput("");
  };

  const knownHandles = new Set(conversations.map((c) => c.with));
  const newContacts = users.filter(
    (u) => u.handle !== me.handle && !knownHandles.has(u.handle),
  );

  return (
    <div className="messages-layout">
      <div className={`conv-list${selected ? " hidden-mobile" : ""}`}>
        <div className="conv-list-header">
          Messages
          <button
            className="btn btn-outline btn-icon-text"
            onClick={() => setShowNew((s) => !s)}
          >
            <SquarePen size={15} />
            Nouveau
          </button>
        </div>
        {showNew &&
          newContacts.map((u) => (
            <button
              key={u.handle}
              className="conv-item"
              onClick={() => {
                setSelected(u.handle);
                setShowNew(false);
              }}
            >
              <Avatar name={u.name} gradient={u.gradient} size={46} />
              <div className="conv-preview">
                <div className="conv-name">{u.name}</div>
                <div className="conv-last">Démarrer une conversation</div>
              </div>
            </button>
          ))}
        {conversations.map((c) => {
          const u = getUser(c.with);
          const last = c.messages[c.messages.length - 1];
          return (
            <button
              key={c.id}
              className={`conv-item${selected === c.with ? " active" : ""}`}
              onClick={() => setSelected(c.with)}
            >
              <Avatar
                name={u?.name ?? c.with}
                gradient={u?.gradient ?? 0}
                size={46}
              />
              <div className="conv-preview">
                <div className="conv-name">
                  {u?.name ?? c.with}
                  {u?.verified && (
                    <BadgeCheck
                      size={14}
                      className="verified"
                      fill="var(--cyan)"
                      stroke="var(--bg)"
                    />
                  )}
                </div>
                <div className="conv-last">
                  {last
                    ? `${last.from === "me" ? "Toi : " : ""}${last.text}`
                    : "Nouvelle conversation"}
                </div>
              </div>
              <span className="conv-time">{last?.time}</span>
            </button>
          );
        })}
      </div>

      <div className={`thread${!selected ? " hidden-mobile" : ""}`}>
        {!selected ? (
          <div className="thread-empty">
            <MessageCircle size={44} />
            <div>Sélectionne une conversation pour commencer à discuter</div>
          </div>
        ) : (
          <>
            <div className="thread-header">
              <button
                onClick={() => setSelected(null)}
                aria-label="Retour"
                className="icon-btn"
              >
                <ArrowLeft size={20} />
              </button>
              <Avatar
                name={partner?.name ?? selected}
                gradient={partner?.gradient ?? 0}
                size={40}
              />
              <div>
                <div style={{ fontWeight: 700 }}>
                  {partner?.name ?? selected}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  @{selected}
                </div>
              </div>
            </div>
            <div className="thread-messages">
              {(conv?.messages ?? []).map((m) => (
                <div
                  key={m.id}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div
                    className={`bubble ${m.from === "me" ? "mine" : "theirs"}`}
                  >
                    {m.text}
                  </div>
                  <span
                    className={`bubble-time${m.from === "me" ? " mine" : ""}`}
                  >
                    {m.time}
                  </span>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <div className="thread-input">
              <input
                className="text-input"
                placeholder={`Écrire à @${selected}…`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                maxLength={500}
              />
              <button className="btn btn-primary" onClick={send}>
                Envoyer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={null}>
      <MessagesContent />
    </Suspense>
  );
}
