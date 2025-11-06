import InteractionButton from "../InteractionButton";
import { Heart } from "lucide-react";
import { useState } from "react";

export default function InteractionButtonExample() {
  const [isLiked, setIsLiked] = useState(false);
  const [count, setCount] = useState(12500);

  const handleClick = () => {
    setIsLiked(!isLiked);
    setCount(isLiked ? count - 1 : count + 1);
  };

  return (
    <div className="bg-black p-8">
      <InteractionButton
        icon={Heart}
        count={count}
        isActive={isLiked}
        onClick={handleClick}
        testId="button-like"
      />
    </div>
  );
}
