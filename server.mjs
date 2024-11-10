import express from "express";
import Pusher from "pusher";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Pusherの初期化
const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.NEXT_PUBLIC_PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

// Pusherイベントをトリガーするエンドポイント
app.post("/api/pusher", (req, res) => {
  const { event, players } = req.body;

  pusher.trigger("planning-poker-channel", event, { players });

  res.status(200).send("イベントがトリガーされました");
});

// ポートを5000から3001に変更
const PORT = process.env.PORT || 3001;
app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(
        `Port ${PORT} is already in use. Please try a different port.`
      );
    } else {
      console.error("Server error:", err);
    }
  });
