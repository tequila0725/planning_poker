"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PlayerList } from "./PlayerList";
import { VotingArea } from "./VotingArea";
import { ResultsArea } from "./ResultsArea";
import { UserStoryInput } from "./UserStoryInput";
import { PlanningPokerHeader } from "./PlanningPokerHeader";
import { usePlanningPoker } from "@/hooks/usePlanningPoker";

export function PlanningPoker() {
  const {
    players,
    currentPlayer,
    setCurrentPlayer,
    showResults,
    roundingMethod,
    userStory,
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
  } = usePlanningPoker();

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <PlanningPokerHeader playerCount={players.length} />
        <CardContent>
          <UserStoryInput
            userStory={userStory}
            handleUserStoryUpdate={handleUserStoryUpdate}
          />

          <PlayerList
            players={players}
            currentPlayer={currentPlayer}
            setCurrentPlayer={setCurrentPlayer}
            handleNameUpdate={handleNameUpdate}
            addPlayer={addPlayer}
            removePlayer={removePlayer}
            toggleEditMode={toggleEditMode}
          />

          <VotingArea
            players={players}
            currentPlayer={currentPlayer}
            handleVote={handleVote}
          />

          <ResultsArea
            players={players}
            showResults={showResults}
            roundingMethod={roundingMethod}
            toggleShowResults={toggleShowResults}
            resetVotes={resetVotes}
            handleRoundingMethodChange={handleRoundingMethodChange}
            calculateAverage={calculateAverage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
