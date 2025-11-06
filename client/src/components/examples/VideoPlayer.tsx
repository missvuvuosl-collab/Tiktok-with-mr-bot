import VideoPlayer from "../VideoPlayer";
import { useState } from "react";

export default function VideoPlayerExample() {
  const [isActive] = useState(true);

  return (
    <VideoPlayer
      videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      isActive={isActive}
      onVideoClick={() => console.log("Video clicked")}
      onDoubleClick={() => console.log("Double clicked for like")}
    />
  );
}
