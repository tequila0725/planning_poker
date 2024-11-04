"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Eye,
  EyeOff,
  Users,
  UserPlus,
  UserMinus,
  Edit2,
  Calculator,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 最初にインターフェースを追加
interface Player {
  id: number;
  name: string;
  vote: number | string | null;
  revealed: boolean;
  isEditing: boolean;
}

interface RoundingMethod {
  name: string;
  function: (num: number) => number;
}

interface RoundingMethods {
  [key: string]: RoundingMethod;
}

export function PlanningPoker() {
  // プレイヤーの初期状態
  const defaultPlayers = [
    {
      id: 1,
      name: "プレイヤー1",
      vote: null,
      revealed: false,
      isEditing: false,
    },
  ];

  // useEffectでlocalStorageの処理を行う
  const [players, setPlayers] = useState<Player[]>(defaultPlayers);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedPlayers = localStorage.getItem("planningPokerPlayers");
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("planningPokerPlayers", JSON.stringify(players));
    }
  }, [players, isClient]);

  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [roundingMethod, setRoundingMethod] = useState("standard");

  const cardValues = [1, 2, 3, 5, 8, 13, 21, "?"];

  // roundingMethodsの型を修正
  const roundingMethods: RoundingMethods = {
    standard: {
      name: "一般的な四捨五入",
      function: (num: number) => Math.round(num),
    },
    bankers: {
      name: "銀行型四捨五入",
      function: (num: number) => {
        const decimal = num - Math.floor(num);
        if (decimal === 0.5) {
          return Math.floor(num) % 2 === 0 ? Math.floor(num) : Math.ceil(num);
        }
        return Math.round(num);
      },
    },
    roundUp: {
      name: "切り上げ型四捨五入",
      function: (num: number) => Math.ceil(num * 2) / 2,
    },
    roundDown: {
      name: "切り捨て型四捨五入",
      function: (num: number) => Math.floor(num * 2) / 2,
    },
    ceil: {
      name: "天井関数",
      function: (num: number) => Math.ceil(num),
    },
    floor: {
      name: "床関数",
      function: (num: number) => Math.floor(num),
    },
  };

  const addPlayer = () => {
    const newId = Math.max(...players.map((p) => p.id)) + 1;
    setPlayers([
      ...players,
      {
        id: newId,
        name: `プレイヤー ${newId}`,
        vote: null,
        revealed: false,
        isEditing: false,
      },
    ]);
  };

  const removePlayer = (playerId: number) => {
    if (players.length > 1) {
      setPlayers(players.filter((p) => p.id !== playerId));
      if (currentPlayer === playerId) {
        setCurrentPlayer(players[0].id);
      }
    }
  };

  // プレイヤー関連の関数を修正
  const toggleEditMode = (playerId: number) => {
    setPlayers(
      players.map((player) =>
        player.id === playerId
          ? { ...player, isEditing: !player.isEditing }
          : player
      )
    );
  };

  const handleNameUpdate = (playerId: number, newName: string) => {
    const trimmedName = newName.trim();
    if (trimmedName) {
      setPlayers(
        players.map((player) =>
          player.id === playerId
            ? { ...player, name: trimmedName, isEditing: false }
            : player
        )
      );
    } else {
      // 名前が空の場合は編集モードを解除するだけ
      setPlayers(
        players.map((player) =>
          player.id === playerId ? { ...player, isEditing: false } : player
        )
      );
    }
  };

  const handleVote = (value: number | string) => {
    setPlayers(
      players.map((player) =>
        player.id === currentPlayer ? { ...player, vote: value } : player
      )
    );
  };

  const calculateAverage = () => {
    const numericVotes = players
      .map((p) => p.vote)
      .filter((v) => typeof v === "number");

    if (numericVotes.length === 0) return 0;

    const average =
      numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length;
    return roundingMethods[roundingMethod].function(average);
  };

  const resetVotes = () => {
    setPlayers(players.map((player) => ({ ...player, vote: null })));
    setShowResults(false);
    setUserStory("");
  };

  const [userStory, setUserStory] = useState("");

  useEffect(() => {
    if (isClient) {
      const savedUserStory = localStorage.getItem("planningPokerUserStory");
      if (savedUserStory) {
        setUserStory(savedUserStory);
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("planningPokerUserStory", userStory);
    }
  }, [userStory, isClient]);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>プランニングポーカー</span>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6" />
              <span>{players.length} プレイヤー</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">ユーザーストーリー</h3>
            <Input
              placeholder="ユーザーストーリーを入力してください"
              value={userStory}
              onChange={(e) => setUserStory(e.target.value)}
              className="w-full"
            />
          </div>

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
                      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const input = form.elements.namedItem(
                          "playerName"
                        ) as HTMLInputElement;
                        handleNameUpdate(player.id, input.value);
                      }}
                    >
                      <Input
                        name="playerName"
                        defaultValue={player.name}
                        autoFocus
                        className="flex-1"
                        onBlur={(e) =>
                          handleNameUpdate(player.id, e.target.value)
                        }
                      />
                      <Button type="submit" size="sm">
                        保存
                      </Button>
                    </form>
                  ) : (
                    <Button
                      variant={
                        currentPlayer === player.id ? "default" : "outline"
                      }
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
                            onClick={(e) => {
                              e.stopPropagation();
                              removePlayer(player.id);
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

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              カードを選択してください (
              {players.find((p) => p.id === currentPlayer)?.name})
            </h3>
            <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
              {cardValues.map((value) => (
                <Button
                  key={value}
                  variant="outline"
                  className={`h-16 ${
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

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">投票結果</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowResults(!showResults)}
                  className="bg-green-500 hover:bg-green-600 text-white"
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
                  className="bg-red-500 hover:bg-red-600 text-white"
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
                        {showResults
                          ? player.vote ?? "?"
                          : player.vote
                          ? "✓"
                          : "-"}
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
                    onValueChange={setRoundingMethod}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roundingMethods).map(([key, value]) => (
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
                        ({roundingMethods[roundingMethod].name})
                      </span>
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
