import { cn } from "@/lib/utils";

interface AvatarSimpleProps {
  name: string;
  className?: string;
}

export function AvatarSimple({ name, className }: AvatarSimpleProps) {
  // Generate initials from name
  const initials = name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Generate a consistent background color based on the name
  const getBackgroundColor = (str: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-orange-500",
      "bg-teal-500",
      "bg-cyan-500",
    ];

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full text-white font-medium",
        getBackgroundColor(name),
        className
      )}
    >
      {initials}
    </div>
  );
}
