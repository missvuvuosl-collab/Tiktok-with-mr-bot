import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { mockVideos, mockUserProfiles } from "@/lib/mockData";
import { getUserProfile, followUser, unfollowUser, checkIsFollowing } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";

interface ProfilePageProps {
  userId: string;
  onBack: () => void;
}

export default function ProfilePage({ userId, onBack }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<"videos" | "liked">("videos");
  
  //todo: remove mock functionality - replace with real API call
  const { data: userProfile } = useQuery({
    queryKey: ["/api/users", userId, "profile"],
    queryFn: () => getUserProfile(userId),
    enabled: false, // Using mock data for now
  });

  //todo: remove mock functionality - use real profile from API
  const profile = userProfile || mockUserProfiles.find(p => p.userId === userId);
  const userVideos = mockVideos.filter(v => v.userId === userId);

  const [isFollowing, setIsFollowing] = useState(false);
  const [localFollowersCount, setLocalFollowersCount] = useState(
    profile?.followersCount || 0
  );

  useEffect(() => {
    if (profile) {
      setLocalFollowersCount(profile.followersCount);
    }
  }, [profile]);

  //todo: remove mock functionality - replace with real API call
  const { data: followStatus } = useQuery({
    queryKey: ["/api/users", "current-user", "following", userId],
    queryFn: () => checkIsFollowing("current-user", userId),
    enabled: false, // Using mock data for now
  });

  useEffect(() => {
    if (followStatus !== undefined) {
      setIsFollowing(followStatus);
    }
  }, [followStatus]);

  const followMutation = useMutation({
    mutationFn: () => followUser(userId, "current-user"),
    onMutate: () => {
      setIsFollowing(true);
      setLocalFollowersCount((prev) => prev + 1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", "current-user", "following", userId] });
    },
    onError: (error) => {
      setIsFollowing(false);
      setLocalFollowersCount((prev) => Math.max(0, prev - 1));
      console.error("Failed to follow user:", error);
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser(userId, "current-user"),
    onMutate: () => {
      setIsFollowing(false);
      setLocalFollowersCount((prev) => Math.max(0, prev - 1));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", "current-user", "following", userId] });
    },
    onError: (error) => {
      setIsFollowing(true);
      setLocalFollowersCount((prev) => prev + 1);
      console.error("Failed to unfollow user:", error);
    },
  });

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  const formatCount = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  if (!profile) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Utilisateur non trouvé</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background overflow-y-auto pb-20">
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={onBack}
            className="hover-elevate active-elevate-2 p-2 -ml-2"
            data-testid="button-back"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground" data-testid="text-profile-username">
            @{profile.username}
          </h1>
          <button className="hover-elevate active-elevate-2 p-2 -mr-2" data-testid="button-menu">
            <MoreVertical className="w-6 h-6 text-foreground" />
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24" data-testid="avatar-profile">
            <AvatarImage src={profile.avatarUrl} />
            <AvatarFallback>{profile.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">@{profile.username}</h2>
            {profile.bio && (
              <p className="text-sm text-muted-foreground mt-2 max-w-sm" data-testid="text-bio">
                {profile.bio}
              </p>
            )}
          </div>

          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground" data-testid="stat-following">
                {formatCount(profile.followingCount)}
              </div>
              <div className="text-sm text-muted-foreground">Abonnements</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground" data-testid="stat-followers">
                {formatCount(localFollowersCount)}
              </div>
              <div className="text-sm text-muted-foreground">Abonnés</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground" data-testid="stat-likes">
                {formatCount(profile.likesCount)}
              </div>
              <div className="text-sm text-muted-foreground">J'aime</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant={isFollowing ? "outline" : "default"}
              className="px-8" 
              onClick={handleFollowToggle}
              disabled={followMutation.isPending || unfollowMutation.isPending}
              data-testid="button-follow"
            >
              {isFollowing ? "Abonné" : "Suivre"}
            </Button>
            <Button variant="outline" data-testid="button-message">
              Message
            </Button>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <div className="flex border-b border-border">
            <button 
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === "videos" 
                  ? "text-foreground border-b-2 border-primary" 
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("videos")}
              data-testid="tab-videos"
            >
              Vidéos
            </button>
            <button 
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === "liked" 
                  ? "text-foreground border-b-2 border-primary" 
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("liked")}
              data-testid="tab-liked"
            >
              J'aime
            </button>
          </div>

          {activeTab === "videos" ? (
            <div className="grid grid-cols-3 gap-1 mt-4">
              {userVideos.length === 0 ? (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground" data-testid="text-no-videos">
                    Aucune vidéo publiée
                  </p>
                </div>
              ) : (
                userVideos.map((video) => (
                  <div
                    key={video.id}
                    className="relative aspect-[9/16] bg-card rounded-md overflow-hidden hover-elevate cursor-pointer"
                    data-testid={`video-thumbnail-${video.id}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs font-medium line-clamp-2">
                        {video.description}
                      </p>
                      <span className="text-white text-xs">
                        {formatCount(video.likes)} J'aime
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground" data-testid="text-private-likes">
                Les vidéos que cet utilisateur a aimées sont privées
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
