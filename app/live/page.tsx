"use client";

import { useState } from "react";
import { BadgeCheck, Eye } from "lucide-react";
import Avatar from "@/components/Avatar";
import LiveViewer from "@/components/LiveViewer";
import { GRADIENTS, SEED_LIVES } from "@/lib/seed";
import { formatCount, useApp } from "@/lib/store";

export default function LivePage() {
  const { getUser } = useApp();
  const [watching, setWatching] = useState<string | null>(null);

  const stream = SEED_LIVES.find((l) => l.id === watching);

  return (
    <div className="page">
      <h1 className="page-title">En direct maintenant</h1>
      <div className="live-grid">
        {SEED_LIVES.map((live) => {
          const host = getUser(live.host);
          return (
            <button
              key={live.id}
              className="live-card"
              onClick={() => setWatching(live.id)}
            >
              <div
                className="live-thumb"
                style={{
                  background: GRADIENTS[live.gradient % GRADIENTS.length],
                }}
              >
                <span className="live-badge">EN DIRECT</span>
                <span className="live-viewers">
                  <Eye size={13} />
                  {formatCount(live.viewers)}
                </span>
                <Avatar
                  name={host?.name ?? live.host}
                  gradient={host?.gradient ?? 0}
                  size={64}
                />
              </div>
              <div className="live-info">
                <div style={{ minWidth: 0 }}>
                  <div className="live-title">{live.title}</div>
                  <div className="live-host">
                    @{live.host}
                    {host?.verified && (
                      <BadgeCheck
                        size={14}
                        className="verified"
                        fill="var(--cyan)"
                        stroke="var(--bg-elevated)"
                      />
                    )}
                  </div>
                  <span className="live-category">{live.category}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {stream && (
        <LiveViewer stream={stream} onClose={() => setWatching(null)} />
      )}
    </div>
  );
}
