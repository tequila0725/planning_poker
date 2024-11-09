// 型定義
export interface Player {
  id: number;
  name: string;
  vote: number | string | null;
  revealed: boolean;
  isEditing: boolean;
}

export interface RoundingMethod {
  name: string;
  function: (num: number) => number;
}

// RoundingMethodsの型を修正
export type RoundingMethodType =
  | "standard"
  | "bankers"
  | "roundUp"
  | "roundDown"
  | "ceil"
  | "floor";

export type RoundingMethods = {
  [key in RoundingMethodType]: RoundingMethod;
};

export interface GameState {
  players: Player[];
  userStory: string;
  showResults: boolean;
  roundingMethod: RoundingMethodType;
}
