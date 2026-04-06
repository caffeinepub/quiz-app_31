import { ImageIcon, LayoutGrid, Mic, Users, VideoIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Community } from "../components/creator/Community";
import { ImageGenerator } from "../components/creator/ImageGenerator";
import { MyGallery } from "../components/creator/MyGallery";
import { PremiumModal } from "../components/creator/PremiumModal";
import { VideoGenerator } from "../components/creator/VideoGenerator";
import { VoiceGenerator } from "../components/creator/VoiceGenerator";

type Tab = "image" | "video" | "voice" | "gallery" | "community";

const TABS: { id: Tab; label: string; icon: typeof ImageIcon }[] = [
  { id: "image", label: "Image Generator", icon: ImageIcon },
  { id: "video", label: "Video Generator", icon: VideoIcon },
  { id: "voice", label: "Voice AI", icon: Mic },
  { id: "gallery", label: "My Gallery", icon: LayoutGrid },
  { id: "community", label: "Community", icon: Users },
];

export function AICreatorStudio() {
  const [activeTab, setActiveTab] = useState<Tab>("image");
  const [showPremium, setShowPremium] = useState(false);

  // Secret admin mode: click logo 5 times rapidly
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = () => {
    logoClickCount.current += 1;
    if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
    logoClickTimer.current = setTimeout(() => {
      logoClickCount.current = 0;
    }, 1500);
    if (logoClickCount.current >= 5) {
      localStorage.setItem("isAdmin", "true");
      logoClickCount.current = 0;
      toast.success("Admin mode activated! Unlimited generation unlocked. 🔓");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Top Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <button
              type="button"
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 cursor-pointer bg-transparent border-0 p-0"
              title="CreatorStudio"
            >
              <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-lg font-bold gradient-text">
                CreatorStudio
              </span>
            </button>

            {/* Nav Links */}
            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Main navigation"
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  data-ocid={`nav.${tab.id}.link`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-primary/15 text-primary border border-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <tab.icon size={15} />
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* CTA */}
            <button
              type="button"
              data-ocid="nav.upgrade.primary_button"
              onClick={() => setShowPremium(true)}
              className="gradient-btn text-white text-sm font-semibold px-5 py-2 rounded-full shadow-glow"
            >
              ✨ Go Pro
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center border-b border-border bg-card overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            data-ocid={`mobile.nav.${tab.id}.link`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Page Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="h-full"
          >
            {activeTab === "image" && (
              <ImageGenerator onShowPremium={() => setShowPremium(true)} />
            )}
            {activeTab === "video" && (
              <VideoGenerator onShowPremium={() => setShowPremium(true)} />
            )}
            {activeTab === "voice" && (
              <VoiceGenerator onShowPremium={() => setShowPremium(true)} />
            )}
            {activeTab === "gallery" && <MyGallery />}
            {activeTab === "community" && <Community />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>

      {/* Premium Modal */}
      <PremiumModal open={showPremium} onClose={() => setShowPremium(false)} />
    </div>
  );
}
