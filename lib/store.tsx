"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  DM_REPLIES,
  SEED_CONVERSATIONS,
  SEED_NOTIFICATIONS,
  SEED_POSTS,
  SEED_USERS,
} from "./seed";
import { isCloud, supabase } from "./supabase";
import type { Comment, Conversation, Notification, Post, User } from "./types";

export type Me = {
  handle: string;
  name: string;
  bio: string;
  gradient: number;
};

type SignUpResult = { error?: string; needsConfirmation?: boolean };

type AppState = {
  ready: boolean;
  mode: "demo" | "cloud";
  me: Me;
  onboarded: boolean;
  posts: Post[];
  users: User[];
  conversations: Conversation[];
  notifications: Notification[];
  likedPosts: string[];
  savedPosts: string[];
  following: string[];
  completeOnboarding: (me: Me) => void;
  updateProfile: (me: Me) => void;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  toggleFollow: (handle: string) => void;
  addComment: (postId: string, text: string) => void;
  addPost: (post: Omit<Post, "id" | "likes" | "shares" | "comments">) => void;
  deletePost: (postId: string) => void;
  sendMessage: (withHandle: string, text: string) => void;
  markNotificationsRead: () => void;
  getUser: (handle: string) => User | undefined;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (
    email: string,
    password: string,
    profile: Omit<Me, "bio">,
  ) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
};

const STORAGE_KEY = "tiklive:v1";
const NOTIF_READ_KEY = "tiklive:notif-read-at";
const PENDING_PROFILE_KEY = "tiklive:pending-profile";

const DEFAULT_ME: Me = {
  handle: "moi",
  name: "Mon compte",
  bio: "Bienvenue sur mon profil ✨",
  gradient: 4,
};

type Persisted = {
  me: Me;
  onboarded: boolean;
  likedPosts: string[];
  savedPosts: string[];
  following: string[];
  myPosts: Post[];
  myComments: Record<string, Comment[]>;
  conversations: Conversation[];
  notificationsRead: boolean;
};

// ---------- Types des lignes en base (mode cloud) ----------

type ProfileRow = {
  id: string;
  handle: string;
  name: string;
  bio: string;
  gradient: number;
  verified: boolean;
};

type PostRow = {
  id: string;
  author: string;
  type: "video" | "photo";
  src: string;
  poster: string | null;
  caption: string;
  hashtags: string[];
  music: string | null;
  created_at: string;
};

type CommentRow = {
  id: string;
  post_id: string;
  author: string;
  text: string;
  created_at: string;
};

type LikeRow = { user_id: string; post_id: string; created_at: string };
type FollowRow = {
  follower: string;
  followee_handle: string;
  created_at: string;
};
type MessageRow = {
  id: string;
  sender: string;
  sender_handle: string;
  recipient_handle: string;
  text: string;
  created_at: string;
};

const AppContext = createContext<AppState | null>(null);

function loadPersisted(): Persisted | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Persisted) : null;
  } catch {
    return null;
  }
}

function timeAgo(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "à l'instant";
  if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
  if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
  return `il y a ${Math.floor(s / 86400)} j`;
}

function clockTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "Email ou mot de passe incorrect.";
  if (m.includes("already registered"))
    return "Un compte existe déjà avec cet email.";
  if (m.includes("password") && m.includes("6"))
    return "Le mot de passe doit contenir au moins 6 caractères.";
  if (m.includes("email not confirmed"))
    return "Confirme d'abord ton email (vérifie ta boîte de réception).";
  if (m.includes("rate limit"))
    return "Trop de tentatives, réessaie dans quelques minutes.";
  return message;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [me, setMe] = useState<Me>(DEFAULT_ME);
  const [onboarded, setOnboarded] = useState(false);

  // ---------- État du mode démo (localStorage) ----------
  const [likedPostsLocal, setLikedPostsLocal] = useState<string[]>([]);
  const [savedPostsLocal, setSavedPostsLocal] = useState<string[]>([]);
  const [followingLocal, setFollowingLocal] = useState<string[]>([]);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [myComments, setMyComments] = useState<Record<string, Comment[]>>({});
  const [conversationsLocal, setConversationsLocal] =
    useState<Conversation[]>(SEED_CONVERSATIONS);
  const [notificationsRead, setNotificationsRead] = useState(false);

  // ---------- État du mode cloud (Supabase) ----------
  const [userId, setUserId] = useState<string | null>(null);
  const [dbProfiles, setDbProfiles] = useState<ProfileRow[]>([]);
  const [dbPosts, setDbPosts] = useState<PostRow[]>([]);
  const [dbComments, setDbComments] = useState<CommentRow[]>([]);
  const [dbLikes, setDbLikes] = useState<LikeRow[]>([]);
  const [dbSaves, setDbSaves] = useState<string[]>([]);
  const [dbFollows, setDbFollows] = useState<FollowRow[]>([]);
  const [dbMessages, setDbMessages] = useState<MessageRow[]>([]);
  const [notifReadAt, setNotifReadAt] = useState<string>("");
  const userIdRef = useRef<string | null>(null);
  userIdRef.current = userId;

  const fetchAll = useCallback(async (uid: string) => {
    if (!supabase) return;
    const [profiles, posts, comments, likes, saves, follows, messages] =
      await Promise.all([
        supabase.from("profiles").select("*"),
        supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("comments")
          .select("*")
          .order("created_at", { ascending: true }),
        supabase.from("likes").select("*"),
        supabase.from("saves").select("post_id").eq("user_id", uid),
        supabase.from("follows").select("*"),
        supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: true }),
      ]);
    setDbProfiles((profiles.data as ProfileRow[]) ?? []);
    setDbPosts((posts.data as PostRow[]) ?? []);
    setDbComments((comments.data as CommentRow[]) ?? []);
    setDbLikes((likes.data as LikeRow[]) ?? []);
    setDbSaves(
      ((saves.data as { post_id: string }[]) ?? []).map((s) => s.post_id),
    );
    setDbFollows((follows.data as FollowRow[]) ?? []);
    setDbMessages((messages.data as MessageRow[]) ?? []);
  }, []);

  const ensureProfile = useCallback(
    async (uid: string, email: string | undefined) => {
      if (!supabase) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .maybeSingle();
      if (data) {
        const p = data as ProfileRow;
        setMe({
          handle: p.handle,
          name: p.name,
          bio: p.bio,
          gradient: p.gradient,
        });
        return;
      }
      // Pas encore de profil : on le crée à partir des infos d'inscription
      // (ou de l'email si elles ont été perdues).
      let pending: Omit<Me, "bio"> | null = null;
      try {
        const raw = window.localStorage.getItem(PENDING_PROFILE_KEY);
        pending = raw ? JSON.parse(raw) : null;
      } catch {
        pending = null;
      }
      const base =
        pending?.handle ||
        (email ?? "moi").split("@")[0].toLowerCase().replace(/[^a-z0-9._]/g, "") ||
        "moi";
      const profile = {
        id: uid,
        handle: base,
        name: pending?.name || base,
        bio: "Bienvenue sur mon profil ✨",
        gradient: pending?.gradient ?? 4,
      };
      let { error } = await supabase.from("profiles").insert(profile);
      if (error && error.code === "23505") {
        // Nom d'utilisateur déjà pris : on ajoute un suffixe.
        profile.handle = `${base.slice(0, 19)}.${Math.floor(1000 + Math.random() * 9000)}`;
        ({ error } = await supabase.from("profiles").insert(profile));
      }
      if (!error) {
        try {
          window.localStorage.removeItem(PENDING_PROFILE_KEY);
        } catch {
          // ignoré
        }
        setMe({
          handle: profile.handle,
          name: profile.name,
          bio: profile.bio,
          gradient: profile.gradient,
        });
      }
    },
    [],
  );

  // ---------- Initialisation ----------
  useEffect(() => {
    if (!supabase) {
      // Mode démo : restauration depuis le stockage local.
      const saved = loadPersisted();
      if (saved) {
        setMe(saved.me ?? DEFAULT_ME);
        setOnboarded(saved.onboarded ?? false);
        setLikedPostsLocal(saved.likedPosts ?? []);
        setSavedPostsLocal(saved.savedPosts ?? []);
        setFollowingLocal(saved.following ?? []);
        setMyPosts(saved.myPosts ?? []);
        setMyComments(saved.myComments ?? {});
        setConversationsLocal(saved.conversations ?? SEED_CONVERSATIONS);
        setNotificationsRead(saved.notificationsRead ?? false);
      }
      setReady(true);
      return;
    }

    try {
      setNotifReadAt(window.localStorage.getItem(NOTIF_READ_KEY) ?? "");
    } catch {
      // ignoré
    }

    let cancelled = false;
    const init = async (uid: string | null, email?: string) => {
      if (cancelled) return;
      if (uid) {
        await ensureProfile(uid, email);
        await fetchAll(uid);
        if (cancelled) return;
        setUserId(uid);
        setOnboarded(true);
      } else {
        setUserId(null);
        setOnboarded(false);
      }
      setReady(true);
    };

    supabase.auth.getSession().then(({ data }) => {
      void init(data.session?.user.id ?? null, data.session?.user.email);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session && session.user.id !== userIdRef.current) {
        void init(session.user.id, session.user.email);
      }
      if (event === "SIGNED_OUT") {
        setUserId(null);
        setOnboarded(false);
        setMe(DEFAULT_ME);
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [ensureProfile, fetchAll]);

  // Rafraîchissement en temps réel : quand d'autres utilisateurs publient,
  // commentent ou envoient des messages, on recharge les données.
  useEffect(() => {
    if (!supabase || !userId) return;
    const sb = supabase;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const refresh = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => void fetchAll(userId), 800);
    };
    const channel = sb
      .channel("tiklive-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "likes" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "follows" }, refresh)
      .subscribe();
    return () => {
      if (timer) clearTimeout(timer);
      void sb.removeChannel(channel);
    };
  }, [userId, fetchAll]);

  // ---------- Persistance du mode démo ----------
  useEffect(() => {
    if (!ready || isCloud) return;
    const data: Persisted = {
      me,
      onboarded,
      likedPosts: likedPostsLocal,
      savedPosts: savedPostsLocal,
      following: followingLocal,
      myPosts,
      myComments,
      conversations: conversationsLocal,
      notificationsRead,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // stockage plein ou indisponible : l'app reste utilisable sans persistance
    }
  }, [
    ready,
    me,
    onboarded,
    likedPostsLocal,
    savedPostsLocal,
    followingLocal,
    myPosts,
    myComments,
    conversationsLocal,
    notificationsRead,
  ]);

  // ---------- Données dérivées ----------

  const profilesById = useMemo(() => {
    const map = new Map<string, ProfileRow>();
    for (const p of dbProfiles) map.set(p.id, p);
    return map;
  }, [dbProfiles]);

  const likedPosts = useMemo(
    () =>
      isCloud
        ? dbLikes.filter((l) => l.user_id === userId).map((l) => l.post_id)
        : likedPostsLocal,
    [dbLikes, userId, likedPostsLocal],
  );

  const savedPosts = isCloud ? dbSaves : savedPostsLocal;

  const following = useMemo(
    () =>
      isCloud
        ? dbFollows
            .filter((f) => f.follower === userId)
            .map((f) => f.followee_handle)
        : followingLocal,
    [dbFollows, userId, followingLocal],
  );

  const posts = useMemo<Post[]>(() => {
    if (!isCloud) {
      const seeded = SEED_POSTS.map((p) => {
        const extra = myComments[p.id];
        return extra ? { ...p, comments: [...p.comments, ...extra] } : p;
      });
      const mine = myPosts.map((p) => {
        const extra = myComments[p.id];
        return extra ? { ...p, comments: [...p.comments, ...extra] } : p;
      });
      return [...mine, ...seeded];
    }

    // Les compteurs de "j'aime" excluent le mien : l'interface ajoute +1
    // quand le post est aimé.
    const likeCount = (postId: string) =>
      dbLikes.filter((l) => l.post_id === postId && l.user_id !== userId)
        .length;
    const commentsFor = (postId: string): Comment[] =>
      dbComments
        .filter((c) => c.post_id === postId)
        .map((c) => ({
          id: c.id,
          author: profilesById.get(c.author)?.handle ?? "compte.supprimé",
          text: c.text,
          likes: 0,
          time: timeAgo(c.created_at),
        }));

    const real: Post[] = dbPosts.map((p) => ({
      id: p.id,
      author: profilesById.get(p.author)?.handle ?? "compte.supprimé",
      type: p.type,
      src: p.src,
      poster: p.poster ?? undefined,
      caption: p.caption,
      hashtags: p.hashtags ?? [],
      music: p.music ?? undefined,
      likes: likeCount(p.id),
      shares: 0,
      comments: commentsFor(p.id),
    }));
    const seeded: Post[] = SEED_POSTS.map((p) => ({
      ...p,
      likes: p.likes + likeCount(p.id),
      comments: [...p.comments, ...commentsFor(p.id)],
    }));
    return [...real, ...seeded];
  }, [myPosts, myComments, dbPosts, dbComments, dbLikes, profilesById, userId]);

  const users = useMemo<User[]>(() => {
    const meAsUser: User = {
      handle: me.handle,
      name: me.name,
      bio: me.bio,
      gradient: me.gradient,
      followers: isCloud
        ? dbFollows.filter((f) => f.followee_handle === me.handle).length
        : 42,
      following: following.length,
    };
    if (!isCloud) return [meAsUser, ...SEED_USERS];

    // Les compteurs d'abonnés excluent mon propre abonnement : l'interface
    // ajoute +1 quand je suis le compte.
    const followerCount = (handle: string) =>
      dbFollows.filter(
        (f) => f.followee_handle === handle && f.follower !== userId,
      ).length;
    const others: User[] = dbProfiles
      .filter((p) => p.id !== userId)
      .map((p) => ({
        handle: p.handle,
        name: p.name,
        bio: p.bio,
        gradient: p.gradient,
        verified: p.verified,
        followers: followerCount(p.handle),
        following: dbFollows.filter((f) => f.follower === p.id).length,
      }));
    const seeds: User[] = SEED_USERS.map((u) => ({
      ...u,
      followers: u.followers + followerCount(u.handle),
    }));
    return [meAsUser, ...others, ...seeds];
  }, [me, following.length, dbProfiles, dbFollows, userId]);

  const conversations = useMemo<Conversation[]>(() => {
    if (!isCloud) return conversationsLocal;
    const byHandle = new Map<string, Conversation>();
    for (const m of dbMessages) {
      const other = m.sender === userId ? m.recipient_handle : m.sender_handle;
      let conv = byHandle.get(other);
      if (!conv) {
        conv = { id: `conv-${other}`, with: other, messages: [] };
        byHandle.set(other, conv);
      }
      conv.messages.push({
        id: m.id,
        from: m.sender === userId ? "me" : other,
        text: m.text,
        time: clockTime(m.created_at),
      });
    }
    return [...byHandle.values()].reverse();
  }, [conversationsLocal, dbMessages, userId]);

  const notifications = useMemo<Notification[]>(() => {
    if (!isCloud)
      return SEED_NOTIFICATIONS.map((n) => ({ ...n, read: notificationsRead }));

    const myPostIds = new Set(
      dbPosts.filter((p) => p.author === userId).map((p) => p.id),
    );
    const handleOf = (uuid: string) =>
      profilesById.get(uuid)?.handle ?? "quelqu'un";
    const items: (Notification & { at: string })[] = [];
    for (const l of dbLikes) {
      if (l.user_id !== userId && myPostIds.has(l.post_id)) {
        items.push({
          id: `nl-${l.user_id}-${l.post_id}`,
          kind: "like",
          from: handleOf(l.user_id),
          text: "a aimé ta publication",
          time: timeAgo(l.created_at),
          at: l.created_at,
        });
      }
    }
    for (const c of dbComments) {
      if (c.author !== userId && myPostIds.has(c.post_id)) {
        items.push({
          id: `nc-${c.id}`,
          kind: "comment",
          from: handleOf(c.author),
          text: `a commenté : « ${c.text.slice(0, 60)} »`,
          time: timeAgo(c.created_at),
          at: c.created_at,
        });
      }
    }
    for (const f of dbFollows) {
      if (f.followee_handle === me.handle && f.follower !== userId) {
        items.push({
          id: `nf-${f.follower}`,
          kind: "follow",
          from: handleOf(f.follower),
          text: "s'est abonné(e) à ton compte",
          time: timeAgo(f.created_at),
          at: f.created_at,
        });
      }
    }
    items.sort((a, b) => (a.at < b.at ? 1 : -1));
    return items.slice(0, 50).map(({ at, ...n }) => ({
      ...n,
      read: notifReadAt ? at <= notifReadAt : false,
    }));
  }, [
    notificationsRead,
    dbPosts,
    dbLikes,
    dbComments,
    dbFollows,
    profilesById,
    userId,
    me.handle,
    notifReadAt,
  ]);

  // ---------- Authentification (mode cloud) ----------

  const signIn = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      if (!supabase) return "Mode démo : pas de connexion nécessaire.";
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return error ? translateAuthError(error.message) : null;
    },
    [],
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      profile: Omit<Me, "bio">,
    ): Promise<SignUpResult> => {
      if (!supabase) return { error: "Mode démo : pas d'inscription." };
      const { data: taken } = await supabase
        .from("profiles")
        .select("handle")
        .eq("handle", profile.handle)
        .maybeSingle();
      if (taken) return { error: "Ce nom d'utilisateur est déjà pris." };
      try {
        window.localStorage.setItem(
          PENDING_PROFILE_KEY,
          JSON.stringify(profile),
        );
      } catch {
        // ignoré
      }
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { error: translateAuthError(error.message) };
      if (!data.session) return { needsConfirmation: true };
      return {};
    },
    [],
  );

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
  }, []);

  // ---------- Actions ----------

  const completeOnboarding = useCallback((profile: Me) => {
    setMe(profile);
    setOnboarded(true);
  }, []);

  const updateProfile = useCallback(
    (profile: Me) => {
      if (isCloud && userId && supabase) {
        // Le nom d'utilisateur est immuable en mode cloud (les abonnements
        // et messages y sont rattachés).
        const next = { ...profile, handle: me.handle };
        setMe(next);
        void supabase
          .from("profiles")
          .update({
            name: next.name,
            bio: next.bio,
            gradient: next.gradient,
          })
          .eq("id", userId);
        return;
      }
      setMe(profile);
    },
    [userId, me.handle],
  );

  const toggleLike = useCallback(
    (postId: string) => {
      if (isCloud && userId && supabase) {
        const liked = dbLikes.some(
          (l) => l.user_id === userId && l.post_id === postId,
        );
        if (liked) {
          setDbLikes((prev) =>
            prev.filter(
              (l) => !(l.user_id === userId && l.post_id === postId),
            ),
          );
          void supabase
            .from("likes")
            .delete()
            .eq("user_id", userId)
            .eq("post_id", postId);
        } else {
          setDbLikes((prev) => [
            ...prev,
            {
              user_id: userId,
              post_id: postId,
              created_at: new Date().toISOString(),
            },
          ]);
          void supabase
            .from("likes")
            .insert({ user_id: userId, post_id: postId });
        }
        return;
      }
      setLikedPostsLocal((prev) =>
        prev.includes(postId)
          ? prev.filter((id) => id !== postId)
          : [...prev, postId],
      );
    },
    [userId, dbLikes],
  );

  const toggleSave = useCallback(
    (postId: string) => {
      if (isCloud && userId && supabase) {
        if (dbSaves.includes(postId)) {
          setDbSaves((prev) => prev.filter((id) => id !== postId));
          void supabase
            .from("saves")
            .delete()
            .eq("user_id", userId)
            .eq("post_id", postId);
        } else {
          setDbSaves((prev) => [...prev, postId]);
          void supabase
            .from("saves")
            .insert({ user_id: userId, post_id: postId });
        }
        return;
      }
      setSavedPostsLocal((prev) =>
        prev.includes(postId)
          ? prev.filter((id) => id !== postId)
          : [...prev, postId],
      );
    },
    [userId, dbSaves],
  );

  const toggleFollow = useCallback(
    (handle: string) => {
      if (isCloud && userId && supabase) {
        const followed = dbFollows.some(
          (f) => f.follower === userId && f.followee_handle === handle,
        );
        if (followed) {
          setDbFollows((prev) =>
            prev.filter(
              (f) => !(f.follower === userId && f.followee_handle === handle),
            ),
          );
          void supabase
            .from("follows")
            .delete()
            .eq("follower", userId)
            .eq("followee_handle", handle);
        } else {
          setDbFollows((prev) => [
            ...prev,
            {
              follower: userId,
              followee_handle: handle,
              created_at: new Date().toISOString(),
            },
          ]);
          void supabase
            .from("follows")
            .insert({ follower: userId, followee_handle: handle });
        }
        return;
      }
      setFollowingLocal((prev) =>
        prev.includes(handle)
          ? prev.filter((h) => h !== handle)
          : [...prev, handle],
      );
    },
    [userId, dbFollows],
  );

  const addComment = useCallback(
    (postId: string, text: string) => {
      if (isCloud && userId && supabase) {
        const optimistic: CommentRow = {
          id: `tmp-${Date.now()}`,
          post_id: postId,
          author: userId,
          text,
          created_at: new Date().toISOString(),
        };
        setDbComments((prev) => [...prev, optimistic]);
        void supabase
          .from("comments")
          .insert({ post_id: postId, author: userId, text })
          .select()
          .single()
          .then(({ data }) => {
            if (data) {
              setDbComments((prev) =>
                prev.map((c) => (c.id === optimistic.id ? (data as CommentRow) : c)),
              );
            }
          });
        return;
      }
      const comment: Comment = {
        id: `mc-${Date.now()}`,
        author: me.handle,
        text,
        likes: 0,
        time: "à l'instant",
      };
      setMyComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] ?? []), comment],
      }));
    },
    [me.handle, userId],
  );

  const addPost = useCallback(
    (post: Omit<Post, "id" | "likes" | "shares" | "comments">) => {
      if (isCloud && userId && supabase) {
        const sb = supabase;
        const uid = userId;
        void (async () => {
          let src = post.src;
          // Les photos arrivent en data URL : on les téléverse dans le
          // bucket "media" pour ne stocker qu'une URL publique en base.
          if (src.startsWith("data:")) {
            const blob = await (await fetch(src)).blob();
            const ext = blob.type.split("/")[1]?.split("+")[0] || "png";
            const path = `${uid}/${Date.now()}.${ext}`;
            const { error: upErr } = await sb.storage
              .from("media")
              .upload(path, blob, { contentType: blob.type });
            if (upErr) {
              console.error("Échec du téléversement :", upErr.message);
              return;
            }
            src = sb.storage.from("media").getPublicUrl(path).data.publicUrl;
          }
          const { data } = await sb
            .from("posts")
            .insert({
              author: uid,
              type: post.type,
              src,
              poster: post.poster ?? null,
              caption: post.caption,
              hashtags: post.hashtags,
              music: post.music ?? null,
            })
            .select()
            .single();
          if (data) setDbPosts((prev) => [data as PostRow, ...prev]);
        })();
        return;
      }
      const full: Post = {
        ...post,
        id: `my-${Date.now()}`,
        likes: 0,
        shares: 0,
        comments: [],
      };
      setMyPosts((prev) => [full, ...prev]);
    },
    [userId],
  );

  const deletePost = useCallback(
    (postId: string) => {
      if (isCloud && userId && supabase) {
        setDbPosts((prev) => prev.filter((p) => p.id !== postId));
        setDbSaves((prev) => prev.filter((id) => id !== postId));
        setDbLikes((prev) => prev.filter((l) => l.post_id !== postId));
        setDbComments((prev) => prev.filter((c) => c.post_id !== postId));
        const sb = supabase;
        void (async () => {
          await sb.from("posts").delete().eq("id", postId);
          await sb.from("likes").delete().eq("post_id", postId).eq("user_id", userId);
          await sb.from("saves").delete().eq("post_id", postId).eq("user_id", userId);
        })();
        return;
      }
      setMyPosts((prev) => prev.filter((p) => p.id !== postId));
      setMyComments((prev) => {
        if (!(postId in prev)) return prev;
        const next = { ...prev };
        delete next[postId];
        return next;
      });
      setLikedPostsLocal((prev) => prev.filter((id) => id !== postId));
      setSavedPostsLocal((prev) => prev.filter((id) => id !== postId));
    },
    [userId],
  );

  const sendMessage = useCallback(
    (withHandle: string, text: string) => {
      if (isCloud && userId && supabase) {
        const optimistic: MessageRow = {
          id: `tmp-${Date.now()}`,
          sender: userId,
          sender_handle: me.handle,
          recipient_handle: withHandle,
          text,
          created_at: new Date().toISOString(),
        };
        setDbMessages((prev) => [...prev, optimistic]);
        void supabase
          .from("messages")
          .insert({
            sender: userId,
            sender_handle: me.handle,
            recipient_handle: withHandle,
            text,
          })
          .select()
          .single()
          .then(({ data }) => {
            if (data) {
              setDbMessages((prev) =>
                prev.map((m) => (m.id === optimistic.id ? (data as MessageRow) : m)),
              );
            }
          });
        return;
      }
      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      const msg = { id: `msg-${Date.now()}`, from: "me", text, time };
      setConversationsLocal((prev) => {
        const existing = prev.find((c) => c.with === withHandle);
        if (existing) {
          return prev.map((c) =>
            c.with === withHandle ? { ...c, messages: [...c.messages, msg] } : c,
          );
        }
        return [
          { id: `conv-${Date.now()}`, with: withHandle, messages: [msg] },
          ...prev,
        ];
      });
      // Réponse simulée de l'interlocuteur après un court délai.
      const reply = DM_REPLIES[Math.floor(Math.random() * DM_REPLIES.length)];
      setTimeout(() => {
        const t = new Date();
        const rTime = `${t.getHours().toString().padStart(2, "0")}:${t
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
        setConversationsLocal((prev) =>
          prev.map((c) =>
            c.with === withHandle
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    {
                      id: `msg-${Date.now()}-r`,
                      from: withHandle,
                      text: reply,
                      time: rTime,
                    },
                  ],
                }
              : c,
          ),
        );
      }, 1500 + Math.random() * 2000);
    },
    [userId, me.handle],
  );

  const markNotificationsRead = useCallback(() => {
    if (isCloud) {
      const now = new Date().toISOString();
      setNotifReadAt(now);
      try {
        window.localStorage.setItem(NOTIF_READ_KEY, now);
      } catch {
        // ignoré
      }
      return;
    }
    setNotificationsRead(true);
  }, []);

  const getUser = useCallback(
    (handle: string) => users.find((u) => u.handle === handle),
    [users],
  );

  const value: AppState = {
    ready,
    mode: isCloud ? "cloud" : "demo",
    me,
    onboarded,
    posts,
    users,
    conversations,
    notifications,
    likedPosts,
    savedPosts,
    following,
    completeOnboarding,
    updateProfile,
    toggleLike,
    toggleSave,
    toggleFollow,
    addComment,
    addPost,
    deletePost,
    sendMessage,
    markNotificationsRead,
    getUser,
    signIn,
    signUp,
    signOut,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp doit être utilisé dans <AppProvider>");
  return ctx;
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".", ",")} M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(".", ",")} k`;
  return String(n);
}
