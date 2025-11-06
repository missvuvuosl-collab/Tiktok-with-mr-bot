import BottomNav from "../BottomNav";
import { useState } from "react";

export default function BottomNavExample() {
  const [activeTab, setActiveTab] = useState<"home" | "discover" | "create" | "inbox" | "profile">("home");

  return (
    <div className="bg-black h-screen relative">
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
