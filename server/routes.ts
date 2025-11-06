import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCommentSchema, insertFollowSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all videos
  app.get("/api/videos", async (req, res) => {
    try {
      const videos = await storage.getVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  // Get comments for a video
  app.get("/api/videos/:videoId/comments", async (req, res) => {
    try {
      const { videoId } = req.params;
      const comments = await storage.getCommentsByVideoId(videoId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  // Add a comment to a video
  app.post("/api/videos/:videoId/comments", async (req, res) => {
    try {
      const { videoId } = req.params;
      const commentData = insertCommentSchema.parse({
        ...req.body,
        videoId,
      });
      
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid comment data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create comment" });
      }
    }
  });

  // Like a comment
  app.post("/api/comments/:commentId/like", async (req, res) => {
    try {
      const { commentId } = req.params;
      const comment = await storage.likeComment(commentId);
      
      if (!comment) {
        res.status(404).json({ error: "Comment not found" });
        return;
      }
      
      res.json(comment);
    } catch (error) {
      res.status(500).json({ error: "Failed to like comment" });
    }
  });

  // Get user profile
  app.get("/api/users/:userId/profile", async (req, res) => {
    try {
      const { userId } = req.params;
      const profile = await storage.getUserProfile(userId);
      
      if (!profile) {
        res.status(404).json({ error: "User profile not found" });
        return;
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });

  // Follow a user
  app.post("/api/users/:userId/follow", async (req, res) => {
    try {
      const { userId } = req.params;
      const followData = insertFollowSchema.parse({
        ...req.body,
        followingId: userId,
      });
      
      const isAlreadyFollowing = await storage.isFollowing(
        followData.followerId,
        userId
      );
      
      if (isAlreadyFollowing) {
        res.status(400).json({ error: "Already following this user" });
        return;
      }
      
      const follow = await storage.followUser(followData);
      res.status(201).json(follow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid follow data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to follow user" });
      }
    }
  });

  // Unfollow a user
  app.delete("/api/users/:userId/follow", async (req, res) => {
    try {
      const { userId } = req.params;
      const { followerId } = req.body;
      
      if (!followerId) {
        res.status(400).json({ error: "followerId is required" });
        return;
      }
      
      const success = await storage.unfollowUser(followerId, userId);
      
      if (!success) {
        res.status(404).json({ error: "Follow relationship not found" });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to unfollow user" });
    }
  });

  // Check if user is following another user
  app.get("/api/users/:userId/following/:targetUserId", async (req, res) => {
    try {
      const { userId, targetUserId } = req.params;
      const isFollowing = await storage.isFollowing(userId, targetUserId);
      res.json({ isFollowing });
    } catch (error) {
      res.status(500).json({ error: "Failed to check follow status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
