# プランニングポーカー

このプロジェクトは [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) を使用してブートストラップされた [Next.js](https://nextjs.org) プロジェクトです。

## はじめに

### 必要条件

- Node.js v14 以上
- npm、yarn、pnpm、または bun

### インストール

1. **リポジトリをクローンする:**

   ```bash
   git clone https://github.com/your-username/planning_poker.git
   cd planning_poker
   ```

2. **依存関係をインストールする:**

   ```bash
   npm install
   # または
   yarn install
   # または
   pnpm install
   # または
   bun install
   ```

3. **環境変数を設定する:**

   - **ローカル開発環境:**

     `.env.sample` ファイルを `.env` にコピーします:

     ```bash
     cp .env.sample .env
     ```

     その後、`.env` を開いて Pusher チャンネルの認証情報を設定します:

     ```
     PUSHER_APP_ID=your_pusher_app_id
     PUSHER_KEY=your_pusher_key
     PUSHER_SECRET=your_pusher_secret
     PUSHER_CLUSTER=your_pusher_cluster
     PORT=3001
     ```

   - **デプロイメント (例: Vercel):**

     Vercel などのプラットフォームにデプロイする場合、プロジェクト設定で以下の環境変数を設定します:

     - `PUSHER_APP_ID`
     - `PUSHER_KEY`
     - `PUSHER_SECRET`
     - `PUSHER_CLUSTER`
     - `PORT` （オプション）

## アプリケーションの実行

### 開発

1. **フロントエンドサーバーを起動します:**

   ```bash
   npm run dev
   # または
   yarn dev
   # または
   pnpm dev
   # または
   bun dev
   ```

2. **バックエンドサーバーを起動します:**

   別のターミナルウィンドウを開き、以下のコマンドを実行して Pusher によるリアルタイム通信を処理するバックエンドサーバーを起動します:

   ```bash
   node server.mjs
   ```

   これにより、バックエンドサーバーがポート `3001` で起動します。`server.mjs` は Pusher を使用してリアルタイムイベントを管理します。

3. **ブラウザでアプリケーションを確認します:**

   ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認します。

### 本番

アプリケーションをビルドします:

```bash
npm run build
# または
yarn build
# または
pnpm build
# または
bun build
```

本番サーバーを起動します:

```bash
npm start
# または
yarn start
# または
pnpm start
# または
bun start
```

## Pusher を使用したリアルタイム通信

このプロジェクトでは、バックエンドで WebSocket によるリアルタイム通信を実現するために [Pusher](https://pusher.com/) を使用しています。

### 設定方法

上記の環境変数の設定を、ローカル開発環境およびデプロイメント環境の両方で行ってください。

### バックエンド設定

バックエンドは `server.mjs` および `pages/api/pusher.ts` に設定されており、Pusher を初期化し、リアルタイムイベントを処理するように構成されています。ローカルでリアルタイム通信を確認するためには、上記の手順に従ってバックエンドサーバーを起動する必要があります。

## Vercel へのデプロイ

Next.js アプリケーションをデプロイする最も簡単な方法は、[Vercel プラットフォーム](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) を使用することです。Next.js の開発者が提供しています。

詳細については、[Next.js のデプロイメントドキュメント](https://nextjs.org/docs/app/building-your-application/deploying) を参照してください。
