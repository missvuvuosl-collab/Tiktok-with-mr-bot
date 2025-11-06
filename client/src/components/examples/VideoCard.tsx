import VideoCard from "../VideoCard";
import { mockVideos } from "@/lib/mockData";

export default function VideoCardExample() {
  return (
    <div className="h-screen">
      <VideoCard
        video={mockVideos[0]}
        isActive={true}
        onLike={(id) => console.log("Liked video", id)}
        onComment={(id) => console.log("Comment on video", id)}
        onShare={(id) => console.log("Share video", id)}
        onProfileClick={(userId) => console.log("View profile", userId)}
      />
    </div>
  );
}
