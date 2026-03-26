import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Mail, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";

const FAQS = [
  {
    id: "faq-1",
    q: "What is Option Traders platform?",
    a: "Option Traders is a platform for traders by traders. We provide daily updates for Index FNO Analysis, Equity FNO Analysis, Latest Market Trends, and Real Time Intraday Updates. Trusted by 60,000+ traders across India.",
  },
  {
    id: "faq-2",
    q: "How do I get Index FNO signals?",
    a: "Navigate to the 'Index FNO' section from the top navigation. You'll find complete analysis for Nifty 50, Bank Nifty, and Fin Nifty including option chains, PCR ratios, and max pain levels.",
  },
  {
    id: "faq-3",
    q: "Are the signals suitable for beginners?",
    a: "Our signals include detailed entry, stop loss, and target levels. While we provide complete analysis, we recommend learning the basics of options trading before taking positions. All signals include risk management details.",
  },
  {
    id: "faq-4",
    q: "How often are market updates sent?",
    a: "Real-time intraday updates are shared throughout market hours (9:15 AM – 3:30 PM IST). Daily market analysis is published before market open and after market close.",
  },
  {
    id: "faq-5",
    q: "Is this platform free to use?",
    a: "Basic features are available for free. Premium membership gives access to advanced FNO analysis, real-time alerts, and exclusive community features. Upgrade anytime from the header.",
  },
  {
    id: "faq-6",
    q: "How do I join the community?",
    a: "Visit the 'Community' section to view and share trading ideas with 60,000+ traders. Share your analysis, like and comment on posts, and follow top traders.",
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<string | null>("faq-1");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <ScrollArea className="h-full">
      <div className="p-4 flex flex-col gap-6 max-w-3xl">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Support & Help Center
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Get help with Option Traders platform
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              id: "chat",
              icon: <MessageCircle className="w-5 h-5" />,
              label: "Live Chat",
              desc: "Chat with us in real-time",
              color: "text-primary",
            },
            {
              id: "email",
              icon: <Mail className="w-5 h-5" />,
              label: "Email Support",
              desc: "support@optiontraders.in",
              color: "text-success",
            },
            {
              id: "phone",
              icon: <Phone className="w-5 h-5" />,
              label: "Call Support",
              desc: "Mon-Sat, 9AM–6PM IST",
              color: "text-warning",
            },
          ].map((c) => (
            <div
              key={c.id}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-3"
            >
              <span className={c.color}>{c.icon}</span>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {c.label}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-1">
            {FAQS.map((faq) => (
              <div
                key={faq.id}
                data-ocid={`faq.item.${faq.id}`}
                className="border-b border-border/40 last:border-0"
              >
                <button
                  type="button"
                  data-ocid={`faq.toggle.${faq.id}`}
                  className="flex items-center justify-between w-full py-3 text-left"
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                >
                  <span className="text-sm font-medium text-foreground pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${
                      openFaq === faq.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === faq.id && (
                  <p className="text-xs text-muted-foreground leading-relaxed pb-3">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact form */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Send us a Message
          </h2>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Name</Label>
                <Input
                  data-ocid="support.name.input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="bg-background border-border text-foreground text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Email</Label>
                <Input
                  data-ocid="support.email.input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-background border-border text-foreground text-xs h-9"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Message</Label>
              <Textarea
                data-ocid="support.message.textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or question..."
                className="bg-background border-border text-foreground text-xs min-h-[100px] resize-none"
              />
            </div>
            <Button
              type="button"
              data-ocid="support.submit_button"
              className="self-start h-9 px-4 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={!name.trim() || !email.trim() || !message.trim()}
            >
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
