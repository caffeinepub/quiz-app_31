import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Film, Heart, ImageIcon, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Entry } from "../../backend.d";
import { useGetAllEntries, useLikeEntry } from "../../hooks/useQueries";
import { getUserId } from "../../utils/userId";

type SortType = "recent" | "liked";

interface EntryData {
  prompt?: string;
  style?: string;
  type?: string;
  imageUrl?: string;
  duration?: string;
  isPublic?: boolean;
}

function parseEntryData(dataStr: string): EntryData {
  try {
    return JSON.parse(dataStr) as EntryData;
  } catch {
    return {};
  }
}

export function Community() {
  const [sort, setSort] = useState<SortType>("recent");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const userId = getUserId();

  const { data: allEntries, isLoading } = useGetAllEntries();
  const likeEntry = useLikeEntry();

  const publicEntries: Entry[] = (allEntries || []).filter((e) => e.isPublic);

  const sorted = [...publicEntries].sort((a, b) => {
    if (sort === "liked") return Number(b.likes - a.likes);
    return Number(b.timestamp - a.timestamp);
  });

  const handleLike = async (entryId: bigint) => {
    const key = entryId.toString();
    if (likedIds.has(key)) {
      toast.info("Already liked!");
      return;
    }
    setLikedIds((prev) => new Set([...prev, key]));
    try {
      await likeEntry.mutateAsync({ userId, entryId });
      toast.success("❤️ Liked!");
    } catch {
      setLikedIds((prev) => {
        const s = new Set(prev);
        s.delete(key);
        return s;
      });
      toast.error("Like failed.");
    }
  };

  const formatDate = (ts: bigint) => {
    const ms = Number(ts / 1_000_000n);
    const d = new Date(ms);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold gradient-text">
            Community Creations
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Discover and get inspired by the community
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="community.recent.tab"
            onClick={() => setSort("recent")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              sort === "recent"
                ? "bg-primary/15 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            <Clock size={13} /> Recent
          </button>
          <button
            type="button"
            data-ocid="community.liked.tab"
            onClick={() => setSort("liked")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              sort === "liked"
                ? "bg-primary/15 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            <TrendingUp size={13} /> Most Liked
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          data-ocid="community.loading_state"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((k) => (
            <div key={k} className="rounded-xl overflow-hidden">
              <Skeleton className="w-full aspect-video" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && sorted.length === 0 && (
        <motion.div
          data-ocid="community.empty_state"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 gap-4"
        >
          <div className="w-20 h-20 rounded-2xl bg-card border border-dashed border-border flex items-center justify-center">
            <Heart size={32} className="text-muted-foreground/40" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No public creations yet
            </h3>
            <p className="text-muted-foreground text-sm">
              Generate an image or video and share it publicly to see it here!
            </p>
          </div>
        </motion.div>
      )}

      {/* Grid */}
      {!isLoading && sorted.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sorted.map((entry, idx) => {
            const d = parseEntryData(entry.data);
            const isVideo = d.type === "VIDEO";
            const isLiked = likedIds.has(entry.id.toString());

            return (
              <motion.div
                key={entry.id.toString()}
                data-ocid={`community.item.${idx + 1}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
                className="bg-card rounded-xl overflow-hidden border border-border card-hover group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-muted">
                  {d.imageUrl ? (
                    <img
                      src={d.imageUrl}
                      alt={d.prompt || "Community creation"}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {isVideo ? (
                        <Film size={24} className="text-muted-foreground" />
                      ) : (
                        <ImageIcon
                          size={24}
                          className="text-muted-foreground"
                        />
                      )}
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge
                      className={`text-[10px] px-1.5 py-0.5 border-0 ${
                        isVideo ? "bg-purple-500/80" : "bg-blue-500/80"
                      }`}
                    >
                      {isVideo ? "VIDEO" : "IMAGE"}
                    </Badge>
                  </div>
                  {d.style && (
                    <div className="absolute top-2 right-2">
                      <Badge className="text-[10px] px-1.5 py-0.5 border-0 bg-black/60 backdrop-blur-sm">
                        {d.style}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-xs text-foreground font-medium line-clamp-2 mb-2.5">
                    {d.prompt || "Untitled creation"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground/60">
                      {formatDate(entry.timestamp)}
                    </span>
                    <button
                      type="button"
                      data-ocid={`community.like.button.${idx + 1}`}
                      onClick={() => handleLike(entry.id)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                        isLiked
                          ? "bg-pink-500/15 text-pink-400 border border-pink-500/30"
                          : "bg-muted text-muted-foreground hover:text-pink-400 hover:bg-pink-500/10 border border-transparent"
                      }`}
                    >
                      <Heart
                        size={11}
                        className={isLiked ? "fill-pink-400" : ""}
                      />
                      {Number(entry.likes) + (isLiked ? 1 : 0)}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
