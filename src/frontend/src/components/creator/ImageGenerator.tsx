import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Bookmark,
  Download,
  Loader2,
  Share2,
  Shuffle,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useCreateEntry } from "../../hooks/useQueries";
import { getUserId } from "../../utils/userId";

const STYLE_PRESETS = [
  { id: "Cinematic", label: "Cinematic", seed: "cinematic" },
  { id: "Anime", label: "Anime", seed: "anime" },
  { id: "Oil Painting", label: "Oil Painting", seed: "oilpainting" },
  { id: "Watercolor", label: "Watercolor", seed: "watercolor" },
  { id: "3D Render", label: "3D Render", seed: "3drender" },
  { id: "Realistic", label: "Realistic", seed: "realistic" },
  { id: "Fantasy", label: "Fantasy", seed: "fantasy" },
  { id: "Abstract", label: "Abstract", seed: "abstract" },
];

const ASPECT_HEIGHTS: Record<string, number> = {
  "1:1": 800,
  "16:9": 450,
  "9:16": 1422,
  "4:3": 600,
};

const LOAD_STEPS = [
  "Interpreting your prompt...",
  "Generating composition...",
  "Rendering details...",
  "Applying style...",
  "Finalizing your masterpiece...",
];

const EXAMPLE_PROMPTS = [
  "A cinematic shot of a lone samurai standing on a misty mountain at sunset",
  "Futuristic cyberpunk city at night with neon reflections on wet streets",
  "A serene magical forest with glowing fireflies and ancient tree spirits",
  "Deep ocean bioluminescent creatures in an alien underwater world",
  "Portrait of a warrior queen with golden armor in a fantasy kingdom",
];

interface ImageGeneratorProps {
  onShowPremium: () => void;
}

