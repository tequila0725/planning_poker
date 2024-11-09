import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Calculator } from "lucide-react";
import { ROUNDING_METHODS } from "@/constants/planning-poker";
import { Player, RoundingMethodType } from "@/types/planning-poker";

interface ResultsAreaProps {
  players: Player[];
  showResults: boolean;
  roundingMethod: string;
  toggleShowResults: () => Promise<void>;
  resetVotes: () => Promise<void>;
  handleRoundingMethodChange: (newMethod: RoundingMethodType) => Promise<void>;
  calculateAverage: () => number;
}

export function ResultsArea({
  players,
  showResults,
  roundingMethod,
  toggleShowResults,
  resetVotes,
  handleRoundingMethodChange,
  calculateAverage,
}: ResultsAreaProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h3 className="text-lg font-semibold">投票結果</h3>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
          <Button
            variant="outline"
            onClick={toggleShowResults}
            className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto"
          >
            {showResults ? (
              <EyeOff className="w-4 h-4 mr-2" />
            ) : (
              <Eye className="w-4 h-4 mr-2" />
            )}
            {showResults ? "投票結果を非表示" : "投票結果を表示"}
          </Button>
          <Button
            variant="outline"
            onClick={resetVotes}
            className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto"
          >
            投票結果をリセット
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {players.map((player) => (
          <Card key={player.id}>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">{player.name}</span>
                <div className="w-12 h-12 flex items-center justify-center border rounded">
                  {showResults ? player.vote ?? "?" : player.vote ? "✓" : "-"}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showResults && (
        <>
          <div className="flex items-center gap-2 justify-end">
            <span className="text-sm text-gray-500">四捨五入方式:</span>
            <Select
              value={roundingMethod}
              onValueChange={handleRoundingMethodChange}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ROUNDING_METHODS).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              <p className="text-lg font-semibold">
                平均値: {calculateAverage()}
                <span className="text-sm font-normal ml-2 text-gray-500">
                  ({ROUNDING_METHODS[roundingMethod as RoundingMethodType].name}
                  )
                </span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
