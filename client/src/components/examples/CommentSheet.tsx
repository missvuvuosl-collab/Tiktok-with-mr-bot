import CommentSheet from "../CommentSheet";
import { useState } from "react";
import { mockComments } from "@/lib/mockData";

export default function CommentSheetExample() {
  const [isOpen, setIsOpen] = useState(true);
  const [comments, setComments] = useState(mockComments);

  const handleAddComment = (text: string) => {
    console.log("Adding comment:", text);
    const newComment = {
      id: `c${Date.now()}`,
      videoId: "1",
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
    <div className="h-screen bg-background">
      <button
        onClick={() => setIsOpen(true)}
        className="p-4 bg-primary text-white"
      >
        Open Comments
      </button>
      <CommentSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        videoId="1"
        comments={comments}
        onAddComment={handleAddComment}
        onLikeComment={(id) => console.log("Liked comment:", id)}
      />
    </div>
  );
}
