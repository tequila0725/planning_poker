import type { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";

interface Player {
  id: number;
  name: string;
  vote: number | string | null;
  revealed: boolean;
  isEditing: boolean;
}

interface GameState {
  players: Player[];
  userStory: string;
  showResults: boolean;
  roundingMethod: string;
}

// リクエストボディの型を定義
interface PusherRequest extends NextApiRequest {
  body: {
    event: string;
    gameState: GameState;
  };
}

const pusher = new Pusher({
  appId: "1890667",
  key: "cc8d1e25a78ef38162ae",
  secret: "50514b804e0e2d05383a",
  cluster: "ap3",
  useTLS: true,
});

export default async function handler(
  req: PusherRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { event, gameState } = req.body;
    await pusher.trigger("planning-poker-channel", event, { gameState });
    res.status(200).json({ message: "イベントがトリガーされました" });
  } catch (error) {
    console.error("Pusher error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
