import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Check, Crown, Sparkles, X, Zap } from "lucide-react";
import { motion } from "motion/react";

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
}

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "/mo",
    description: "Try it out",
    icon: Sparkles,
    color: "border-border",
    headerBg: "bg-card",
    btnClass:
      "bg-muted text-muted-foreground border border-border hover:text-foreground",
    features: [
      "1 demo video generation",
      "1 demo image generation",
      "No voice generation",
      "Standard quality",
      "Community access",
    ],
    locked: ["Voice AI", "Unlimited generations", "4K resolution"],
    badge: null,
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹499",
    period: "/mo",
    description: "For creators",
    icon: Zap,
    color: "border-primary/60",
    headerBg: "bg-gradient-to-br from-primary/20 to-accent/20",
    btnClass: "gradient-btn text-white shadow-glow",
    features: [
      "Unlimited video generation",
      "Unlimited image generation",
      "Voice AI (all voices)",
      "1080p resolution",
      "Priority generation",
      "Hindi / English / Hinglish",
    ],
    locked: [],
    badge: "Most Popular",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "₹999",
    period: "/mo",
    description: "For professionals",
    icon: Crown,
    color: "border-yellow-500/50",
    headerBg: "bg-gradient-to-br from-yellow-500/15 to-orange-500/15",
    btnClass:
      "bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold hover:opacity-90",
    features: [
      "Everything in Pro",
      "4K ultra resolution",
      "Commercial use license",
      "API access",
      "Faster generation (2x)",
      "Priority support",
    ],
    locked: [],
    badge: "Best Value",
    popular: false,
  },
];

export function PremiumModal({ open, onClose }: PremiumModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="premium.modal"
        className="max-w-4xl w-full bg-background border border-border p-0 gap-0 overflow-hidden rounded-2xl"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Close btn */}
        <button
          type="button"
          data-ocid="premium.close_button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={15} />
        </button>

        {/* Header */}
        <div className="text-center px-6 pt-10 pb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold mb-4">
            <Crown size={12} /> Upgrade Your Plan
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold gradient-text mb-2">
            Unlock Unlimited Creation
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Generate unlimited videos, images, and voice — powered by AI. Choose
            the plan that fits you.
          </p>
        </div>

        {/* Plans */}
        <div className="grid sm:grid-cols-3 gap-4 px-6 pb-10">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              data-ocid={`premium.${plan.id}.card`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
              className={`relative rounded-2xl border ${
                plan.popular
                  ? "border-primary/60 ring-1 ring-primary/20 scale-[1.02]"
                  : plan.color
              } overflow-hidden bg-card flex flex-col`}
            >
              {/* Badge */}
              {plan.badge && (
                <div
                  className={`absolute top-0 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[10px] font-bold rounded-b-lg ${
                    plan.popular
                      ? "gradient-btn text-white"
                      : "bg-gradient-to-r from-yellow-500 to-orange-500 text-black"
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              {/* Header */}
              <div className={`${plan.headerBg} px-5 pt-8 pb-5`}>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      plan.popular
                        ? "gradient-btn"
                        : plan.id === "premium"
                          ? "bg-gradient-to-br from-yellow-500 to-orange-500"
                          : "bg-muted"
                    }`}
                  >
                    <plan.icon
                      size={15}
                      className={
                        plan.id === "free"
                          ? "text-muted-foreground"
                          : "text-white"
                      }
                    />
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-sm">
                      {plan.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {plan.description}
                    </div>
                  </div>
                </div>
                <div className="flex items-end gap-0.5">
                  <span className="text-3xl font-extrabold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground text-sm mb-1">
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="px-5 py-4 flex-1 space-y-2.5">
                {plan.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={9} className="text-green-400" />
                    </div>
                    <span className="text-xs text-foreground">{feat}</span>
                  </div>
                ))}
                {plan.locked.map((feat) => (
                  <div key={feat} className="flex items-start gap-2 opacity-35">
                    <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X size={9} className="text-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground line-through">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="px-5 pb-5">
                <button
                  type="button"
                  data-ocid={`premium.${plan.id}.primary_button`}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    plan.btnClass
                  }`}
                  onClick={plan.id === "free" ? onClose : undefined}
                >
                  {plan.id === "free"
                    ? "Continue Free"
                    : `Get ${plan.name} — ${plan.price}/mo`}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <div className="text-center pb-6 text-xs text-muted-foreground px-6">
          🔒 Secure payment &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp; Instant
          access after payment
        </div>
      </DialogContent>
    </Dialog>
  );
}
