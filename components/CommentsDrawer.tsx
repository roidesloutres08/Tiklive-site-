"use client";

import Link from "next/link";
import { useState } from "react";
import { formatCount, useApp } from "@/lib/store";
import type { Post } from "@/lib/types";
import Avatar from "./Avatar";

export default function CommentsDrawer({
  post,
  onClose,
}: {
  post: Post;
  onClose: () => void;
}) {
  const { getUser, addComment, me } = useApp();
  const [text, setText] = useState("");

  const send = () => {
    const t = text.trim();
    if (!t) return;
    addComment(post.id, t);
    setText("");
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="comments-drawer" role="dialog" aria-label="Commentaires">
        <div className="drawer-header">
          <span>Commentaires ({post.comments.length})</span>
          <button onClick={onClose} aria-label="Fermer" style={{ fontSize: 20 }}>
            ✕
          </button>
        </div>
        <div className="drawer-body">
          {post.comments.length === 0 && (
            <div className="empty-state">
              <span className="big">💬</span>
              Aucun commentaire pour l&apos;instant.
              <br />
              Sois la première personne à commenter !
            </div>
          )}
          {post.comments.map((c) => {
            const user = getUser(c.author);
            const isMe = c.author === me.handle;
            return (
              <div key={c.id} className="comment-row">
                <Link href={`/profile?u=${c.author}`}>
                  <Avatar
                    name={user?.name ?? c.author}
                    gradient={user?.gradient ?? 0}
                    size={34}
                  />
                </Link>
                <div className="comment-content">
                  <div className="comment-author">
                    @{c.author}
                    {isMe && " (toi)"}
                  </div>
                  <div className="comment-text">{c.text}</div>
                  <div className="comment-meta">
                    <span>{c.time}</span>
                    <span>❤️ {formatCount(c.likes)}</span>
                    <span>Répondre</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="drawer-input">
          <input
            className="text-input"
            placeholder="Ajouter un commentaire…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            maxLength={300}
          />
          <button className="btn btn-primary" onClick={send}>
            Publier
          </button>
        </div>
      </div>
    </>
  );
}
