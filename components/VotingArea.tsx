import { Button } from "@/components/ui/button";
import { CARD_VALUES } from "@/constants/planning-poker";
import { Player } from "@/types/planning-poker";

interface VotingAreaProps {
  players: Player[];
  currentPlayer: number;
  handleVote: (value: number | string) => Promise<void>;
}

export function VotingArea({
  players,
  currentPlayer,
  handleVote,
}: VotingAreaProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">
        カードを選択してください ({players.find((p) => p.id === currentPlayer)?.name})
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
        {CARD_VALUES.map((value) => (
          <Button
            key={value}
            variant="outline"
            className={`h-16 text-lg ${
              players.find((p) => p.id === currentPlayer)?.vote === value
                ? "ring-2 ring-blue-500"
                : ""
            }`}
            onClick={() => handleVote(value)}
          >
            {value}
          </Button>
        ))}
      </div>
    </div>
  );
}
