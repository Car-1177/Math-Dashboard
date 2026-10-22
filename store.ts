import { useEffect, useState } from "react";

export type Profile = {
  id: string;
  name: string;
  email: string;
};

export type Post = {
  id: string;
  user_id: string;
  author_name: string;
  topic: string;
  body: string;
  votes: number;
  created_at: string;
};

export type Reply = {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string;
  body: string;
  created_at: string;
};

const PROFILE_KEY = "mathlab.profile";
const POSTS_KEY = "mathlab.posts";
const REPLIES_KEY = "mathlab.replies";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
}

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const SEED_POSTS: Post[] = [
  {
    id: "seed-1",
    user_id: "seed",
    author_name: "Priya",
    topic: "Algebra",
    body: "How do I factor x² − 5x + 6 quickly? I keep guessing wrong pairs.",
    votes: 4,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "seed-2",
    user_id: "seed",
    author_name: "Marcus",
    topic: "Geometry",
    body: "When do I use the distance formula vs. the Pythagorean theorem? They look identical.",
    votes: 7,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

const SEED_REPLIES: Reply[] = [
  {
    id: "seed-r1",
    post_id: "seed-1",
    user_id: "seed",
    author_name: "Priya",
    body: "Found it — you need two numbers that multiply to 6 and add to −5. So −2 and −3.",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(() =>
    read<Profile | null>(PROFILE_KEY, null)
  );

  function save(p: Profile) {
    write(PROFILE_KEY, p);
    setProfile(p);
  }

  function clear() {
    localStorage.removeItem(PROFILE_KEY);
    setProfile(null);
  }

  return { profile, save, clear };
}

export function useCommunity() {
  const [posts, setPosts] = useState<Post[]>(() => {
    const stored = read<Post[] | null>(POSTS_KEY, null);
    return stored ?? SEED_POSTS;
  });
  const [replies, setReplies] = useState<Reply[]>(() => {
    const stored = read<Reply[] | null>(REPLIES_KEY, null);
    return stored ?? SEED_REPLIES;
  });

  useEffect(() => write(POSTS_KEY, posts), [posts]);
  useEffect(() => write(REPLIES_KEY, replies), [replies]);

  function addPost(p: Omit<Post, "id" | "created_at" | "votes">) {
    const post: Post = {
      ...p,
      id: uid(),
      votes: 0,
      created_at: new Date().toISOString(),
    };
    setPosts((prev) => [post, ...prev]);
  }

  function votePost(id: string) {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, votes: p.votes + 1 } : p))
    );
  }

  function removePost(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setReplies((prev) => prev.filter((r) => r.post_id !== id));
  }

  function addReply(r: Omit<Reply, "id" | "created_at">) {
    const reply: Reply = {
      ...r,
      id: uid(),
      created_at: new Date().toISOString(),
    };
    setReplies((prev) => [...prev, reply]);
  }

  function removeReply(id: string) {
    setReplies((prev) => prev.filter((r) => r.id !== id));
  }

  return { posts, replies, addPost, votePost, removePost, addReply, removeReply };
}