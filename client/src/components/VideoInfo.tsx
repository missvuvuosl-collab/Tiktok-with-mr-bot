import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Music2 } from "lucide-react";

interface VideoInfoProps {
  username: string;
  avatarUrl: string;
  description: string;
  soundName: string;
  onAvatarClick: () => void;
}

export default function VideoInfo({ username, avatarUrl, description, soundName, onAvatarClick }: VideoInfoProps) {
  return (
    <div className="absolute bottom-20 left-0 right-0 px-4 pb-4 space-y-3">
      <div className="flex items-end gap-3">
        <button 
          onClick={onAvatarClick}
          className="hover-elevate active-elevate-2"
          data-testid="button-avatar"
        >
          <Avatar className="w-12 h-12 border-2 border-white" data-testid="avatar-user">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </button>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-base" data-testid="text-username">
              @{username}
            </span>
          </div>
          
          <p className="text-white text-sm leading-snug line-clamp-2" data-testid="text-description">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-hidden">
        <Music2 className="w-4 h-4 text-white flex-shrink-0" />
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            <span className="text-white text-sm" data-testid="text-sound">
              {soundName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
