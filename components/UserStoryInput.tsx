import { Input } from "@/components/ui/input";

interface UserStoryInputProps {
  userStory: string;
  handleUserStoryUpdate: (newStory: string) => Promise<void>;
}

export function UserStoryInput({
  userStory,
  handleUserStoryUpdate,
}: UserStoryInputProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">ユーザーストーリー</h3>
      <Input
        placeholder="ユーザーストーリーを入力してください"
        value={userStory}
        onChange={(e) => handleUserStoryUpdate(e.target.value)}
        className="w-full"
      />
    </div>
  );
}
