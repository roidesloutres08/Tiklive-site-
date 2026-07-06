"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Avatar from "@/components/Avatar";
import { TRENDING_HASHTAGS } from "@/lib/seed";
import { formatCount, useApp } from "@/lib/store";

export default function ExplorePage() {
  const { posts, users, following, toggleFollow, me } = useApp();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

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
      <input
        className="search-bar"
        placeholder="Rechercher des vidéos, comptes, hashtags…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
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
                      {u.verified && <span className="verified">✔</span>}
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
          <span className="big">🔍</span>
          Aucun résultat pour cette recherche.
        </div>
      ) : (
        <div className="explore-grid">
          {filteredPosts.map((p) => (
            <Link key={p.id} href={`/profile?u=${p.author}`} className="explore-card">
              {p.type === "video" ? (
                <img src={p.poster ?? p.src} alt={p.caption} loading="lazy" />
              ) : (
                <img src={p.src} alt={p.caption} loading="lazy" />
              )}
              <span className="type-badge">
                {p.type === "video" ? "▶ Vidéo" : "📷 Photo"}
              </span>
              <div className="explore-card-overlay">
                <span>@{p.author}</span>
                <span>❤️ {formatCount(p.likes)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
