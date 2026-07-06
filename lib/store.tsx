"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
import type { Comment, Conversation, Notification, Post, User } from "./types";

export type Me = {
  handle: string;
  name: string;
  bio: string;
  gradient: number;
};

type AppState = {
  ready: boolean;
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
  sendMessage: (withHandle: string, text: string) => void;
  markNotificationsRead: () => void;
  getUser: (handle: string) => User | undefined;
};

const STORAGE_KEY = "tiklive:v1";

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

const AppContext = createContext<AppState | null>(null);

function loadPersisted(): Persisted | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Persisted) : null;
  } catch {
    return null;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [me, setMe] = useState<Me>(DEFAULT_ME);
  const [onboarded, setOnboarded] = useState(false);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [myComments, setMyComments] = useState<Record<string, Comment[]>>({});
  const [conversations, setConversations] =
    useState<Conversation[]>(SEED_CONVERSATIONS);
  const [notificationsRead, setNotificationsRead] = useState(false);

  useEffect(() => {
    const saved = loadPersisted();
    if (saved) {
      setMe(saved.me ?? DEFAULT_ME);
      setOnboarded(saved.onboarded ?? false);
      setLikedPosts(saved.likedPosts ?? []);
      setSavedPosts(saved.savedPosts ?? []);
      setFollowing(saved.following ?? []);
      setMyPosts(saved.myPosts ?? []);
      setMyComments(saved.myComments ?? {});
      setConversations(saved.conversations ?? SEED_CONVERSATIONS);
      setNotificationsRead(saved.notificationsRead ?? false);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const data: Persisted = {
      me,
      onboarded,
      likedPosts,
      savedPosts,
      following,
      myPosts,
      myComments,
      conversations,
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
    likedPosts,
    savedPosts,
    following,
    myPosts,
    myComments,
    conversations,
    notificationsRead,
  ]);

  const posts = useMemo(() => {
    const seeded = SEED_POSTS.map((p) => {
      const extra = myComments[p.id];
      return extra ? { ...p, comments: [...p.comments, ...extra] } : p;
    });
    const mine = myPosts.map((p) => {
      const extra = myComments[p.id];
      return extra ? { ...p, comments: [...p.comments, ...extra] } : p;
    });
    return [...mine, ...seeded];
  }, [myPosts, myComments]);

  const users = useMemo<User[]>(() => {
    const meAsUser: User = {
      handle: me.handle,
      name: me.name,
      bio: me.bio,
      gradient: me.gradient,
      followers: 42,
      following: following.length,
    };
    return [meAsUser, ...SEED_USERS];
  }, [me, following.length]);

  const notifications = useMemo<Notification[]>(
    () => SEED_NOTIFICATIONS.map((n) => ({ ...n, read: notificationsRead })),
    [notificationsRead],
  );

  const completeOnboarding = useCallback((profile: Me) => {
    setMe(profile);
    setOnboarded(true);
  }, []);

  const updateProfile = useCallback((profile: Me) => {
    setMe(profile);
  }, []);

  const toggleLike = useCallback((postId: string) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId],
    );
  }, []);

  const toggleSave = useCallback((postId: string) => {
    setSavedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId],
    );
  }, []);

  const toggleFollow = useCallback((handle: string) => {
    setFollowing((prev) =>
      prev.includes(handle)
        ? prev.filter((h) => h !== handle)
        : [...prev, handle],
    );
  }, []);

  const addComment = useCallback(
    (postId: string, text: string) => {
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
    [me.handle],
  );

  const addPost = useCallback(
    (post: Omit<Post, "id" | "likes" | "shares" | "comments">) => {
      const full: Post = {
        ...post,
        id: `my-${Date.now()}`,
        likes: 0,
        shares: 0,
        comments: [],
      };
      setMyPosts((prev) => [full, ...prev]);
    },
    [],
  );

  const sendMessage = useCallback((withHandle: string, text: string) => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    const msg = { id: `msg-${Date.now()}`, from: "me", text, time };
    setConversations((prev) => {
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
      setConversations((prev) =>
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
  }, []);

  const markNotificationsRead = useCallback(() => {
    setNotificationsRead(true);
  }, []);

  const getUser = useCallback(
    (handle: string) => users.find((u) => u.handle === handle),
    [users],
  );

  const value: AppState = {
    ready,
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
    sendMessage,
    markNotificationsRead,
    getUser,
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
