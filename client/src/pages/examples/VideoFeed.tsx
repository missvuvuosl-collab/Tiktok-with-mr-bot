import VideoFeed from "../VideoFeed";

export default function VideoFeedExample() {
  return (
    <VideoFeed onProfileClick={(userId) => console.log("View profile", userId)} />
  );
}
