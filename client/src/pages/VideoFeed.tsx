import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import VideoCard from "@/components/VideoCard";
import { mockVideos, mockComments } from "@/lib/mockData";
import { queryClient } from "@/lib/queryClient";
import { addComment, likeComment } from "@/lib/api";
import type { Comment, Video } from "@shared/schema";

interface VideoFeedProps {
  onProfileClick: (userId: string) => void;
}

type FeedType = "pour-toi" | "abonnements";

export default function VideoFeed({ onProfileClick }: VideoFeedProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [feedType, setFeedType] = useState<FeedType>("pour-toi");
  const containerRef = useRef<HTMLDivElement>(null);

  //todo: remove mock functionality - replace with real API call
  const { data } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
    enabled: false, // Using mock data for now
  });
  const videos = data ?? mockVideos;

  //todo: remove mock functionality - replace with real API call
  const { data: commentsData } = useQuery<Comment[]>({
    queryKey: ["/api/comments"],
    enabled: false, // Using mock data for now
  });
  const comments = commentsData ?? mockComments;

  const [localComments, setLocalComments] = useState<Comment[]>(comments);

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const videoHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / videoHeight);
      
      if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videos.length) {
        setCurrentVideoIndex(newIndex);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentVideoIndex, videos.length]);

  const addCommentMutation = useMutation({
    mutationFn: ({ videoId, text }: { videoId: string; text: string }) =>
      addComment(videoId, {
        userId: "current-user",
        username: "moi",
        avatarUrl: videos[0]?.avatarUrl || "",
        text,
      }),
    onMutate: async ({ videoId, text }) => {
      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        videoId,
        userId: "current-user",
        username: "moi",
        avatarUrl: videos[0]?.avatarUrl || "",
        text,
        likes: 0,
        createdAt: new Date(),
      };
      setLocalComments((prev) => [...prev, optimisticComment]);
      return { optimisticComment };
    },
    onSuccess: (newComment, variables, context) => {
      setLocalComments((prev) =>
        prev.map((c) =>
          c.id === context?.optimisticComment.id ? newComment : c
        )
      );
      queryClient.invalidateQueries({ queryKey: ["/api/comments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/videos", variables.videoId, "comments"] });
    },
    onError: (error, variables, context) => {
      if (context?.optimisticComment) {
        setLocalComments((prev) =>
          prev.filter((c) => c.id !== context.optimisticComment.id)
        );
      }
      console.error("Failed to add comment:", error);
    },
  });

  const likeCommentMutation = useMutation({
    mutationFn: (commentId: string) => likeComment(commentId),
    onMutate: async (commentId) => {
      setLocalComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, likes: c.likes + 1 } : c
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comments"] });
    },
    onError: (error, commentId) => {
      setLocalComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, likes: Math.max(0, c.likes - 1) } : c
        )
      );
      console.error("Failed to like comment:", error);
    },
  });

  const handleLike = (videoId: string) => {
    console.log("Liked video:", videoId);
  };

  const handleAddComment = (videoId: string, text: string) => {
    addCommentMutation.mutate({ videoId, text });
  };

  const handleLikeComment = (commentId: string) => {
    likeCommentMutation.mutate(commentId);
  };

  const handleShare = (videoId: string) => {
    console.log("Share video:", videoId);
  };

  const filteredVideos = feedType === "abonnements" 
    ? videos.filter(v => ["user2", "user5"].includes(v.userId))
    : videos;

  return (
    <div className="relative h-screen">
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-center items-center gap-8 pt-4 pb-2 bg-gradient-to-b from-black/70 to-transparent">
        <button
          onClick={() => {
            setFeedType("abonnements");
            setCurrentVideoIndex(0);
          }}
          className={`text-lg font-medium transition-all ${
            feedType === "abonnements"
              ? "text-white scale-110"
              : "text-white/60"
          }`}
        >
          Abonnements
        </button>
        <div className="w-px h-4 bg-white/30" />
        <button
          onClick={() => {
            setFeedType("pour-toi");
            setCurrentVideoIndex(0);
          }}
          className={`text-lg font-medium transition-all ${
            feedType === "pour-toi"
              ? "text-white scale-110"
              : "text-white/60"
          }`}
        >
          Pour toi
        </button>
      </div>

      <div 
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory"
        data-testid="video-feed"
      >
        {filteredVideos.map((video, index) => (
          <VideoCard
            key={video.id}
            video={video}
            isActive={index === currentVideoIndex}
            comments={localComments}
            onLike={handleLike}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            onShare={handleShare}
            onProfileClick={onProfileClick}
          />
        ))}
      </div>
    </div>
  );
}
