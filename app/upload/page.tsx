"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Camera, Clapperboard, ImagePlus, Music } from "lucide-react";
import { useApp } from "@/lib/store";

export default function UploadPage() {
  const { addPost, me } = useApp();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState<"photo" | "video">("photo");
  const [src, setSrc] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [music, setMusic] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choisis un fichier image (JPG, PNG, WebP…).");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Image trop lourde (4 Mo max pour la démo).");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const publish = () => {
    const finalSrc = type === "photo" ? src : videoUrl.trim();
    if (!finalSrc) {
      setError(
        type === "photo"
          ? "Ajoute une photo avant de publier."
          : "Indique l'URL d'une vidéo (fichier .mp4).",
      );
      return;
    }
    const tags = hashtags
      .split(/[#,\s]+/)
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 8);
    addPost({
      author: me.handle,
      type,
      src: finalSrc,
      caption: caption.trim() || "Nouvelle publication ✨",
      hashtags: tags.length ? tags : ["pourtoi"],
      music: type === "video" ? music.trim() || undefined : undefined,
    });
    router.push("/");
  };

  return (
    <div className="page">
      <h1 className="page-title">Publier</h1>
      <div className="upload-card">
        <label className="field-label" style={{ marginTop: 0 }}>
          Type de contenu
        </label>
        <div className="type-toggle">
          <button
            className={type === "photo" ? "active" : ""}
            onClick={() => setType("photo")}
          >
            <Camera size={17} />
            Photo
          </button>
          <button
            className={type === "video" ? "active" : ""}
            onClick={() => setType("video")}
          >
            <Clapperboard size={17} />
            Vidéo
          </button>
        </div>

        {type === "photo" ? (
          <>
            <label className="field-label">Ta photo</label>
            <div className="dropzone" onClick={() => fileRef.current?.click()}>
              <ImagePlus size={34} style={{ marginBottom: 8 }} />
              <br />
              Clique pour choisir une image
              <br />
              JPG, PNG ou WebP — 4 Mo max
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            {src && (
              <div className="upload-preview">
                <img src={src} alt="Aperçu" />
              </div>
            )}
          </>
        ) : (
          <>
            <label className="field-label">URL de la vidéo (.mp4)</label>
            <input
              className="field-input"
              placeholder="https://exemple.com/ma-video.mp4"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            {videoUrl.trim() && (
              <div className="upload-preview">
                <video src={videoUrl.trim()} controls muted />
              </div>
            )}
            <label className="field-label">
              <Music size={13} style={{ verticalAlign: "-2px", marginRight: 5 }} />
              Musique (facultatif)
            </label>
            <input
              className="field-input"
              placeholder="ex. Son original — mon.compte"
              value={music}
              onChange={(e) => setMusic(e.target.value)}
            />
          </>
        )}

        <label className="field-label">Légende</label>
        <textarea
          className="field-textarea"
          placeholder="Décris ta publication…"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={300}
        />

        <label className="field-label">Hashtags</label>
        <input
          className="field-input"
          placeholder="#pourtoi #danse #fun"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
        />

        {error && (
          <p style={{ color: "var(--accent)", marginTop: 14, fontSize: 14 }}>
            {error}
          </p>
        )}

        <button
          className="btn btn-primary"
          style={{ width: "100%", marginTop: 24, padding: 14, fontSize: 15 }}
          onClick={publish}
        >
          Publier maintenant
        </button>
      </div>
    </div>
  );
}
