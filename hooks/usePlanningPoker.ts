import { useState, useEffect } from "react";
import axios from "axios";
import Pusher from "pusher-js";
import { Player, GameState, RoundingMethodType } from "@/types/planning-poker";
import { ROUNDING_METHODS } from "@/constants/planning-poker";

export const usePlanningPoker = () => {
  const defaultPlayers = [
    {
      id: 1,
      name: "プレイヤー1",
      vote: null,
      revealed: false,
      isEditing: false,
    },
  ];

  const [players, setPlayers] = useState<Player[]>(defaultPlayers);
  const [isClient, setIsClient] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [roundingMethod, setRoundingMethod] =
    useState<RoundingMethodType>("standard");
  const [userStory, setUserStory] = useState("");

  // LocalStorage関連の処理
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

  // Pusher関連の処理
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

  // プレイヤー関連の処理
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

  const toggleEditMode = (playerId: number) => {
    setPlayers(
      players.map((player) =>
        player.id === playerId
          ? { ...player, isEditing: !player.isEditing }
          : player
      )
    );
  };

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
    }
  };

  // 投票関連の処理
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

  // ユーザーストーリー関連の処理
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

  // 結果表示関連の処理
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

  const handleRoundingMethodChange = async (newMethod: RoundingMethodType) => {
    setRoundingMethod(newMethod);

    const gameState: GameState = {
      players,
      userStory,
      showResults,
      roundingMethod: newMethod,
    };
    await handleServerUpdate("game-state-updated", gameState);
  };

  const calculateAverage = () => {
    const numericVotes = players
      .map((p) => p.vote)
      .filter((v): v is number => typeof v === "number");

    if (numericVotes.length === 0) return 0;

    const average =
      numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length;
    return ROUNDING_METHODS[roundingMethod].function(average);
  };

  return {
    players,
    setPlayers,
    currentPlayer,
    setCurrentPlayer,
    showResults,
    setShowResults,
    roundingMethod,
    setRoundingMethod,
    userStory,
    setUserStory,
    handleServerUpdate,
    addPlayer,
    removePlayer,
    toggleEditMode,
    handleNameUpdate,
    handleVote,
    handleUserStoryUpdate,
    toggleShowResults,
    resetVotes,
    handleRoundingMethodChange,
    calculateAverage,
  };
};
