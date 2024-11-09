import { CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface PlanningPokerHeaderProps {
  playerCount: number;
}

export function PlanningPokerHeader({ playerCount }: PlanningPokerHeaderProps) {
  return (
    <CardHeader>
      <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <span>プランニングポーカー</span>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <span>{playerCount} プレイヤー</span>
        </div>
      </CardTitle>
    </CardHeader>
  );
}
