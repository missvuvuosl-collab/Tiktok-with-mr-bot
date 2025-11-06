import { useState, useEffect, useRef } from "react";
import { Heart, Gift } from "lucide-react";
import type { LiveMessage, LiveGift } from "@/lib/mockData";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface LiveChatProps {
  videoId: string;
}

const liveMessages = [
  "Salut tout le monde ! 👋",
  "Super live ! 🔥",
  "J'adore ce que tu fais !",
  "Incroyable ! Continue comme ça",
  "Trop bien ! 😍",
  "C'est génial 🎉",
  "Tu es le meilleur !",
  "Merci pour ce live 🙏",
  "J'apprends beaucoup",
  "Bravo ! 👏",
  "Continue comme ça !",
  "Tu gères trop 💪",
  "On adore !",
  "Super intéressant 🤩",
  "Merci de partager ça",
  "C'est incroyable",
  "Tu es inspirant",
  "Première fois que je te vois, super !",
  "Abonné ! ✅",
  "Like ❤️",
];

const usernames = [
  "techlover", "lifestylevibe", "fitnessqueen", "chef_marcus",
  "marie_voyage", "dj_soundwave", "yoga_zen", "gaming_pro",
  "fashion_emma", "comedien_alex", "creativemind", "artguru"
];

const gifts = [
  { name: "🌹 Rose", value: 1 },
  { name: "💝 Coeur", value: 5 },
  { name: "🎁 Cadeau", value: 10 },
  { name: "⭐ Étoile", value: 20 },
  { name: "💎 Diamant", value: 50 },
  { name: "👑 Couronne", value: 100 },
];

export default function LiveChat({ videoId }: LiveChatProps) {
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [floatingLikes, setFloatingLikes] = useState<{ id: string; left: number }[]>([]);
  const [recentGift, setRecentGift] = useState<LiveGift | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      const newMessage: LiveMessage = {
        id: `msg-${Date.now()}`,
        userId: `user${Math.floor(Math.random() * 12) + 1}`,
        username: usernames[Math.floor(Math.random() * usernames.length)],
        avatarUrl: "",
        text: liveMessages[Math.floor(Math.random() * liveMessages.length)],
        timestamp: new Date(),
      };

      setMessages(prev => [...prev.slice(-20), newMessage]);
    }, Math.random() * 2000 + 1500);

    const likeInterval = setInterval(() => {
      const newLike = {
        id: `like-${Date.now()}`,
        left: Math.random() * 80 + 10,
      };
      setFloatingLikes(prev => [...prev, newLike]);

      setTimeout(() => {
        setFloatingLikes(prev => prev.filter(like => like.id !== newLike.id));
      }, 3000);
    }, Math.random() * 3000 + 2000);

    const giftInterval = setInterval(() => {
      const gift = gifts[Math.floor(Math.random() * gifts.length)];
      const newGift: LiveGift = {
        id: `gift-${Date.now()}`,
        userId: `user${Math.floor(Math.random() * 12) + 1}`,
        username: usernames[Math.floor(Math.random() * usernames.length)],
        giftName: gift.name,
        giftValue: gift.value,
        timestamp: new Date(),
      };

      setRecentGift(newGift);
      setTimeout(() => setRecentGift(null), 3000);
    }, Math.random() * 8000 + 5000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(likeInterval);
      clearInterval(giftInterval);
    };
  }, [videoId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <div className="absolute left-4 bottom-32 w-64 max-h-80 pointer-events-auto">
        <div className="space-y-2 overflow-hidden">
          {messages.slice(-8).map((message) => (
            <div
              key={message.id}
              className="animate-in slide-in-from-bottom-2 duration-300 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-400">{message.username}</span>
              </div>
              <p className="break-words">{message.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {floatingLikes.map((like) => (
        <div
          key={like.id}
          className="absolute bottom-32 animate-in fade-in-0 slide-in-from-bottom-8 duration-1000"
          style={{
            left: `${like.left}%`,
            animation: "float-up 3s ease-out forwards",
          }}
        >
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
        </div>
      ))}

      {recentGift && (
        <div className="absolute top-32 left-1/2 transform -translate-x-1/2 animate-in zoom-in-50 duration-500 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full shadow-2xl pointer-events-none">
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6" />
            <div>
              <p className="font-bold">{recentGift.username}</p>
              <p className="text-sm">a envoyé {recentGift.giftName}</p>
            </div>
            <div className="text-2xl font-bold ml-2">
              {recentGift.giftValue}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-400px) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
