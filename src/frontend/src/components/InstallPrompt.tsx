import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    const ios =
      /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) &&
      !(window.navigator as Navigator & { standalone?: boolean }).standalone;
    setIsIOS(ios);

    if (ios) {
      const dismissed = localStorage.getItem("pwa-ios-dismissed");
      if (!dismissed) setShowBanner(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const dismissed = localStorage.getItem("pwa-dismissed");
      if (!dismissed) setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    if (isIOS) {
      localStorage.setItem("pwa-ios-dismissed", "1");
    } else {
      localStorage.setItem("pwa-dismissed", "1");
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 rounded-2xl shadow-2xl p-4 flex items-start gap-3 border border-purple-500">
        <img
          src="/assets/generated/icon-192.dim_192x192.png"
          alt="QuizWiz"
          className="w-12 h-12 rounded-xl flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm">QuizWiz Install करें!</p>
          {isIOS ? (
            <>
              <p className="text-purple-200 text-xs mt-0.5">
                Home Screen पर add करें -- बिल्कुल app जैसा!
              </p>
              {!showIOSGuide ? (
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(true)}
                  className="mt-2 text-xs bg-white text-purple-700 font-semibold px-3 py-1 rounded-full"
                >
                  कैसे करें?
                </button>
              ) : (
                <p className="text-purple-100 text-xs mt-1">
                  Safari में नीचे <span className="font-bold">Share (□↑)</span> बटन
                  दबाएं →{" "}
                  <span className="font-bold">
                    &quot;Add to Home Screen&quot;
                  </span>{" "}
                  चुनें
                </p>
              )}
            </>
          ) : (
            <>
              <p className="text-purple-200 text-xs mt-0.5">
                Phone पर install करें -- बिल्कुल app जैसा!
              </p>
              <button
                type="button"
                onClick={handleInstall}
                className="mt-2 text-xs bg-white text-purple-700 font-semibold px-3 py-1 rounded-full"
              >
                Install करें
              </button>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-purple-300 hover:text-white text-lg leading-none flex-shrink-0 mt-0.5"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
