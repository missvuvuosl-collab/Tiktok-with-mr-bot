import type { Video } from "@shared/schema";
import avatar1 from "@assets/generated_images/Female_creator_profile_avatar_e8edf2bd.png";
import avatar2 from "@assets/generated_images/Male_creator_profile_avatar_b4810fe5.png";
import avatar3 from "@assets/generated_images/Female_creator_avatar_casual_1078f4ce.png";
import avatar4 from "@assets/generated_images/Male_creator_avatar_artistic_5d1cf773.png";
import avatar5 from "@assets/generated_images/Female_creator_avatar_sporty_f2872bda.png";

//todo: remove mock functionality
export const mockVideos: Video[] = [
  {
    id: "1",
    userId: "user1",
    username: "creativemind",
    avatarUrl: avatar1,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description: "Découvrez ma nouvelle création artistique 🎨✨ #art #creative",
    soundName: "Son original - creativemind",
    likes: 12500,
    comments: 234,
    shares: 89,
    isLiked: false,
  },
  {
    id: "2",
    userId: "user2",
    username: "techlover",
    avatarUrl: avatar2,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description: "Les meilleurs tips tech de la semaine 💻 #tech #tips #viral",
    soundName: "Trending Sound Mix",
    likes: 45200,
    comments: 892,
    shares: 456,
    isLiked: false,
  },
  {
    id: "3",
    userId: "user3",
    username: "lifestylevibe",
    avatarUrl: avatar3,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "Routine matinale pour bien commencer la journée ☀️ #lifestyle #morning",
    soundName: "Chill Vibes - DJ Mix",
    likes: 28900,
    comments: 567,
    shares: 234,
    isLiked: false,
  },
  {
    id: "4",
    userId: "user4",
    username: "artguru",
    avatarUrl: avatar4,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description: "L'art de la créativité en 30 secondes 🎭 #artistique #inspiration",
    soundName: "Son original - artguru",
    likes: 67800,
    comments: 1203,
    shares: 789,
    isLiked: false,
  },
  {
    id: "5",
    userId: "user5",
    username: "fitnessqueen",
    avatarUrl: avatar5,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    description: "Entraînement express 🔥 10 minutes pour tout brûler! #fitness #workout",
    soundName: "Workout Beats 2024",
    likes: 89300,
    comments: 1456,
    shares: 923,
    isLiked: false,
  },
];
