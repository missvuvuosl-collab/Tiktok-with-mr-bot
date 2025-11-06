import VideoInfo from "../VideoInfo";
import avatar from "@assets/generated_images/Female_creator_profile_avatar_e8edf2bd.png";

export default function VideoInfoExample() {
  return (
    <div className="bg-black h-64 relative">
      <VideoInfo
        username="creativemind"
        avatarUrl={avatar}
        description="Découvrez ma nouvelle création artistique 🎨✨ #art #creative"
        soundName="Son original - creativemind"
        onAvatarClick={() => console.log("Avatar clicked")}
      />
    </div>
  );
}
