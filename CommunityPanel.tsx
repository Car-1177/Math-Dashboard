import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCommunity, useProfile } from "../lib/store";
import { ArrowBigUp, MessageSquare, Send, Trash2 } from "lucide-react";

const TOPICS = ["Algebra", "Geometry", "Statistics", "Calculus", "Other"];

export function CommunityPanel() {
  const { profile } = useProfile();
  const { posts, replies, addPost, votePost, removePost, addReply, removeReply } =
    useCommunity();
  const [openId, setOpenId] = useState<string | null>(null);
  const [topic, setTopic] = useState("Algebra");
  const [body, setBody] = useState("");
  const [replyDraft, setReplyDraft] = useState("");

  function submitPost() {
    if (!profile || !body.trim()) return;
    addPost({
      user_id: profile.id,
      author_name: profile.name,
      topic,
      body: body.trim(),
    });
    setBody("");
  }

  function submitReply(postId: string) {
    if (!profile || !replyDraft.trim()) return;
    addReply({
      post_id: postId,
      user_id: profile.id,
      author_name: profile.name,
      body: replyDraft.trim(),
    });
    setReplyDraft("");
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-800 bg-slate-900/70">
        <CardHeader>
          <CardTitle className="text-slate-100">Ask the community</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className={
                  "rounded-full px-3 py-1 text-sm transition-colors " +
                  (topic === t
                    ? "bg-teal-500 text-slate-950"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700")
                }
              >
                {t}
              </button>
            ))}
          </div>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Stuck on a problem? Describe it here…"
            className="border-slate-700 bg-slate-950 text-slate-100"
            rows={3}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Posting as {profile?.name ?? "guest"}
            </span>
            <Button
              onClick={submitPost}
              disabled={!body.trim()}
              className="bg-teal-500 text-slate-950 hover:bg-teal-400"
            >
              <Send className="mr-2 h-4 w-4" />
              Post question
            </Button>
          </div>
        </CardContent>
      </Card>

      {posts.length === 0 ? (
        <Card className="border-dashed border-slate-700 bg-slate-900/40">
          <CardContent className="py-12 text-center text-slate-400">
            No questions yet. Be the first to ask.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const postReplies = replies.filter((r) => r.post_id === post.id);
            return (
              <Card key={post.id} className="border-slate-800 bg-slate-900/70">
                <CardContent className="space-y-3 pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge className="bg-teal-500/15 text-teal-300 ring-1 ring-teal-500/30">
                          {post.topic}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {post.author_name} ·{" "}
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap text-slate-200">
                        {post.body}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => votePost(post.id)}
                        className="flex flex-col items-center rounded-lg px-2 py-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-teal-300"
                      >
                        <ArrowBigUp className="h-5 w-5" />
                        <span className="text-xs font-semibold">{post.votes}</span>
                      </button>
                      {profile?.id === post.user_id && (
                        <button
                          onClick={() => removePost(post.id)}
                          className="rounded-lg p-1 text-slate-500 transition-colors hover:text-rose-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setOpenId(openId === post.id ? null : post.id)}
                    className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-teal-300"
                  >
                    <MessageSquare className="h-4 w-4" />
                    {openId === post.id
                      ? "Hide replies"
                      : `Replies (${postReplies.length})`}
                  </button>

                  {openId === post.id && (
                    <div className="space-y-3 border-t border-slate-800 pt-3">
                      {postReplies.map((r) => (
                        <div
                          key={r.id}
                          className="flex items-start justify-between gap-3 rounded-lg bg-slate-950/60 p-3"
                        >
                          <div>
                            <p className="text-xs text-slate-500">
                              {r.author_name} ·{" "}
                              {new Date(r.created_at).toLocaleDateString()}
                            </p>
                            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-200">
                              {r.body}
                            </p>
                          </div>
                          {profile?.id === r.user_id && (
                            <button
                              onClick={() => removeReply(r.id)}
                              className="rounded-lg p-1 text-slate-500 transition-colors hover:text-rose-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          value={replyDraft}
                          onChange={(e) => setReplyDraft(e.target.value)}
                          placeholder="Write a reply…"
                          className="border-slate-700 bg-slate-950 text-slate-100"
                        />
                        <Button
                          onClick={() => submitReply(post.id)}
                          disabled={!replyDraft.trim()}
                          className="bg-teal-500 text-slate-950 hover:bg-teal-400"
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}