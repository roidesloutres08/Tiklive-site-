"use client";

import Link from "next/link";
import { useState } from "react";
import { UsersRound } from "lucide-react";
import CommentsDrawer from "@/components/CommentsDrawer";
import FeedCard from "@/components/FeedCard";
import { useApp } from "@/lib/store";
import type { Post } from "@/lib/types";

export default function ForYouPage() {
  const { posts, following, me } = useApp();
  const [commentsFor, setCommentsFor] = useState<string | null>(null);
  const [tab, setTab] = useState<"foryou" | "following">("foryou");

  const shownPosts =
    tab === "foryou"
      ? posts
      : posts.filter(
          (p) => following.includes(p.author) || p.author === me.handle,
        );

  const openPost: Post | undefined = posts.find((p) => p.id === commentsFor);

  return (
    <>
      <div className="feed-tabs">
        <button
          className={tab === "foryou" ? "active" : ""}
          onClick={() => setTab("foryou")}
        >
          Pour toi
        </button>
        <button
          className={tab === "following" ? "active" : ""}
          onClick={() => setTab("following")}
        >
          Abonnements
        </button>
      </div>
      <div className="feed">
        {shownPosts.length === 0 ? (
          <div className="feed-empty">
            <div className="empty-state">
              <span className="empty-icon">
                <UsersRound size={40} />
              </span>
              Tu ne suis encore personne.
              <br />
              Les publications de tes créateurs préférés apparaîtront ici.
              <br />
              <Link href="/explore" style={{ color: "var(--cyan)" }}>
                Découvrir des créateurs
              </Link>
            </div>
          </div>
        ) : (
          shownPosts.map((post) => (
            <FeedCard
              key={post.id}
              post={post}
              onOpenComments={(p) => setCommentsFor(p.id)}
            />
          ))
        )}
      </div>
      {openPost && (
        <CommentsDrawer post={openPost} onClose={() => setCommentsFor(null)} />
      )}
    </>
  );
}
