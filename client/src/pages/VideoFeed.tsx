import { useState, useRef, useEffect } from "react";
import VideoCard from "@/components/VideoCard";
import { mockVideos } from "@/lib/mockData";

interface VideoFeedProps {
  onProfileClick: (userId: string) => void;
}

export default function VideoFeed({ onProfileClick }: VideoFeedProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const videoHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / videoHeight);
      
      if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < mockVideos.length) {
        setCurrentVideoIndex(newIndex);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentVideoIndex]);

  const handleLike = (videoId: string) => {
    console.log("Liked video:", videoId);
  };

  const handleComment = (videoId: string) => {
    console.log("Comment on video:", videoId);
  };

  const handleShare = (videoId: string) => {
    console.log("Share video:", videoId);
  };

  return (
    <div 
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory"
      data-testid="video-feed"
    >
      {mockVideos.map((video, index) => (
        <VideoCard
          key={video.id}
          video={video}
          isActive={index === currentVideoIndex}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onProfileClick={onProfileClick}
        />
      ))}
    </div>
  );
}
