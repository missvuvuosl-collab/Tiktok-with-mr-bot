import { Home, Search, PlusSquare, MessageCircle, User } from "lucide-react";

interface BottomNavProps {
  activeTab: "home" | "discover" | "create" | "inbox" | "profile";
  onTabChange: (tab: "home" | "discover" | "create" | "inbox" | "profile") => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "home" as const, icon: Home, label: "Accueil" },
    { id: "discover" as const, icon: Search, label: "Découvrir" },
    { id: "create" as const, icon: PlusSquare, label: "Créer" },
    { id: "inbox" as const, icon: MessageCircle, label: "Boîte de réception" },
    { id: "profile" as const, icon: User, label: "Profil" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-lg border-t border-white/10 z-50">
      <div className="flex items-center justify-around h-full px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 min-w-[60px] h-full hover-elevate active-elevate-2 ${
                isActive ? "opacity-100" : "opacity-60"
              }`}
              data-testid={`button-nav-${tab.id}`}
            >
              <Icon className={`${tab.id === "create" ? "w-8 h-8" : "w-6 h-6"} ${
                isActive ? "text-white fill-white" : "text-white"
              }`} />
              <span className="text-xs font-medium text-white">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
