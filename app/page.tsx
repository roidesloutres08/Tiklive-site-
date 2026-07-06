"use client";

import { useState } from "react";
import CommentsDrawer from "@/components/CommentsDrawer";
import FeedCard from "@/components/FeedCard";
import { useApp } from "@/lib/store";
import type { Post } from "@/lib/types";

export default function ForYouPage() {
  const { posts } = useApp();
  const [commentsFor, setCommentsFor] = useState<string | null>(null);

  const openPost: Post | undefined = posts.find((p) => p.id === commentsFor);

  return (
    <>
      <div className="feed">
        {posts.map((post) => (
          <FeedCard
            key={post.id}
            post={post}
            onOpenComments={(p) => setCommentsFor(p.id)}
          />
        ))}
      </div>
      {openPost && (
        <CommentsDrawer post={openPost} onClose={() => setCommentsFor(null)} />
      )}
    </>
  );
}
