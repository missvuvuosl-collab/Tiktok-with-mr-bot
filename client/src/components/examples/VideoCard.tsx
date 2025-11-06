import VideoCard from "../VideoCard";
import { mockVideos, mockComments } from "@/lib/mockData";
import { useState } from "react";

export default function VideoCardExample() {
  const [comments, setComments] = useState(mockComments);

  const handleAddComment = (videoId: string, text: string) => {
    const newComment = {
      id: `c${Date.now()}`,
      videoId,
      userId: "current-user",
      username: "moi",
      avatarUrl: mockComments[0].avatarUrl,
      text,
      likes: 0,
      createdAt: new Date(),
    };
    setComments([...comments, newComment]);
  };

  return (
    <div className="h-screen">
      <VideoCard
        video={mockVideos[0]}
        isActive={true}
        comments={comments}
        onLike={(id) => console.log("Liked video", id)}
        onAddComment={handleAddComment}
        onLikeComment={(id) => console.log("Liked comment", id)}
        onShare={(id) => console.log("Share video", id)}
        onProfileClick={(userId) => console.log("View profile", userId)}
      />
    </div>
  );
}
