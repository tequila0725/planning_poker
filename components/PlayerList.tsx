import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, UserMinus, Edit2 } from "lucide-react";
import { Player } from "@/types/planning-poker";

interface PlayerListProps {
  players: Player[];
  currentPlayer: number;
  setCurrentPlayer: (id: number) => void;
  handleNameUpdate: (playerId: number, newName: string) => Promise<void>;
  addPlayer: () => Promise<void>;
  removePlayer: (playerId: number) => Promise<void>;
  toggleEditMode: (playerId: number) => void;
}

export function PlayerList({
  players,
  currentPlayer,
  setCurrentPlayer,
  handleNameUpdate,
  addPlayer,
  removePlayer,
  toggleEditMode,
}: PlayerListProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">プレイヤー</h3>
        <Button
          variant="outline"
          onClick={addPlayer}
          className="flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          プレイヤーを追加
        </Button>
      </div>
      <div className="space-y-2">
        {players.map((player) => (
          <div key={player.id} className="flex items-center gap-2">
            {player.isEditing ? (
              <form
                className="flex-1 flex gap-2"
                onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const input = form.elements.namedItem(
                    "playerName"
                  ) as HTMLInputElement;
                  await handleNameUpdate(player.id, input.value);
                }}
              >
                <Input
                  name="playerName"
                  defaultValue={player.name}
                  autoFocus
                  className="flex-1"
                  onBlur={async (e) =>
                    await handleNameUpdate(player.id, e.target.value)
                  }
                />
                <Button type="submit" size="sm">
                  保存
                </Button>
              </form>
            ) : (
              <Button
                variant={currentPlayer === player.id ? "default" : "outline"}
                className="flex-1 justify-between"
                onClick={() => setCurrentPlayer(player.id)}
              >
                {player.name}
                <div className="flex items-center gap-2">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleEditMode(player.id);
                    }}
                  >
                    <Edit2 className="w-4 h-4 cursor-pointer hover:text-blue-500" />
                  </div>
                  {players.length > 1 && (
                    <div
                      onClick={async (e) => {
                        e.stopPropagation();
                        await removePlayer(player.id);
                      }}
                    >
                      <UserMinus className="w-4 h-4 cursor-pointer hover:text-red-500" />
                    </div>
                  )}
                </div>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
