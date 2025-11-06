import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Send } from "lucide-react";
import type { Comment } from "@shared/schema";

interface CommentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  comments: Comment[];
  onAddComment: (text: string) => void;
  onLikeComment: (commentId: string) => void;
}

export default function CommentSheet({
  isOpen,
  onClose,
  videoId,
  comments,
  onAddComment,
  onLikeComment,
}: CommentSheetProps) {
  const [newComment, setNewComment] = useState("");
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  const handleLikeComment = (commentId: string) => {
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
    onLikeComment(commentId);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}j`;
  };

  const videoComments = comments.filter((c) => c.videoId === videoId);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-3xl" data-testid="sheet-comments">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-4 py-4 border-b border-border">
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-3" />
            <SheetTitle className="text-center" data-testid="text-comments-count">
              {videoComments.length} commentaires
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {videoComments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-muted-foreground" data-testid="text-no-comments">
                  Aucun commentaire pour le moment.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Soyez le premier à commenter !
                </p>
              </div>
            ) : (
              videoComments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex gap-3"
                  data-testid={`comment-${comment.id}`}
                >
                  <Avatar className="w-10 h-10 flex-shrink-0" data-testid={`avatar-${comment.username}`}>
                    <AvatarImage src={comment.avatarUrl} />
                    <AvatarFallback>{comment.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-sm text-foreground" data-testid={`username-${comment.username}`}>
                        {comment.username}
                      </span>
                      <span className="text-xs text-muted-foreground" data-testid={`time-${comment.id}`}>
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mt-1" data-testid={`text-${comment.id}`}>
                      {comment.text}
                    </p>
                  </div>

                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className="flex flex-col items-center gap-1 flex-shrink-0 hover-elevate active-elevate-2 px-2"
                    data-testid={`button-like-comment-${comment.id}`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        likedComments.has(comment.id)
                          ? "text-primary fill-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-xs text-muted-foreground" data-testid={`likes-${comment.id}`}>
                      {likedComments.has(comment.id) ? comment.likes + 1 : comment.likes}
                    </span>
                  </button>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-border p-4 bg-background"
          >
            <div className="flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className="flex-1"
                data-testid="input-comment"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!newComment.trim()}
                data-testid="button-send-comment"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
