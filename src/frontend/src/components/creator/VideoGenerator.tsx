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
  Film,
  Loader2,
  Sparkles,
  Volume2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useCreateEntry } from "../../hooks/useQueries";
import { getUserId } from "../../utils/userId";

const DEMO_VIDEO_URL = "https://www.w3schools.com/html/mov_baa.mp4";

const VIDEO_STEPS = [
  "Analyzing prompt...",
  "Generating frames...",
  "Rendering video...",
  "Applying effects...",
  "Finalizing...",
];

interface VideoGeneratorProps {
  onShowPremium: () => void;
}

export function VideoGenerator({ onShowPremium }: VideoGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("10s");
  const [style, setStyle] = useState("Cinematic");
  const [resolution, setResolution] = useState("1080p");
  const [frameRate, setFrameRate] = useState("30fps");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedVideo, setGeneratedVideo] = useState<{
    videoUrl: string;
    thumbnailUrl: string;
    prompt: string;
    duration: string;
    style: string;
    resolution: string;
  } | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const createEntry = useCreateEntry();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first!");
      return;
    }

    // Check free usage limit
    const freeUsed = localStorage.getItem("freeVideoUsed") === "true";
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (freeUsed && !isAdmin) {
      onShowPremium();
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setCurrentStep(0);
    setGeneratedVideo(null);

    let step = 0;
    let prog = 0;
    intervalRef.current = setInterval(() => {
      prog += 3 + Math.random() * 5;
      if (prog > 95) prog = 95;
      setProgress(Math.round(prog));
      const newStep = Math.min(Math.floor(prog / 20), VIDEO_STEPS.length - 1);
      if (newStep !== step) {
        step = newStep;
        setCurrentStep(step);
      }
    }, 130);

    await new Promise((r) => setTimeout(r, 4000));
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(100);

    const thumbnailUrl = `https://picsum.photos/seed/${encodeURIComponent(`${prompt}video`)}/640/360`;
    setGeneratedVideo({
      videoUrl: DEMO_VIDEO_URL,
      thumbnailUrl,
      prompt,
      duration,
      style,
      resolution,
    });
    setIsGenerating(false);
    localStorage.setItem("freeVideoUsed", "true");
    toast.success("Video generated!");
  };

  const handleVideoPlay = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      "Your AI generated video is ready. Enjoy your cinematic creation powered by AI Creator Studio.",
    );
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handleSave = async () => {
    if (!generatedVideo) return;
    const userId = getUserId();
    const data = JSON.stringify({
      prompt: generatedVideo.prompt,
      style: generatedVideo.style,
      type: "VIDEO",
      aspectRatio: "16:9",
      imageUrl: generatedVideo.thumbnailUrl,
      duration: generatedVideo.duration,
      isPublic: false,
    });
    try {
      await createEntry.mutateAsync({ userId, data });
      toast.success("Saved to gallery!");
    } catch {
      toast.error("Save failed. Try again.");
    }
  };

  const handleDownload = () => {
    if (!generatedVideo) return;
    const a = document.createElement("a");
    a.href = generatedVideo.videoUrl;
    a.download = `ai-video-${Date.now()}.mp4`;
    a.target = "_blank";
    a.click();
    toast.success("Download started!");
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
          <span className="gradient-text">Generate AI Videos</span>
          <br />
          <span className="text-foreground">from Text</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground text-lg max-w-xl mx-auto"
        >
          Describe any scene and watch AI bring it to life as a cinematic video.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Controls */}
        <div className="space-y-5">
          <Textarea
            data-ocid="video.prompt.textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the video scene... (e.g. A time-lapse of a stormy ocean at night with lightning flashes)"
            className="min-h-[140px] bg-card border-border text-foreground placeholder:text-muted-foreground resize-none text-sm leading-relaxed focus:border-primary/50 transition-colors"
          />

          {/* Controls Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-xs text-muted-foreground mb-1.5 block">
                Duration
              </span>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger
                  data-ocid="video.duration.select"
                  className="bg-card border-border h-9 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {["5s", "10s", "15s", "30s"].map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
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
                  data-ocid="video.style.select"
                  className="bg-card border-border h-9 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {[
                    "Cinematic",
                    "Animation",
                    "Documentary",
                    "Music Video",
                    "Short Film",
                  ].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <span className="text-xs text-muted-foreground mb-1.5 block">
                Resolution
              </span>
              <Select value={resolution} onValueChange={setResolution}>
                <SelectTrigger
                  data-ocid="video.resolution.select"
                  className="bg-card border-border h-9 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {["720p", "1080p", "4K"].map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <span className="text-xs text-muted-foreground mb-1.5 block">
                Frame Rate
              </span>
              <Select value={frameRate} onValueChange={setFrameRate}>
                <SelectTrigger
                  data-ocid="video.framerate.select"
                  className="bg-card border-border h-9 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {["24fps", "30fps", "60fps"].map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            data-ocid="video.generate.primary_button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full gradient-btn text-white font-bold py-3.5 rounded-xl text-base flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed shadow-glow"
          >
            {isGenerating ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Sparkles size={18} />
            )}
            {isGenerating ? "Generating..." : "🎬 Generate Video"}
          </button>

          {/* Loading Steps */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                data-ocid="video.loading_state"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-card border border-border rounded-xl p-4 space-y-3"
              >
                <div className="flex flex-col gap-2">
                  {VIDEO_STEPS.map((step, i) => (
                    <div
                      key={step}
                      className={`flex items-center gap-2.5 text-sm transition-colors ${
                        i < currentStep
                          ? "text-green-400"
                          : i === currentStep
                            ? "text-foreground"
                            : "text-muted-foreground/40"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          i < currentStep
                            ? "bg-green-400"
                            : i === currentStep
                              ? "bg-primary pulse-ring"
                              : "bg-muted-foreground/30"
                        }`}
                      />
                      {step}
                      {i < currentStep && (
                        <span className="ml-auto text-xs text-green-400">
                          ✓
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <Progress
                  value={progress}
                  className="h-1.5 progress-glow mt-2"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {progress}%
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Result */}
        <div>
          <AnimatePresence mode="wait">
            {generatedVideo ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {/* Video Player */}
                <div className="relative rounded-2xl overflow-hidden border border-border bg-card">
                  {/* Voice badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full border border-white/10">
                      <Volume2 size={10} /> Voice
                    </span>
                  </div>

                  <video
                    data-ocid="video.play.button"
                    src={generatedVideo.videoUrl}
                    controls
                    width="100%"
                    className="w-full rounded-2xl"
                    onPlay={handleVideoPlay}
                  >
                    <track kind="captions" />
                    Your browser does not support the video element.
                  </video>

                  {/* Info badges */}
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <Badge className="bg-black/70 text-xs border-0 backdrop-blur-sm">
                      {generatedVideo.duration}
                    </Badge>
                    <Badge className="bg-black/70 text-xs border-0 backdrop-blur-sm">
                      {generatedVideo.resolution}
                    </Badge>
                    <Badge className="bg-black/70 text-xs border-0 backdrop-blur-sm">
                      {frameRate}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground italic px-1">
                  "{generatedVideo.prompt}"
                </p>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    data-ocid="video.download.button"
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium hover:border-primary/40 transition-colors"
                  >
                    <Download size={15} /> Download
                  </button>
                  <button
                    type="button"
                    data-ocid="video.save_gallery.button"
                    onClick={handleSave}
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
                </div>

                {createEntry.isSuccess && (
                  <p
                    data-ocid="video.success_state"
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
                className="min-h-[360px] rounded-2xl border border-dashed border-border bg-card/50 flex flex-col items-center justify-center gap-3 text-center p-8"
              >
                <div className="w-16 h-16 rounded-2xl gradient-btn flex items-center justify-center opacity-40">
                  <Film size={28} className="text-white" />
                </div>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Your AI-generated video preview will appear here.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
