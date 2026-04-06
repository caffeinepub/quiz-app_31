import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Film, Heart, ImageIcon, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteEntry, useGetUserEntries } from "../../hooks/useQueries";
import { getUserId } from "../../utils/userId";

type FilterType = "all" | "IMAGE" | "VIDEO";

interface EntryData {
  prompt?: string;
  style?: string;
  type?: string;
  aspectRatio?: string;
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

export function MyGallery() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [hoveredId, setHoveredId] = useState<bigint | null>(null);
  const userId = getUserId();

  const { data: entries, isLoading } = useGetUserEntries(userId);
  const deleteEntry = useDeleteEntry();

  const handleDelete = async (entryId: bigint) => {
    try {
      await deleteEntry.mutateAsync({ entryId, userId });
      toast.success("Deleted!");
    } catch {
      toast.error("Delete failed.");
    }
  };

  const filtered = (entries || []).filter((e) => {
    if (filter === "all") return true;
    const d = parseEntryData(e.data);
    return d.type === filter;
  });

  const formatDate = (ts: bigint) => {
    const ms = Number(ts / 1_000_000n);
    return new Date(ms).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold gradient-text">My Gallery</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            All your AI-generated creations
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-border text-muted-foreground"
        >
          {filtered.length} item{filtered.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6" role="tablist">
        {(["all", "IMAGE", "VIDEO"] as FilterType[]).map((f) => (
          <button
            key={f}
            type="button"
            data-ocid={`gallery.${f.toLowerCase()}.tab`}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? "bg-primary/15 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
            }`}
          >
            {f === "all" ? "All" : f === "IMAGE" ? "🖼️ Images" : "🎬 Videos"}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          data-ocid="gallery.loading_state"
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
      {!isLoading && filtered.length === 0 && (
        <motion.div
          data-ocid="gallery.empty_state"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 gap-4"
        >
          <div className="w-20 h-20 rounded-2xl bg-card border border-dashed border-border flex items-center justify-center">
            <ImageIcon size={32} className="text-muted-foreground/40" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No creations yet
            </h3>
            <p className="text-muted-foreground text-sm">
              Start generating images and videos to build your gallery!
            </p>
          </div>
        </motion.div>
      )}

      {/* Grid */}
      {!isLoading && filtered.length > 0 && (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          layout
        >
          <AnimatePresence>
            {filtered.map((entry, idx) => {
              const d = parseEntryData(entry.data);
              const isVideo = d.type === "VIDEO";
              const isHovered = hoveredId === entry.id;

              return (
                <motion.div
                  key={entry.id.toString()}
                  data-ocid={`gallery.item.${idx + 1}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.2 }}
                  className="relative bg-card rounded-xl overflow-hidden border border-border card-hover group"
                  onMouseEnter={() => setHoveredId(entry.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {d.imageUrl ? (
                      <img
                        src={d.imageUrl}
                        alt={d.prompt || "AI creation"}
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

                    {/* Type badge */}
                    <div className="absolute top-2 left-2">
                      <Badge
                        className={`text-[10px] px-1.5 py-0.5 border-0 ${
                          isVideo ? "bg-purple-500/80" : "bg-blue-500/80"
                        }`}
                      >
                        {isVideo ? "VIDEO" : "IMAGE"}
                      </Badge>
                    </div>

                    {/* Delete on hover */}
                    {isHovered && (
                      <motion.button
                        type="button"
                        data-ocid={`gallery.delete_button.${idx + 1}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => handleDelete(entry.id)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-destructive/90 flex items-center justify-center hover:bg-destructive transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} className="text-white" />
                      </motion.button>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-xs text-foreground font-medium line-clamp-2 mb-2">
                      {d.prompt || "Untitled creation"}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5 flex-wrap">
                        {d.style && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            {d.style}
                          </span>
                        )}
                        {d.duration && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            {d.duration}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Heart size={11} />
                        <span className="text-[10px]">
                          {entry.likes.toString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground/60 mt-1.5">
                      {formatDate(entry.timestamp)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
