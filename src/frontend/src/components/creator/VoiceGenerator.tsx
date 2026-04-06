import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Bookmark, Download, Loader2, Mic, Play, Volume2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useCreateEntry } from "../../hooks/useQueries";
import { getUserId } from "../../utils/userId";

const DEMO_AUDIO_URL =
  "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav";

const VOICE_STEPS = [
  "Analyzing script...",
  "Selecting voice model...",
  "Synthesizing audio...",
  "Applying effects...",
  "Finalizing...",
];

const VOICE_TYPES = ["Male", "Female", "Deep", "Soft", "Energetic", "Calm"];
const LANGUAGES = ["Hindi", "English", "Hinglish"];
const SPEEDS = ["Slow", "Normal", "Fast"];

interface VoiceGeneratorProps {
  onShowPremium: () => void;
}

export function VoiceGenerator({ onShowPremium }: VoiceGeneratorProps) {
  const [script, setScript] = useState("");
  const [voiceType, setVoiceType] = useState("Female");
  const [language, setLanguage] = useState("Hindi");
  const [speed, setSpeed] = useState("Normal");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const createEntry = useCreateEntry();

  const handleGenerate = async () => {
    if (!script.trim()) {
      toast.error("Please enter a script first!");
      return;
    }

    // Check free usage limit
    const freeUsed = localStorage.getItem("freeVoiceUsed") === "true";
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (freeUsed && !isAdmin) {
      onShowPremium();
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setCurrentStep(0);
    setGeneratedAudio(null);

    let step = 0;
    let prog = 0;
    intervalRef.current = setInterval(() => {
      prog += 4 + Math.random() * 6;
      if (prog > 95) prog = 95;
      setProgress(Math.round(prog));
      const newStep = Math.min(Math.floor(prog / 20), VOICE_STEPS.length - 1);
      if (newStep !== step) {
        step = newStep;
        setCurrentStep(step);
      }
    }, 120);

    await new Promise((r) => setTimeout(r, 3000));
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(100);

    setGeneratedAudio(DEMO_AUDIO_URL);
    setIsGenerating(false);
    localStorage.setItem("freeVoiceUsed", "true");
    toast.success("Voice generated!");
  };

  const handlePlaySpeech = () => {
    if (!script.trim()) return;
    if (!window.speechSynthesis) {
      toast.error("Speech synthesis not supported in your browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.lang = language === "English" ? "en-US" : "hi-IN";
    utterance.rate = speed === "Slow" ? 0.7 : speed === "Fast" ? 1.4 : 1.0;
    window.speechSynthesis.speak(utterance);
    toast.success("Playing voice via Speech API!");
  };

  const handleDownload = () => {
    if (!generatedAudio) return;
    const a = document.createElement("a");
    a.href = generatedAudio;
    a.download = `ai-voice-${Date.now()}.wav`;
    a.target = "_blank";
    a.click();
    toast.success("Download started!");
  };

  const handleSave = async () => {
    if (!generatedAudio) return;
    const userId = getUserId();
    const data = JSON.stringify({
      prompt: script,
      style: voiceType,
      type: "VOICE",
      aspectRatio: null,
      imageUrl: null,
      duration: null,
      isPublic: false,
    });
    try {
      await createEntry.mutateAsync({ userId, data });
      toast.success("Saved to gallery!");
    } catch {
      toast.error("Save failed. Try again.");
    }
  };

  const scriptPreview =
    script.length > 80 ? `${script.substring(0, 80)}...` : script;

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
          <span className="gradient-text">AI Voice</span>
          <br />
          <span className="text-foreground">Generator</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground text-lg max-w-xl mx-auto"
        >
          Turn your script into natural, expressive AI voices in Hindi, English,
          or Hinglish.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Controls */}
        <div className="space-y-5">
          <Textarea
            data-ocid="voice.script.textarea"
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Enter your script here... (e.g. नमस्ते दोस्तों! AI Creator Studio में आपका स्वागत है।)"
            className="min-h-[160px] bg-card border-border text-foreground placeholder:text-muted-foreground resize-none text-sm leading-relaxed focus:border-primary/50 transition-colors"
          />

          {/* Controls Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="text-xs text-muted-foreground mb-1.5 block">
                Voice Type
              </span>
              <Select value={voiceType} onValueChange={setVoiceType}>
                <SelectTrigger
                  data-ocid="voice.type.select"
                  className="bg-card border-border h-9 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {VOICE_TYPES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <span className="text-xs text-muted-foreground mb-1.5 block">
                Language
              </span>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger
                  data-ocid="voice.language.select"
                  className="bg-card border-border h-9 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <span className="text-xs text-muted-foreground mb-1.5 block">
                Speed
              </span>
              <Select value={speed} onValueChange={setSpeed}>
                <SelectTrigger
                  data-ocid="voice.speed.select"
                  className="bg-card border-border h-9 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {SPEEDS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            data-ocid="voice.generate.primary_button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full gradient-btn text-white font-bold py-3.5 rounded-xl text-base flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed shadow-glow"
          >
            {isGenerating ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Mic size={18} />
            )}
            {isGenerating ? "Generating Voice..." : "🎙️ Generate Voice"}
          </button>

          {/* Loading Steps */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                data-ocid="voice.loading_state"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-card border border-border rounded-xl p-4 space-y-3"
              >
                <div className="flex flex-col gap-2">
                  {VOICE_STEPS.map((step, i) => (
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
            {generatedAudio ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {/* Audio Card */}
                <div className="rounded-2xl overflow-hidden border border-border bg-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl gradient-btn flex items-center justify-center">
                      <Volume2 size={22} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        AI Voice Ready
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {voiceType} · {language} · {speed}
                      </p>
                    </div>
                  </div>

                  {/* HTML5 Audio Player */}
                  <audio
                    ref={audioRef}
                    src={generatedAudio}
                    controls
                    className="w-full rounded-lg"
                    style={{ colorScheme: "dark" }}
                  >
                    <track kind="captions" />
                    Your browser does not support the audio element.
                  </audio>

                  {/* Speech API Play Button */}
                  <button
                    type="button"
                    data-ocid="voice.speech_play.button"
                    onClick={handlePlaySpeech}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 transition-colors"
                  >
                    <Play size={14} />
                    Play via Speech Synthesis (Live Voice)
                  </button>
                </div>

                <p className="text-sm text-muted-foreground italic px-1">
                  "{scriptPreview}"
                </p>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    data-ocid="voice.download.button"
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium hover:border-primary/40 transition-colors"
                  >
                    <Download size={15} /> Download
                  </button>
                  <button
                    type="button"
                    data-ocid="voice.save_gallery.button"
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
                    data-ocid="voice.success_state"
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
                  <Mic size={28} className="text-white" />
                </div>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Your AI-generated voice audio will appear here. Enter a script
                  and click Generate!
                </p>
                <p className="text-xs text-muted-foreground/50">
                  Supports Hindi, English, and Hinglish scripts
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
