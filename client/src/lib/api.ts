import type { Comment, UserProfile, Video } from "@shared/schema";

export async function getVideos(): Promise<Video[]> {
  const response = await fetch("/api/videos");
  if (!response.ok) throw new Error("Failed to fetch videos");
  return response.json();
}

export async function getCommentsByVideoId(videoId: string): Promise<Comment[]> {
  const response = await fetch(`/api/videos/${videoId}/comments`);
  if (!response.ok) throw new Error("Failed to fetch comments");
  const comments = await response.json();
  return comments.map((c: any) => ({
    ...c,
    createdAt: new Date(c.createdAt),
  }));
}

export async function addComment(videoId: string, data: {
  userId: string;
  username: string;
  avatarUrl: string;
  text: string;
}): Promise<Comment> {
  const response = await fetch(`/api/videos/${videoId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to add comment");
  const comment = await response.json();
  return {
    ...comment,
    createdAt: new Date(comment.createdAt),
  };
}

export async function likeComment(commentId: string): Promise<Comment> {
  const response = await fetch(`/api/comments/${commentId}/like`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to like comment");
  const comment = await response.json();
  return {
    ...comment,
    createdAt: new Date(comment.createdAt),
  };
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const response = await fetch(`/api/users/${userId}/profile`);
  if (!response.ok) throw new Error("Failed to fetch user profile");
  return response.json();
}

export async function followUser(userId: string, followerId: string): Promise<void> {
  const response = await fetch(`/api/users/${userId}/follow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ followerId }),
  });
  if (!response.ok) throw new Error("Failed to follow user");
}

export async function unfollowUser(userId: string, followerId: string): Promise<void> {
  const response = await fetch(`/api/users/${userId}/follow`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ followerId }),
  });
  if (!response.ok) throw new Error("Failed to unfollow user");
}

export async function checkIsFollowing(userId: string, targetUserId: string): Promise<boolean> {
  const response = await fetch(`/api/users/${userId}/following/${targetUserId}`);
  if (!response.ok) throw new Error("Failed to check follow status");
  const data = await response.json();
  return data.isFollowing;
}
