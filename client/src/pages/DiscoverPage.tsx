import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { mockVideos } from "@/lib/mockData";
import { useState } from "react";

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const trendingHashtags = [
    { tag: "art", views: "2.5M" },
    { tag: "tech", views: "1.8M" },
    { tag: "lifestyle", views: "3.2M" },
    { tag: "fitness", views: "2.1M" },
    { tag: "creative", views: "1.5M" },
  ];

  return (
    <div className="h-screen bg-background overflow-y-auto pb-20">
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10 p-4">
        <h1 className="text-xl font-bold text-foreground mb-4">Découvrir</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full"
            data-testid="input-search"
          />
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Tendances</h2>
          <div className="space-y-2">
            {trendingHashtags.map((item) => (
              <button
                key={item.tag}
                className="w-full flex items-center justify-between p-4 bg-card rounded-md hover-elevate active-elevate-2"
                data-testid={`hashtag-${item.tag}`}
              >
                <div className="text-left">
                  <div className="font-semibold text-foreground">#{item.tag}</div>
                  <div className="text-sm text-muted-foreground">{item.views} vues</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Vidéos populaires</h2>
          <div className="grid grid-cols-2 gap-2">
            {mockVideos.map((video) => (
              <div
                key={video.id}
                className="relative aspect-[9/16] bg-card rounded-md overflow-hidden hover-elevate cursor-pointer"
                data-testid={`discover-video-${video.id}`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs font-medium line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-white text-xs">
                      {(video.likes / 1000).toFixed(1)}K
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