export function ImageGenerator({ onShowPremium }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [style, setStyle] = useState("Realistic");
  const [quality, setQuality] = useState("HD");
  const [seed, setSeed] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadStep, setLoadStep] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [shareToComm, setShareToComm] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const createEntry = useCreateEntry();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first!");
      return;
    }

    // Check free usage limit
    const freeUsed = localStorage.getItem("freeImageUsed") === "true";
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (freeUsed && !isAdmin) {
      onShowPremium();
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setLoadStep(0);
    setGeneratedImage(null);

    let step = 0;
    let prog = 0;
    intervalRef.current = setInterval(() => {
      prog += 4 + Math.random() * 6;
      if (prog > 95) prog = 95;
      setProgress(Math.round(prog));
      if (prog > 20 * (step + 1)) {
        step = Math.min(step + 1, LOAD_STEPS.length - 1);
        setLoadStep(step);
      }
    }, 120);

    await new Promise((r) => setTimeout(r, 2800));
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(100);

    const h = ASPECT_HEIGHTS[aspectRatio] || 800;
    const seedStr = seed || Math.floor(Math.random() * 99999).toString();
    const imgUrl = `https://picsum.photos/seed/${encodeURIComponent(prompt + seedStr)}/800/${h}`;

    setGeneratedImage(imgUrl);
    setGeneratedPrompt(prompt);
    setIsGenerating(false);
    localStorage.setItem("freeImageUsed", "true");
    toast.success("Image generated!");
  };

  const handleSaveToGallery = async () => {
    if (!generatedImage) return;
    const userId = getUserId();
    const data = JSON.stringify({
      prompt: generatedPrompt,
      style,
      type: "IMAGE",
      aspectRatio,
      imageUrl: generatedImage,
      duration: null,
      isPublic: shareToComm,
    });
    try {
      await createEntry.mutateAsync({ userId, data });
      toast.success("Saved to gallery!");
    } catch {
      toast.error("Save failed. Try again.");
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement("a");
    a.href = generatedImage;
    a.download = `ai-image-${Date.now()}.jpg`;
    a.target = "_blank";
    a.click();
    toast.success("Download started!");
  };

  const randomPrompt = () => {
    setPrompt(
      EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)],
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="text-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4"
        >
          <span className="gradient-text">Create Stunning</span>
          <br />
          <span className="text-foreground">AI Images</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground text-lg max-w-xl mx-auto"
        >
          Transform your imagination into stunning visuals in seconds using
          cutting-edge AI.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Controls */}
        <div className="space-y-5">
          {/* Prompt */}
          <div className="relative">
            <Textarea
              data-ocid="image.prompt.textarea"
              id="image-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create... (e.g. A majestic dragon flying over ancient ruins at dusk)"
              className="min-h-[140px] bg-card border-border text-foreground placeholder:text-muted-foreground resize-none text-sm leading-relaxed focus:border-primary/50 transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) handleGenerate();
              }}
            />
            <button
              type="button"
              onClick={randomPrompt}
              title="Random prompt"
              className="absolute bottom-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Shuffle size={16} />
            </button>
          </div>

          {/* Settings Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-xs text-muted-foreground mb-1.5 block">
                Aspect Ratio
              </span>
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                <SelectTrigger
                  data-ocid="image.aspect_ratio.select"
                  className="bg-card border-border h-9 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {["1:1", "16:9", "9:16", "4:3"].map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <span className="text-xs text-muted-foreground mb-1.5 block">
                Style
              </span>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger
                  data-ocid="image.style.select"
                  className="bg-card border-border h-9 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {STYLE_PRESETS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <span className="text-xs text-muted-foreground mb-1.5 block">
                Quality
              </span>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger
                  data-ocid="image.quality.select"
                  className="bg-card border-border h-9 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {["Standard", "HD", "Ultra HD"].map((q) => (
                    <SelectItem key={q} value={q}>
                      {q}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <span className="text-xs text-muted-foreground mb-1.5 block">
                Seed (optional)
              </span>
              <input
                data-ocid="image.seed.input"
                type="number"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="Random"
                className="w-full h-9 rounded-md bg-card border border-border text-sm px-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          {/* Style Presets */}
          <div>
            <span className="text-xs text-muted-foreground mb-2 block">
              Style Presets
            </span>
            <div className="flex gap-2 overflow-x-auto pb-2 preset-scroll">
              {STYLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  data-ocid="image.style_preset.button"
                  onClick={() => setStyle(preset.id)}
                  className={`flex-shrink-0 rounded-xl overflow-hidden border transition-all duration-200 ${
                    style === preset.id
                      ? "border-primary ring-1 ring-primary/40 scale-105"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <img
                    src={`https://picsum.photos/seed/${preset.seed}/120/80`}
                    alt={preset.label}
                    className="w-[108px] h-[72px] object-cover block"
                    loading="lazy"
                  />
                  <div className="bg-card px-2 py-1">
                    <span className="text-xs font-medium text-foreground">
                      {preset.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            data-ocid="image.generate.primary_button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full gradient-btn text-white font-bold py-3.5 rounded-xl text-base flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed shadow-glow"
          >
            {isGenerating ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Sparkles size={18} />
            )}
            {isGenerating ? "Generating..." : "✨ Generate Image"}
          </button>

          {/* Loading State */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                data-ocid="image.loading_state"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-card border border-border rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary pulse-ring" />
                  <span className="text-sm text-muted-foreground">
                    {LOAD_STEPS[loadStep]}
                  </span>
                </div>
                <Progress value={progress} className="h-1.5 progress-glow" />
                <p className="text-xs text-muted-foreground text-right">
                  {progress}%
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Result */}
        <div className="flex flex-col">
          <AnimatePresence mode="wait">
            {generatedImage ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <div className="relative rounded-2xl overflow-hidden border border-border bg-card">
                  <img
                    src={generatedImage}
                    alt={generatedPrompt}
                    className="w-full object-cover"
                    style={{ maxHeight: 480 }}
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge className="bg-black/60 text-xs border-0 backdrop-blur-sm">
                      {style}
                    </Badge>
                    <Badge className="bg-black/60 text-xs border-0 backdrop-blur-sm">
                      {aspectRatio}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground italic px-1">
                  "{generatedPrompt}"
                </p>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    data-ocid="image.download.button"
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium hover:border-primary/40 transition-colors"
                  >
                    <Download size={15} /> Download
                  </button>
                  <button
                    type="button"
                    data-ocid="image.save_gallery.button"
                    onClick={handleSaveToGallery}
                    disabled={createEntry.isPending}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-btn text-white text-sm font-medium disabled:opacity-60"
                  >
                    {createEntry.isPending ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Bookmark size={15} />
                    )}
                    Save to Gallery
                  </button>
                  <button
                    type="button"
                    data-ocid="image.share_community.toggle"
                    onClick={() => setShareToComm(!shareToComm)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      shareToComm
                        ? "bg-accent/15 border-accent/40 text-accent"
                        : "bg-card border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Share2 size={15} />
                    {shareToComm ? "Sharing Publicly" : "Share to Community"}
                  </button>
                </div>

                {createEntry.isSuccess && (
                  <p
                    data-ocid="image.success_state"
                    className="text-xs text-green-400"
                  >
                    ✓ Saved to your gallery!
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 min-h-[360px] rounded-2xl border border-dashed border-border bg-card/50 flex flex-col items-center justify-center gap-3 text-center p-8"
              >
                <div className="w-16 h-16 rounded-2xl gradient-btn flex items-center justify-center opacity-40">
                  <Download size={28} className="text-white" />
                </div>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Your generated image will appear here. Enter a prompt and
                  click Generate!
                </p>
                <p className="text-xs text-muted-foreground/60">
                  Tip: Press Ctrl+Enter to generate
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
