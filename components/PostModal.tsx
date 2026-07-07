"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Bookmark,
  Check,
  Disc3,
  Heart,
  MessageCircle,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import { formatCount, useApp } from "@/lib/store";
import Avatar from "./Avatar";

export default function PostModal({
  postId,
  onClose,
}: {
  postId: string;
  onClose: () => void;
}) {
  const {
    posts,
    getUser,
    me,
    likedPosts,
    savedPosts,
    following,
    toggleLike,
    toggleSave,
    toggleFollow,
    addComment,
    deletePost,
  } = useApp();
  const [text, setText] = useState("");
  const [shared, setShared] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const post = posts.find((p) => p.id === postId);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!post) return null;

  const author = getUser(post.author);
  const liked = likedPosts.includes(post.id);
  const saved = savedPosts.includes(post.id);
  const isMine = post.author === me.handle;
  const isFollowing = following.includes(post.author);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    addComment(post.id, t);
    setText("");
  };

  const share = () => {
    setShared(true);
    setTimeout(() => setShared(false), 1500);
  };

  const remove = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    deletePost(post.id);
    onClose();
  };

  return (
    <div className="post-modal" role="dialog" aria-label="Publication">
      <div className="post-modal-media" onClick={onClose}>
        {post.type === "video" ? (
          <video
            src={post.src}
            poster={post.poster}
            autoPlay
            loop
            muted
            playsInline
            controls
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <img
            src={post.src}
            alt={post.caption}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        <button
          className="icon-btn icon-btn-dark post-modal-close"
          onClick={onClose}
          aria-label="Fermer"
        >
          <X size={20} />
        </button>
      </div>

      <div className="post-modal-side">
        <div className="post-modal-header">
          <Link href={`/profile?u=${post.author}`} onClick={onClose}>
            <Avatar
              name={author?.name ?? post.author}
              gradient={author?.gradient ?? 0}
              size={44}
            />
          </Link>
          <div className="user-row-info">
            <Link href={`/profile?u=${post.author}`} onClick={onClose}>
              <div className="user-row-name">
                {author?.name ?? post.author}{" "}
                {author?.verified && (
                  <BadgeCheck
                    size={15}
                    className="verified"
                    fill="var(--cyan)"
                    stroke="var(--bg)"
                  />
                )}
              </div>
              <div className="user-row-sub">@{post.author}</div>
            </Link>
          </div>
          {isMine ? (
            <button
              className={`btn ${confirmDelete ? "btn-primary" : "btn-outline"} btn-icon-text`}
              onClick={remove}
            >
              <Trash2 size={15} />
              {confirmDelete ? "Confirmer ?" : "Supprimer"}
            </button>
          ) : (
            <button
              className={`btn ${isFollowing ? "btn-following" : "btn-primary"}`}
              onClick={() => toggleFollow(post.author)}
            >
              {isFollowing ? "Abonné(e)" : "S'abonner"}
            </button>
          )}
        </div>

        <div className="post-modal-caption">
          <div>{post.caption}</div>
          {post.hashtags.length > 0 && (
            <div className="feed-hashtags">
              {post.hashtags.map((h) => `#${h}`).join(" ")}
            </div>
          )}
          {post.music && (
            <div className="feed-music">
              <Disc3 size={15} className="music-disc" />
              {post.music}
            </div>
          )}
        </div>

        <div className="post-modal-actions">
          <button
            className={`post-action${liked ? " liked" : ""}`}
            onClick={() => toggleLike(post.id)}
          >
            <Heart size={19} fill={liked ? "currentColor" : "none"} />
            {formatCount(post.likes + (liked ? 1 : 0))}
          </button>
          <span className="post-action">
            <MessageCircle size={19} />
            {formatCount(post.comments.length)}
          </span>
          <button
            className={`post-action${saved ? " saved" : ""}`}
            onClick={() => toggleSave(post.id)}
          >
            <Bookmark size={19} fill={saved ? "currentColor" : "none"} />
            Favoris
          </button>
          <button
            className={`post-action${shared ? " shared" : ""}`}
            onClick={share}
          >
            {shared ? <Check size={19} /> : <Share2 size={19} />}
            {shared ? "Copié !" : formatCount(post.shares)}
          </button>
        </div>

        <div className="drawer-body">
          {post.comments.length === 0 && (
            <div className="empty-state" style={{ padding: "40px 20px" }}>
              <span className="empty-icon">
                <MessageCircle size={36} />
              </span>
              Aucun commentaire pour l&apos;instant.
              <br />
              Sois la première personne à commenter !
            </div>
          )}
          {post.comments.map((c) => {
            const user = getUser(c.author);
            return (
              <div key={c.id} className="comment-row">
                <Link href={`/profile?u=${c.author}`} onClick={onClose}>
                  <Avatar
                    name={user?.name ?? c.author}
                    gradient={user?.gradient ?? 0}
                    size={34}
                  />
                </Link>
                <div className="comment-content">
                  <div className="comment-author">
                    @{c.author}
                    {c.author === me.handle && " (toi)"}
                  </div>
                  <div className="comment-text">{c.text}</div>
                  <div className="comment-meta">
                    <span>{c.time}</span>
                    <span className="comment-like">
                      <Heart size={13} />
                      {formatCount(c.likes)}
                    </span>
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
    </div>
  );
}
