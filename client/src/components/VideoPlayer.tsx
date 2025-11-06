import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  isActive: boolean;
  onVideoClick: () => void;
  onDoubleClick: () => void;
}

export default function VideoPlayer({ videoUrl, isActive, onVideoClick, onDoubleClick }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPlayIcon, setShowPlayIcon] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive && isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, isPlaying]);

  const handleVideoClick = () => {
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    setShowPlayIcon(!newPlayingState);
    setTimeout(() => setShowPlayIcon(false), 500);
    onVideoClick();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-full h-full bg-black" onClick={handleVideoClick} onDoubleClick={onDoubleClick}>
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        data-testid="video-player"
      />
      
      {showPlayIcon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {isPlaying ? (
            <Play className="w-20 h-20 text-white opacity-80" data-testid="icon-play" />
          ) : (
            <Pause className="w-20 h-20 text-white opacity-80" data-testid="icon-pause" />
          )}
        </div>
      )}

      <button
        onClick={toggleMute}
        className="absolute bottom-20 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover-elevate active-elevate-2"
        data-testid="button-mute-toggle"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </button>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
        <div
          className="h-full bg-white transition-all"
          style={{ width: `${progress}%` }}
          data-testid="video-progress"
        />
      </div>
    </div>
  );
}
