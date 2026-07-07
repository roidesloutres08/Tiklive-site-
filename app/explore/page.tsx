"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BadgeCheck, Camera, Heart, Play, Search, SearchX } from "lucide-react";
import Avatar from "@/components/Avatar";
import PostModal from "@/components/PostModal";
import { TRENDING_HASHTAGS } from "@/lib/seed";
import { formatCount, useApp } from "@/lib/store";

export default function ExplorePage() {
  const { posts, users, following, toggleFollow, me } = useApp();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [openPost, setOpenPost] = useState<string | null>(null);

  const q = query.trim().toLowerCase();

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (activeTag && !p.hashtags.includes(activeTag)) return false;
      if (!q) return true;
      return (
        p.caption.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.hashtags.some((h) => h.includes(q))
      );
    });
  }, [posts, q, activeTag]);

  const matchedUsers = useMemo(() => {
    if (!q) return [];
    return users.filter(
      (u) =>
        u.handle !== me.handle &&
        (u.handle.toLowerCase().includes(q) || u.name.toLowerCase().includes(q)),
    );
  }, [users, q, me.handle]);

  return (
    <div className="page">
      <h1 className="page-title">Explorer</h1>
      <div className="search-wrap">
        <Search size={18} className="search-icon" />
        <input
          className="search-bar"
          placeholder="Rechercher des vidéos, comptes, hashtags…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="hashtag-row">
        {TRENDING_HASHTAGS.map(({ tag, views }) => (
          <button
            key={tag}
            className={`hashtag-chip${activeTag === tag ? " active" : ""}`}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
          >
            #{tag}
            <span className="hashtag-views">{views} de vues</span>
          </button>
        ))}
      </div>

      {matchedUsers.length > 0 && (
        <>
          <h2 className="section-title">Comptes</h2>
          {matchedUsers.map((u) => {
            const isFollowing = following.includes(u.handle);
            return (
              <div key={u.handle} className="user-row">
                <Link href={`/profile?u=${u.handle}`}>
                  <Avatar name={u.name} gradient={u.gradient} size={44} />
                </Link>
                <div className="user-row-info">
                  <Link href={`/profile?u=${u.handle}`}>
                    <div className="user-row-name">
                      {u.name}{" "}
                      {u.verified && (
                        <BadgeCheck
                          size={15}
                          className="verified"
                          fill="var(--cyan)"
                          stroke="var(--bg)"
                        />
                      )}
                    </div>
                    <div className="user-row-sub">
                      @{u.handle} · {formatCount(u.followers)} abonnés
                    </div>
                  </Link>
                </div>
                <button
                  className={`btn ${isFollowing ? "btn-following" : "btn-primary"}`}
                  onClick={() => toggleFollow(u.handle)}
                >
                  {isFollowing ? "Abonné(e)" : "S'abonner"}
                </button>
              </div>
            );
          })}
        </>
      )}

      <h2 className="section-title">
        {activeTag ? `#${activeTag}` : "Tendances"}
      </h2>
      {filteredPosts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">
            <SearchX size={40} />
          </span>
          Aucun résultat pour cette recherche.
        </div>
      ) : (
        <div className="explore-grid">
          {filteredPosts.map((p) => (
            <button
              key={p.id}
              className="explore-card"
              onClick={() => setOpenPost(p.id)}
            >
              <img
                src={p.type === "video" ? (p.poster ?? p.src) : p.src}
                alt={p.caption}
                loading="lazy"
              />
              <span className="type-badge">
                {p.type === "video" ? (
                  <>
                    <Play size={11} fill="currentColor" strokeWidth={0} /> Vidéo
                  </>
                ) : (
                  <>
                    <Camera size={11} /> Photo
                  </>
                )}
              </span>
              <div className="explore-card-overlay">
                <span>@{p.author}</span>
                <span className="overlay-likes">
                  <Heart size={12} fill="currentColor" strokeWidth={0} />
                  {formatCount(p.likes)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {openPost && (
        <PostModal postId={openPost} onClose={() => setOpenPost(null)} />
      )}
    </div>
  );
}
