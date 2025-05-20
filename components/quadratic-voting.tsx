"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QuadraticVotingProps {
  eventId: string;
  initialVotes: number;
}

export function QuadraticVoting({
  eventId,
  initialVotes,
}: QuadraticVotingProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [userVotes, setUserVotes] = useState(0);

  // Calculate the cost of the next vote using quadratic formula
  const nextVoteCost = Math.pow(userVotes + 1, 2) - Math.pow(userVotes, 2);

  const handleVote = () => {
    setVotes(votes + 1);
    setUserVotes(userVotes + 1);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 text-stone-500 hover:text-stone-800"
            onClick={handleVote}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{votes}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">
            Quadratic voting: Next vote costs {nextVoteCost} credits
            <br />
            You've used {userVotes} votes on this event
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
