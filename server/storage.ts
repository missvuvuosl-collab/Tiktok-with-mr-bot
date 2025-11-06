import { 
  type User, 
  type InsertUser, 
  type Video, 
  type InsertVideo,
  type Comment,
  type InsertComment,
  type Follow,
  type InsertFollow,
  type UserProfile,
  type InsertUserProfile
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getVideos(): Promise<Video[]>;
  getVideo(id: string): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  
  getCommentsByVideoId(videoId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  likeComment(commentId: string): Promise<Comment | undefined>;
  
  followUser(follow: InsertFollow): Promise<Follow>;
  unfollowUser(followerId: string, followingId: string): Promise<boolean>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private videos: Map<string, Video>;
  private comments: Map<string, Comment>;
  private follows: Map<string, Follow>;
  private userProfiles: Map<string, UserProfile>;

  constructor() {
    this.users = new Map();
    this.videos = new Map();
    this.comments = new Map();
    this.follows = new Map();
    this.userProfiles = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getVideos(): Promise<Video[]> {
    return Array.from(this.videos.values());
  }

  async getVideo(id: string): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = randomUUID();
    const video: Video = { 
      ...insertVideo, 
      id,
      likes: insertVideo.likes ?? 0,
      comments: insertVideo.comments ?? 0,
      shares: insertVideo.shares ?? 0,
      isLiked: insertVideo.isLiked ?? false
    };
    this.videos.set(id, video);
    return video;
  }

  async getCommentsByVideoId(videoId: string): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.videoId === videoId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = { 
      ...insertComment, 
      id,
      likes: insertComment.likes ?? 0,
      createdAt: new Date()
    };
    this.comments.set(id, comment);
    
    const video = this.videos.get(insertComment.videoId);
    if (video) {
      video.comments += 1;
      this.videos.set(video.id, video);
    }
    
    return comment;
  }

  async likeComment(commentId: string): Promise<Comment | undefined> {
    const comment = this.comments.get(commentId);
    if (comment) {
      comment.likes += 1;
      this.comments.set(commentId, comment);
    }
    return comment;
  }

  async followUser(insertFollow: InsertFollow): Promise<Follow> {
    const id = randomUUID();
    const follow: Follow = {
      ...insertFollow,
      id,
      createdAt: new Date()
    };
    this.follows.set(id, follow);
    
    const followerProfile = this.userProfiles.get(insertFollow.followerId);
    if (followerProfile) {
      followerProfile.followingCount += 1;
      this.userProfiles.set(insertFollow.followerId, followerProfile);
    }
    
    const followingProfile = this.userProfiles.get(insertFollow.followingId);
    if (followingProfile) {
      followingProfile.followersCount += 1;
      this.userProfiles.set(insertFollow.followingId, followingProfile);
    }
    
    return follow;
  }

  async unfollowUser(followerId: string, followingId: string): Promise<boolean> {
    const followToRemove = Array.from(this.follows.values()).find(
      f => f.followerId === followerId && f.followingId === followingId
    );
    
    if (followToRemove) {
      this.follows.delete(followToRemove.id);
      
      const followerProfile = this.userProfiles.get(followerId);
      if (followerProfile && followerProfile.followingCount > 0) {
        followerProfile.followingCount -= 1;
        this.userProfiles.set(followerId, followerProfile);
      }
      
      const followingProfile = this.userProfiles.get(followingId);
      if (followingProfile && followingProfile.followersCount > 0) {
        followingProfile.followersCount -= 1;
        this.userProfiles.set(followingId, followingProfile);
      }
      
      return true;
    }
    
    return false;
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    return Array.from(this.follows.values()).some(
      f => f.followerId === followerId && f.followingId === followingId
    );
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    return this.userProfiles.get(userId);
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const profile: UserProfile = { 
      ...insertProfile,
      bio: insertProfile.bio ?? null,
      followersCount: insertProfile.followersCount ?? 0,
      followingCount: insertProfile.followingCount ?? 0,
      likesCount: insertProfile.likesCount ?? 0,
      videosCount: insertProfile.videosCount ?? 0
    };
    this.userProfiles.set(profile.userId, profile);
    return profile;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined> {
    const profile = this.userProfiles.get(userId);
    if (profile) {
      const updated = { ...profile, ...updates };
      this.userProfiles.set(userId, updated);
      return updated;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
