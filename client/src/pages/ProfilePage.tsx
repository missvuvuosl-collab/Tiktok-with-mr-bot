import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { mockVideos } from "@/lib/mockData";

interface ProfilePageProps {
  userId: string;
  onBack: () => void;
}

export default function ProfilePage({ userId, onBack }: ProfilePageProps) {
  const userVideos = mockVideos.filter(v => v.userId === userId);
  const user = userVideos[0];

  if (!user) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Utilisateur non trouvé</p>
      </div>
    );
  }

  const totalLikes = userVideos.reduce((sum, v) => sum + v.likes, 0);

  return (
    <div className="h-screen bg-background overflow-y-auto">
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={onBack}
            className="hover-elevate active-elevate-2 p-2 -ml-2"
            data-testid="button-back"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground" data-testid="text-username">
            @{user.username}
          </h1>
          <button className="hover-elevate active-elevate-2 p-2 -mr-2" data-testid="button-menu">
            <MoreVertical className="w-6 h-6 text-foreground" />
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24" data-testid="avatar-profile">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">@{user.username}</h2>
          </div>

          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground" data-testid="stat-following">
                247
              </div>
              <div className="text-sm text-muted-foreground">Abonnements</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground" data-testid="stat-followers">
                12.5K
              </div>
              <div className="text-sm text-muted-foreground">Abonnés</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground" data-testid="stat-likes">
                {(totalLikes / 1000).toFixed(1)}K
              </div>
              <div className="text-sm text-muted-foreground">J'aime</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="default" className="px-8" data-testid="button-follow">
              Suivre
            </Button>
            <Button variant="outline" data-testid="button-message">
              Message
            </Button>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <div className="flex border-b border-border">
            <button className="flex-1 py-3 text-center font-medium text-foreground border-b-2 border-primary" data-testid="tab-videos">
              Vidéos
            </button>
            <button className="flex-1 py-3 text-center font-medium text-muted-foreground" data-testid="tab-liked">
              J'aime
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1 mt-4">
            {userVideos.map((video) => (
              <div
                key={video.id}
                className="relative aspect-[9/16] bg-card hover-elevate cursor-pointer"
                data-testid={`video-thumbnail-${video.id}`}
              >
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="text-white text-xs font-medium">
                    {(video.likes / 1000).toFixed(1)}K
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
