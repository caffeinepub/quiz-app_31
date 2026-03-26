import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import type { CommunityPost } from "@/hooks/useLiveMarket";
import { Heart, MessageCircle, Send, TrendingUp } from "lucide-react";
import { useState } from "react";

const TRADER_PROFILES = [
  {
    name: "Rahul Sharma",
    avatar: "RS",
    trades: 1240,
    winRate: "68%",
    specialty: "Index Options",
  },
  {
    name: "Priya Mehta",
    avatar: "PM",
    trades: 892,
    winRate: "72%",
    specialty: "Positional",
  },
  {
    name: "Kiran Patel",
    avatar: "KP",
    trades: 2180,
    winRate: "65%",
    specialty: "Swing Trading",
  },
  {
    name: "Vikram Singh",
    avatar: "VS",
    trades: 1580,
    winRate: "71%",
    specialty: "MCX",
  },
];

interface Props {
  posts: CommunityPost[];
  toggleLike: (id: string) => void;
}

export default function CommunityPage({ posts, toggleLike }: Props) {
  const [newPost, setNewPost] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const tags = ["All", "Options", "Index", "Equity", "MCX"];

  const filteredPosts =
    activeTag === "All" ? posts : posts.filter((p) => p.tag === activeTag);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Community Feed</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Share your trading ideas with 60,000+ traders
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Posts */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Post creation */}
            <div
              className="bg-card border border-border rounded-xl p-4"
              data-ocid="community.panel"
            >
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                  AV
                </div>
                <div className="flex-1">
                  <Textarea
                    data-ocid="community.textarea"
                    placeholder="Share your trading idea, analysis, or market view..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="bg-background border-border text-foreground text-xs min-h-[80px] resize-none"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-1">
                      {["Options", "Index", "Equity", "MCX"].map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-[10px] text-muted-foreground border-border cursor-pointer hover:border-primary/50 hover:text-primary transition-colors"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      type="button"
                      data-ocid="community.submit_button"
                      size="sm"
                      className="h-7 px-3 text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
                      onClick={() => setNewPost("")}
                      disabled={!newPost.trim()}
                    >
                      <Send className="w-3 h-3" />
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tag filter */}
            <div className="flex gap-2" data-ocid="community.filter.tab">
              {tags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  data-ocid={`community.${tag.toLowerCase()}.tab`}
                  onClick={() => setActiveTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeTag === tag
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Posts list */}
            <div className="flex flex-col gap-3">
              {filteredPosts.map((post, i) => (
                <div
                  key={post.id}
                  data-ocid={`community.item.${i + 1}`}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold border border-primary/30">
                        {post.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {post.author}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-[9px] border-primary/30 text-primary"
                        >
                          {post.tag}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {post.time}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/40">
                    <button
                      type="button"
                      data-ocid={`community.like.${i + 1}`}
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 text-xs transition-colors ${
                        post.liked
                          ? "text-destructive"
                          : "text-muted-foreground hover:text-destructive"
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${post.liked ? "fill-current" : ""}`}
                      />
                      {post.likes} Likes
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      {post.replies} Replies
                    </button>
                    <button
                      type="button"
                      className="ml-auto flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      Follow Trade
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trader profiles sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <h2 className="text-sm font-semibold text-foreground mb-3">
                Top Traders
              </h2>
              <div className="flex flex-col gap-3">
                {TRADER_PROFILES.map((trader, i) => (
                  <div
                    key={trader.name}
                    data-ocid={`trader.item.${i + 1}`}
                    className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0"
                  >
                    <Avatar className="w-9 h-9 shrink-0">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold border border-primary/30">
                        {trader.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {trader.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {trader.specialty}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-success">
                        {trader.winRate}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {trader.trades} trades
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
              <p className="text-sm font-bold text-primary mb-1">
                🚀 Join 60,000+ Traders
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Get daily updates for Index FNO, Equity FNO, Market Trends &
                Real Time Intraday Updates.
              </p>
              <p className="text-xs font-semibold text-primary mt-2">
                Platform for Traders by Traders
              </p>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
