import { useState } from "react";
import VideoPlayer from "./VideoPlayer";
import VideoInfo from "./VideoInfo";
import InteractionButton from "./InteractionButton";
import CommentSheet from "./CommentSheet";
import { Heart, MessageCircle, Share2, MoreHorizontal, Users } from "lucide-react";
import type { Video, Comment } from "@shared/schema";

interface VideoCardProps {
  video: Video;
  isActive: boolean;
  comments: Comment[];
  onLike: (videoId: string) => void;
  onAddComment: (videoId: string, text: string) => void;
  onLikeComment: (commentId: string) => void;
  onShare: (videoId: string) => void;
  onProfileClick: (userId: string) => void;
}

export default function VideoCard({ 
  video, 
  isActive, 
  comments,
  onLike, 
  onAddComment,
  onLikeComment,
  onShare,
  onProfileClick 
}: VideoCardProps) {
  const [localLiked, setLocalLiked] = useState(video.isLiked);
  const [localLikeCount, setLocalLikeCount] = useState(video.likes);
  const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);

  const handleLike = () => {
    setLocalLiked(!localLiked);
    setLocalLikeCount(localLiked ? localLikeCount - 1 : localLikeCount + 1);
    onLike(video.id);
  };

  const handleDoubleClick = () => {
    if (!localLiked) {
      setLocalLiked(true);
      setLocalLikeCount(localLikeCount + 1);
      onLike(video.id);
    }
  };

  const handleAddComment = (text: string) => {
    onAddComment(video.id, text);
  };

  const videoCommentCount = (comments || []).filter(c => c.videoId === video.id).length;

  return (
    <>
      <div className="relative w-full h-screen snap-start snap-always" data-testid={`video-card-${video.id}`}>
        <VideoPlayer
          videoUrl={video.videoUrl}
          isActive={isActive}
          onVideoClick={() => {}}
          onDoubleClick={handleDoubleClick}
        />
        
        {video.isLive && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
            <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-md font-semibold animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span className="text-sm">LIVE</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-md">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{(video.viewersCount || 0).toLocaleString()}</span>
            </div>
          </div>
        )}
        
        <VideoInfo
          username={video.username}
          avatarUrl={video.avatarUrl}
          description={video.description}
          soundName={video.soundName}
          onAvatarClick={() => onProfileClick(video.userId)}
        />

        <div className="absolute right-4 bottom-24 space-y-6">
          <InteractionButton
            icon={Heart}
            count={localLikeCount}
            isActive={localLiked}
            onClick={handleLike}
            testId="button-like"
          />
          <InteractionButton
            icon={MessageCircle}
            count={videoCommentCount}
            onClick={() => setIsCommentSheetOpen(true)}
            testId="button-comment"
          />
          <InteractionButton
            icon={Share2}
            count={video.shares}
            onClick={() => onShare(video.id)}
            testId="button-share"
          />
          <InteractionButton
            icon={MoreHorizontal}
            count={0}
            onClick={() => console.log("More options")}
            testId="button-more"
          />
        </div>
      </div>

      <CommentSheet
        isOpen={isCommentSheetOpen}
        onClose={() => setIsCommentSheetOpen(false)}
        videoId={video.id}
        comments={comments}
        onAddComment={handleAddComment}
        onLikeComment={onLikeComment}
      />
    </>
  );
}
