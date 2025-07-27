import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Challenge {
  id: number;
  creator: string;
  game: string;
  type: string;
  entryPrices: { price: number; selected: boolean }[];
  challengeId: string;
  createdAt: string;
  icon?: string;
  status?: string;
  opponent?: string | null;
  avatar?: string;
  timePosted?: string;
}

interface ChallengeContextType {
  challenges: Challenge[];
  addChallenge: (challenge: Challenge) => void;
  getUserChallenges: (username: string) => Challenge[];
  joinChallenge: (challengeId: string, username: string) => void;
  getUserJoinedChallenges: (username: string) => Challenge[];
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export const useChallenges = () => {
  const context = useContext(ChallengeContext);
  if (!context) {
    throw new Error('useChallenges must be used within a ChallengeProvider');
  }
  return context;
};

interface ChallengeProviderProps {
  children: ReactNode;
}

export const ChallengeProvider: React.FC<ChallengeProviderProps> = ({ children }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 1,
      creator: "SkillzMaster",
      game: "VALORANT",
      type: "1v1",
      entryPrices: [{ price: 200, selected: false }],
      challengeId: "CH_VL_001",
      createdAt: "2 hours ago",
      icon: "💀",
      status: "pending",
      opponent: null,
      avatar: "/placeholder.svg",
      timePosted: "2 hours ago"
    },
    {
      id: 2,
      creator: "ProGamer99",
      game: "Free Fire",
      type: "4v4",
      entryPrices: [{ price: 100, selected: false }],
      challengeId: "CH_FF_045",
      createdAt: "5 hours ago",
      icon: "🔥",
      status: "pending",
      opponent: null,
      avatar: "/placeholder.svg",
      timePosted: "5 hours ago"
    }
  ]);

  const addChallenge = (challenge: Challenge) => {
    setChallenges(prev => [challenge, ...prev]);
  };

  const getUserChallenges = (username: string) => {
    return challenges.filter(challenge => challenge.creator === username);
  };

  const joinChallenge = (challengeId: string, username: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.challengeId === challengeId 
        ? { ...challenge, opponent: username, status: 'accepted' }
        : challenge
    ));
  };

  const getUserJoinedChallenges = (username: string) => {
    return challenges.filter(challenge => challenge.opponent === username);
  };

  return (
    <ChallengeContext.Provider value={{
      challenges,
      addChallenge,
      getUserChallenges,
      joinChallenge,
      getUserJoinedChallenges
    }}>
      {children}
    </ChallengeContext.Provider>
  );
};