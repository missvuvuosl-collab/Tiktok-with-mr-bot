import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import VideoFeed from "./pages/VideoFeed";
import ProfilePage from "./pages/ProfilePage";
import DiscoverPage from "./pages/DiscoverPage";
import BottomNav from "./components/BottomNav";

type ActiveTab = "home" | "discover" | "create" | "inbox" | "profile";

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [viewingProfile, setViewingProfile] = useState<string | null>(null);

  const handleProfileClick = (userId: string) => {
    setViewingProfile(userId);
    setActiveTab("profile");
  };

  const handleBackFromProfile = () => {
    setViewingProfile(null);
    setActiveTab("home");
  };

  const handleTabChange = (tab: ActiveTab) => {
    if (tab === "profile") {
      setViewingProfile("user1");
    } else {
      setViewingProfile(null);
    }
    setActiveTab(tab);
  };

  const renderContent = () => {
    if (viewingProfile && activeTab === "profile") {
      return <ProfilePage userId={viewingProfile} onBack={handleBackFromProfile} />;
    }

    switch (activeTab) {
      case "home":
        return <VideoFeed onProfileClick={handleProfileClick} />;
      case "discover":
        return <DiscoverPage />;
      case "create":
        return (
          <div className="h-screen bg-background flex items-center justify-center">
            <p className="text-foreground text-lg">Création de vidéo - Bientôt disponible</p>
          </div>
        );
      case "inbox":
        return (
          <div className="h-screen bg-background flex items-center justify-center">
            <p className="text-foreground text-lg">Messages - Bientôt disponible</p>
          </div>
        );
      case "profile":
        return <ProfilePage userId="user1" onBack={handleBackFromProfile} />;
      default:
        return <VideoFeed onProfileClick={handleProfileClick} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="relative">
          {renderContent()}
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
