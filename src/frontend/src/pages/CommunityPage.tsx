import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, Send, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import type { Post } from "../backend.d";
import { useActor } from "../hooks/useActor";

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  const d = new Date(ms);
  const now = Date.now();
  const diff = Math.floor((now - d.getTime()) / 1000);
  if (diff < 60) return "अभी";
  if (diff < 3600) return `${Math.floor(diff / 60)}m पहले`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h पहले`;
  return d.toLocaleDateString("en-IN");
}

const TAG_COLORS = [
  "bg-primary/15 text-primary",
  "bg-purple-500/15 text-purple-400",
  "bg-teal-500/15 text-teal-400",
  "bg-orange-500/15 text-orange-400",
  "bg-pink-500/15 text-pink-400",
];

function PostCard({
  post,
  onLike,
  liking,
}: {
  post: Post;
  onLike: (id: string) => void;
  liking: boolean;
}) {
  const initials = post.author
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const colorIdx = post.id.charCodeAt(0) % 5;
  const avatarColors = [
    "bg-primary",
    "bg-purple-600",
    "bg-teal-600",
    "bg-orange-500",
    "bg-pink-600",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-4 space-y-3"
    >
      <div className="flex items-start gap-3">
        <Avatar className="w-9 h-9 flex-shrink-0">
          <AvatarFallback
            className={`${avatarColors[colorIdx]} text-white text-xs font-bold`}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <span className="text-sm font-semibold text-foreground">
              {post.author}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(post.timestamp)}
            </span>
          </div>
          <p className="text-sm text-foreground/90 mt-1.5 leading-relaxed whitespace-pre-line">
            {post.content}
          </p>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {post.tags.map((tag, i) => (
                <span
                  key={tag}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${TAG_COLORS[i % TAG_COLORS.length]}`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-4 mt-3">
            <button
              type="button"
              onClick={() => onLike(post.id)}
              disabled={liking}
              data-ocid="community.post.toggle"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>{Number(post.likes)}</span>
            </button>
            <button
              type="button"
              data-ocid="community.post.button"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Reply
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function CommunityPage() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [likingIds, setLikingIds] = useState<Set<string>>(new Set());

  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getPosts();
      return [...result].sort((a, b) => Number(b.timestamp - a.timestamp));
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      return actor.createPost(author.trim(), content.trim(), tags);
    },
    onSuccess: () => {
      setAuthor("");
      setContent("");
      setTagsInput("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLike = useCallback(
    async (postId: string) => {
      if (!actor || likingIds.has(postId)) return;
      setLikingIds((prev) => new Set(prev).add(postId));
      try {
        await actor.likePost(postId);
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      } finally {
        setLikingIds((prev) => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
      }
    },
    [actor, likingIds, queryClient],
  );

  const canSubmit =
    author.trim().length > 0 &&
    content.trim().length > 0 &&
    !createMutation.isPending;

  return (
    <div className="max-w-[720px] mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3" data-ocid="community.section">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Community</h1>
          <p className="text-xs text-muted-foreground">
            Traders की आवाज़ — real-time posts
          </p>
        </div>
      </div>

      {/* Create Post Form */}
      <Card className="border-border bg-card" data-ocid="community.post.panel">
        <CardContent className="pt-5 space-y-3">
          <Input
            placeholder="आपका नाम"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            data-ocid="community.author.input"
            className="bg-background border-border text-foreground placeholder:text-muted-foreground"
          />
          <Textarea
            placeholder="आज का market view share करें... कौन सा stock देख रहे हैं?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            data-ocid="community.content.textarea"
            className="bg-background border-border text-foreground placeholder:text-muted-foreground resize-none"
          />
          <Input
            placeholder="Tags (comma separated): NIFTY, BUY, Breakout"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            data-ocid="community.tags.input"
            className="bg-background border-border text-foreground placeholder:text-muted-foreground"
          />
          <div className="flex justify-end">
            <Button
              onClick={() => createMutation.mutate()}
              disabled={!canSubmit}
              data-ocid="community.submit_button"
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              {createMutation.isPending ? "Post हो रहा है..." : "Post करें"}
            </Button>
          </div>
          {createMutation.isError && (
            <p
              className="text-xs text-destructive"
              data-ocid="community.error_state"
            >
              Post नहीं हो पाया। दोबारा try करें।
            </p>
          )}
        </CardContent>
      </Card>

      {/* Posts List */}
      {isLoading ? (
        <div className="space-y-4" data-ocid="community.loading_state">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl p-4 space-y-3"
            >
              <div className="flex gap-3">
                <Skeleton className="w-9 h-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div
          data-ocid="community.empty_state"
          className="text-center py-16 space-y-3"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <MessageCircle className="w-8 h-8 text-primary/50" />
          </div>
          <p className="text-foreground font-semibold">कोई post नहीं है</p>
          <p className="text-muted-foreground text-sm">
            पहला post करें और discussion शुरू करें!
          </p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-4" data-ocid="community.list">
            {posts.map((post, i) => (
              <div key={post.id} data-ocid={`community.item.${i + 1}`}>
                <PostCard
                  post={post}
                  onLike={handleLike}
                  liking={likingIds.has(post.id)}
                />
              </div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
