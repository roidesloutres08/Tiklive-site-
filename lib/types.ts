export type User = {
  handle: string;
  name: string;
  bio: string;
  gradient: number; // index into avatar gradient palette
  followers: number;
  following: number;
  verified?: boolean;
};

export type Comment = {
  id: string;
  author: string; // handle
  text: string;
  likes: number;
  time: string;
};

export type Post = {
  id: string;
  author: string; // handle
  type: "video" | "photo";
  src: string;
  poster?: string;
  caption: string;
  hashtags: string[];
  music?: string;
  likes: number;
  shares: number;
  comments: Comment[];
};

export type LiveStream = {
  id: string;
  host: string; // handle
  title: string;
  category: string;
  viewers: number;
  gradient: number;
};

export type Message = {
  id: string;
  from: string; // handle, "me" for current user
  text: string;
  time: string;
};

export type Conversation = {
  id: string;
  with: string; // handle
  messages: Message[];
};

export type Notification = {
  id: string;
  kind: "like" | "follow" | "comment" | "live" | "mention";
  from: string; // handle
  text: string;
  time: string;
  read?: boolean;
};
