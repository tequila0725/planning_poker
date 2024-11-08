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
import Pusher from "pusher-js";
import axios from "axios";

// インターフェースの定義
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

// GameStateインターフェースを追加
interface GameState {
  players: Player[];
  userStory: string;
  showResults: boolean;
  roundingMethod: string;
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

  // roundingMethodsの定義
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

  // axios.post呼び出しを修正
  const handleServerUpdate = async (event: string, gameState: GameState) => {
    try {
      await axios.post("/api/pusher", {
        event,
        gameState,
      });
    } catch (error) {
      console.error("Server update error:", error);
    }
  };

  // プレイヤーの追加
  const addPlayer = async () => {
    const newId = Math.max(...players.map((p) => p.id)) + 1;
    const newPlayer: Player = {
      id: newId,
      name: `プレイヤー ${newId}`,
      vote: null,
      revealed: false,
      isEditing: false,
    };
    const updatedPlayers = [...players, newPlayer];
    setPlayers(updatedPlayers);

    const gameState: GameState = {
      players: updatedPlayers,
      userStory,
      showResults,
      roundingMethod,
    };
    await handleServerUpdate("game-state-updated", gameState);
  };

  // プレイヤーの削除
  const removePlayer = async (playerId: number) => {
    if (players.length > 1) {
      const updatedPlayers = players.filter((p) => p.id !== playerId);
      setPlayers(updatedPlayers);
      if (currentPlayer === playerId) {
        setCurrentPlayer(updatedPlayers[0].id);
      }

      const gameState: GameState = {
        players: updatedPlayers,
        userStory,
        showResults,
        roundingMethod,
      };
      await handleServerUpdate("game-state-updated", gameState);
    }
  };

  // 編集モードの切替
  const toggleEditMode = (playerId: number) => {
    setPlayers(
      players.map((player) =>
        player.id === playerId
          ? { ...player, isEditing: !player.isEditing }
          : player
      )
    );
  };

  // プレイヤー名の更新
  const handleNameUpdate = async (playerId: number, newName: string) => {
    const trimmedName = newName.trim();
    if (trimmedName) {
      const updatedPlayers = players.map((player) =>
        player.id === playerId
          ? { ...player, name: trimmedName, isEditing: false }
          : player
      );
      setPlayers(updatedPlayers);

      const gameState: GameState = {
        players: updatedPlayers,
        userStory,
        showResults,
        roundingMethod,
      };
      await handleServerUpdate("game-state-updated", gameState);
    } else {
      setPlayers(
        players.map((player) =>
          player.id === playerId ? { ...player, isEditing: false } : player
        )
      );
    }
  };

  // 投票の処理
  const handleVote = async (value: number | string) => {
    const updatedPlayers = players.map((player) =>
      player.id === currentPlayer ? { ...player, vote: value } : player
    );
    setPlayers(updatedPlayers);

    const gameState: GameState = {
      players: updatedPlayers,
      userStory,
      showResults,
      roundingMethod,
    };
    await handleServerUpdate("game-state-updated", gameState);
  };

  // 平均値の計算
  const calculateAverage = () => {
    const numericVotes = players
      .map((p) => p.vote)
      .filter((v) => typeof v === "number");

    if (numericVotes.length === 0) return 0;

    const average =
      numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length;
    return roundingMethods[roundingMethod].function(average);
  };

  // 投票結果の表示/非表示を切り替える関数を修正
  const toggleShowResults = async () => {
    const newShowResults = !showResults;
    setShowResults(newShowResults);

    const gameState: GameState = {
      players,
      userStory,
      showResults: newShowResults,
      roundingMethod,
    };
    await handleServerUpdate("game-state-updated", gameState);
  };

  // resetVotes関数も修正
  const resetVotes = async () => {
    const updatedPlayers = players.map((player) => ({ ...player, vote: null }));
    setPlayers(updatedPlayers);
    setShowResults(false);
    setUserStory("");

    const gameState: GameState = {
      players: updatedPlayers,
      userStory: "",
      showResults: false,
      roundingMethod,
    };
    await handleServerUpdate("game-state-updated", gameState);
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

  // Pusherの初期化
  useEffect(() => {
    const pusher = new Pusher("cc8d1e25a78ef38162ae", {
      cluster: "ap3",
    });

    // チャンネルに購読
    const channel = pusher.subscribe("planning-poker-channel");

    // イベントのリスニング
    channel.bind("player-updated", (data: { players: Player[] }) => {
      setPlayers(data.players);
    });

    channel.bind("vote-updated", (data: { players: Player[] }) => {
      setPlayers(data.players);
    });

    // クリーンアップ
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  // ユーザーストーリー更新のハンドラーを修正
  const handleUserStoryUpdate = async (newStory: string) => {
    setUserStory(newStory);
    const gameState: GameState = {
      players,
      userStory: newStory,
      showResults,
      roundingMethod,
    };
    await handleServerUpdate("game-state-updated", gameState);
  };

  // Pusherのイベントリスナーを修正
  useEffect(() => {
    const pusher = new Pusher("cc8d1e25a78ef38162ae", {
      cluster: "ap3",
    });

    const channel = pusher.subscribe("planning-poker-channel");

    channel.bind("game-state-updated", (data: { gameState: GameState }) => {
      if (data.gameState) {
        setPlayers(data.gameState.players);
        setUserStory(data.gameState.userStory);
        setShowResults(data.gameState.showResults);
        setRoundingMethod(data.gameState.roundingMethod);
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  // 四捨五入方式の変更ハンドラーを追加
  const handleRoundingMethodChange = async (newMethod: string) => {
    setRoundingMethod(newMethod);

    const gameState: GameState = {
      players,
      userStory,
      showResults,
      roundingMethod: newMethod,
    };
    await handleServerUpdate("game-state-updated", gameState);
  };

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
              onChange={(e) => handleUserStoryUpdate(e.target.value)}
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
                      variant={
                        currentPlayer === player.id ? "default" : "outline"
                      }
                      className="flex-1 justify-between"
                      onClick={() => setCurrentPlayer(player.id)}
                    >
                      {player.name}
                      <div className="flex items-center gap-2">
                        <div
                          onClick={async (e) => {
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
                  onClick={toggleShowResults}
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
                    onValueChange={handleRoundingMethodChange}
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
