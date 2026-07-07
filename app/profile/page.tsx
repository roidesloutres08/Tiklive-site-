"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  BadgeCheck,
  Camera,
  Heart,
  Inbox,
  MessageCircle,
  Pencil,
  Play,
  SquarePlus,
  UserX,
} from "lucide-react";
import Avatar from "@/components/Avatar";
import { GRADIENTS } from "@/lib/seed";
import { formatCount, useApp } from "@/lib/store";

function EditProfileModal({ onClose }: { onClose: () => void }) {
  const { me, updateProfile } = useApp();
  const [name, setName] = useState(me.name);
  const [handle, setHandle] = useState(me.handle);
  const [bio, setBio] = useState(me.bio);
  const [gradient, setGradient] = useState(me.gradient);

  const save = () => {
    updateProfile({
      name: name.trim() || me.name,
      handle:
        handle.trim().toLowerCase().replace(/[^a-z0-9._]/g, "") || me.handle,
      bio: bio.trim(),
      gradient,
    });
    onClose();
  };

  return (
    <div className="onboarding-backdrop" onClick={onClose}>
      <div className="onboarding-card" onClick={(e) => e.stopPropagation()}>
        <div className="onboarding-title">Modifier le profil</div>
        <label className="field-label">Nom</label>
        <input
          className="field-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
        />
        <label className="field-label">Nom d&apos;utilisateur</label>
        <input
          className="field-input"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          maxLength={24}
        />
        <label className="field-label">Bio</label>
        <textarea
          className="field-textarea"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={160}
        />
        <label className="field-label">Couleur d&apos;avatar</label>
        <div className="gradient-picker">
          {GRADIENTS.map((g, i) => (
            <button
              key={i}
              className={`gradient-swatch${i === gradient ? " active" : ""}`}
              style={{ background: g }}
              onClick={() => setGradient(i)}
              aria-label={`Couleur ${i + 1}`}
            />
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button
            className="btn btn-outline"
            style={{ flex: 1 }}
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={save}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { me, users, posts, likedPosts, savedPosts, following, toggleFollow } =
    useApp();

  const handle = params.get("u") ?? me.handle;
  const isMe = handle === me.handle;
  const user = users.find((u) => u.handle === handle);
  const [tab, setTab] = useState<"posts" | "liked" | "saved">("posts");
  const [editing, setEditing] = useState(false);

  if (!user) {
    return (
      <div className="page">
        <div className="empty-state">
          <span className="empty-icon">
            <UserX size={40} />
          </span>
          Ce compte n&apos;existe pas.
          <br />
          <Link href="/explore" style={{ color: "var(--cyan)" }}>
            Découvrir des créateurs
          </Link>
        </div>
      </div>
    );
  }

  const userPosts = posts.filter((p) => p.author === handle);
  const liked = posts.filter((p) => likedPosts.includes(p.id));
  const saved = posts.filter((p) => savedPosts.includes(p.id));
  const isFollowing = following.includes(handle);
  const followerCount = user.followers + (isFollowing && !isMe ? 1 : 0);

  const shownPosts =
    tab === "posts" ? userPosts : tab === "liked" ? liked : saved;

  return (
    <div className="page">
      <div className="profile-header">
        <Avatar name={user.name} gradient={user.gradient} size={110} />
        <div className="profile-identity">
          <div className="profile-name">
            {user.name}{" "}
            {user.verified && (
              <BadgeCheck
                size={20}
                className="verified"
                fill="var(--cyan)"
                stroke="var(--bg)"
              />
            )}
          </div>
          <div className="profile-handle">@{user.handle}</div>
          <div className="profile-bio">{user.bio}</div>
          <div className="profile-stats">
            <div className="stat">
              <div className="stat-value">{formatCount(user.following)}</div>
              <div className="stat-label">Abonnements</div>
            </div>
            <div className="stat">
              <div className="stat-value">{formatCount(followerCount)}</div>
              <div className="stat-label">Abonnés</div>
            </div>
            <div className="stat">
              <div className="stat-value">
                {formatCount(userPosts.reduce((sum, p) => sum + p.likes, 0))}
              </div>
              <div className="stat-label">J&apos;aime</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {isMe ? (
              <>
                <button
                  className="btn btn-outline btn-icon-text"
                  onClick={() => setEditing(true)}
                >
                  <Pencil size={15} />
                  Modifier le profil
                </button>
                <Link href="/upload" className="btn btn-primary btn-icon-text">
                  <SquarePlus size={15} />
                  Publier
                </Link>
              </>
            ) : (
              <>
                <button
                  className={`btn ${isFollowing ? "btn-following" : "btn-primary"}`}
                  onClick={() => toggleFollow(handle)}
                >
                  {isFollowing ? "Abonné(e) ✓" : "S'abonner"}
                </button>
                <button
                  className="btn btn-outline btn-icon-text"
                  onClick={() => router.push(`/messages?u=${handle}`)}
                >
                  <MessageCircle size={15} />
                  Message
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`profile-tab${tab === "posts" ? " active" : ""}`}
          onClick={() => setTab("posts")}
        >
          Publications
        </button>
        {isMe && (
          <>
            <button
              className={`profile-tab${tab === "liked" ? " active" : ""}`}
              onClick={() => setTab("liked")}
            >
              Aimés
            </button>
            <button
              className={`profile-tab${tab === "saved" ? " active" : ""}`}
              onClick={() => setTab("saved")}
            >
              Favoris
            </button>
          </>
        )}
      </div>

      {shownPosts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">
            {tab === "liked" ? <Heart size={40} /> : <Inbox size={40} />}
          </span>
          {tab === "posts"
            ? isMe
              ? "Tu n'as encore rien publié. Lance-toi !"
              : "Aucune publication pour l'instant."
            : tab === "liked"
              ? "Les publications que tu aimes apparaîtront ici."
              : "Tes favoris apparaîtront ici."}
        </div>
      ) : (
        <div className="explore-grid">
          {shownPosts.map((p) => (
            <div key={p.id} className="explore-card">
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
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.caption}
                </span>
                <span className="overlay-likes">
                  <Heart size={12} fill="currentColor" strokeWidth={0} />
                  {formatCount(p.likes)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <EditProfileModal onClose={() => setEditing(false)} />}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfileContent />
    </Suspense>
  );
}
