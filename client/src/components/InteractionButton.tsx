import { LucideIcon } from "lucide-react";

interface InteractionButtonProps {
  icon: LucideIcon;
  count: number;
  isActive?: boolean;
  onClick: () => void;
  testId?: string;
}

export default function InteractionButton({ 
  icon: Icon, 
  count, 
  isActive = false, 
  onClick,
  testId 
}: InteractionButtonProps) {
  const formatCount = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 hover-elevate active-elevate-2"
      data-testid={testId}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
        isActive ? "bg-primary" : "bg-white/10 backdrop-blur-sm"
      }`}>
        <Icon className={`w-6 h-6 ${isActive ? "text-white fill-white" : "text-white"}`} />
      </div>
      <span className="text-xs font-medium text-white" data-testid={`${testId}-count`}>
        {formatCount(count)}
      </span>
    </button>
  );
}
