import { Send, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function PostModal({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    toast.success("Post shared with the community! 🚀");
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-ocid="post.modal"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="w-full max-w-[500px] bg-card border border-border rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            Share Market Update
          </h2>
          <button
            type="button"
            onClick={onClose}
            data-ocid="post.close_button"
            className="w-8 h-8 rounded-full bg-secondary hover:bg-border flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's trending in the market? Share your analysis, tips, or trade ideas…"
            data-ocid="post.textarea"
            rows={5}
            className="w-full bg-secondary border border-border rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 resize-none transition"
          />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Add tags: #NIFTY50 #BuySignal #Breakout"
            data-ocid="post.tags.input"
            className="w-full bg-secondary border border-border rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition"
          />
          <div className="flex gap-2 flex-wrap">
            {[
              "#NIFTY50",
              "#BuyTheBreakout",
              "#OptionsTrading",
              "#TechStocks",
            ].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() =>
                  setTags((prev) => (prev ? `${prev} ${tag}` : tag))
                }
                className="text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-full transition"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 pb-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {text.length} / 500
          </span>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!text.trim()}
            data-ocid="post.submit_button"
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-full text-sm font-semibold transition"
          >
            <Send className="w-3.5 h-3.5" />
            Post Update
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
