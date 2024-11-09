import { CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface PlanningPokerHeaderProps {
  playerCount: number;
}

export function PlanningPokerHeader({ playerCount }: PlanningPokerHeaderProps) {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>プランニングポーカー</span>
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span>{playerCount} プレイヤー</span>
        </div>
      </CardTitle>
    </CardHeader>
  );
}
