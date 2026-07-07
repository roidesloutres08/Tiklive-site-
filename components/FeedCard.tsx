"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  BadgeCheck,
  Bookmark,
  Check,
  Disc3,
  Heart,
  MessageCircle,
  Plus,
  Share2,
} from "lucide-react";
import { formatCount, useApp } from "@/lib/store";
import type { Post } from "@/lib/types";
import Avatar from "./Avatar";

export default function FeedCard({
  post,
  onOpenComments,
}: {
  post: Post;
  onOpenComments: (post: Post) => void;
}) {
  const {
    getUser,
    likedPosts,
    savedPosts,
    following,
    toggleLike,
    toggleSave,
    toggleFollow,
    me,
  } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shared, setShared] = useState(false);

  const author = getUser(post.author);
  const liked = likedPosts.includes(post.id);
  const saved = savedPosts.includes(post.id);
  const isFollowing = following.includes(post.author);
  const isMine = post.author === me.handle;

  // Lecture/pause automatique des vidéos selon leur visibilité à l'écran.
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const share = () => {
    setShared(true);
    setTimeout(() => setShared(false), 1500);
  };

  return (
    <div className="feed-item" ref={containerRef}>
      <div className="feed-media">
        {post.type === "video" ? (
          <video
            ref={videoRef}
            src={post.src}
            poster={post.poster}
            loop
            muted
            playsInline
            preload="metadata"
            onClick={(e) => {
              const v = e.currentTarget;
              if (v.paused) v.play().catch(() => {});
              else v.pause();
            }}
          />
        ) : (
          <img src={post.src} alt={post.caption} loading="lazy" />
        )}
        <div className="feed-overlay">
          <Link href={`/profile?u=${post.author}`} className="feed-author">
            @{post.author}
            {author?.verified && (
              <BadgeCheck size={17} className="verified" fill="var(--cyan)" stroke="#0a0a0f" />
            )}
          </Link>
          <div className="feed-caption">{post.caption}</div>
          <div className="feed-hashtags">
            {post.hashtags.map((h) => `#${h}`).join(" ")}
          </div>
          {post.music && (
            <div className="feed-music">
              <Disc3 size={16} className="music-disc" />
              {post.music}
            </div>
          )}
        </div>
      </div>

      <div className="feed-actions">
        <div className="feed-follow-avatar">
          <Link href={`/profile?u=${post.author}`}>
            <Avatar
              name={author?.name ?? post.author}
              gradient={author?.gradient ?? 0}
              size={48}
            />
          </Link>
          {!isMine && !isFollowing && (
            <button
              className="follow-plus"
              onClick={() => toggleFollow(post.author)}
              aria-label={`S'abonner à ${post.author}`}
            >
              <Plus size={13} strokeWidth={3.2} />
            </button>
          )}
        </div>
        <button className="action-btn" onClick={() => toggleLike(post.id)}>
          <span className={`action-icon${liked ? " liked" : ""}`}>
            <Heart size={24} fill={liked ? "currentColor" : "none"} />
          </span>
          {formatCount(post.likes + (liked ? 1 : 0))}
        </button>
        <button className="action-btn" onClick={() => onOpenComments(post)}>
          <span className="action-icon">
            <MessageCircle size={24} />
          </span>
          {formatCount(post.comments.length)}
        </button>
        <button className="action-btn" onClick={() => toggleSave(post.id)}>
          <span className={`action-icon${saved ? " saved" : ""}`}>
            <Bookmark size={24} fill={saved ? "currentColor" : "none"} />
          </span>
          Favoris
        </button>
        <button className="action-btn" onClick={share}>
          <span className={`action-icon${shared ? " shared" : ""}`}>
            {shared ? <Check size={24} /> : <Share2 size={24} />}
          </span>
          {shared ? "Copié !" : formatCount(post.shares)}
        </button>
      </div>
    </div>
  );
}
