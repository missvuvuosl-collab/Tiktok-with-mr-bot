import ProfilePage from "../ProfilePage";

export default function ProfilePageExample() {
  return (
    <ProfilePage 
      userId="user1" 
      onBack={() => console.log("Back clicked")} 
    />
  );
}
