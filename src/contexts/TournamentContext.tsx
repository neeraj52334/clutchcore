import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Tournament {
  id: string;
  name: string;
  game: string;
  prizePool: number;
  totalSlots: number;
  teamsPerGroup: number;
  registrationStart: string;
  registrationEnd: string;
  entryType: 'free' | 'paid';
  entryFee?: number;
  status: 'open' | 'live' | 'completed';
  createdBy: string;
  createdAt: string;
  registeredTeams: TournamentTeam[];
  groups?: TournamentGroup[];
  currentRound: number;
  totalRounds: number;
  mode: 'solo' | 'squad';
  registeredPlayers?: TournamentPlayer[]; // For solo tournaments
}

export interface TournamentPlayer {
  id: string;
  username: string;
  inGameName: string;
  registeredAt: string;
}

export interface TournamentTeam {
  id: string;
  name: string;
  captain: string;
  members: TournamentTeamMember[];
  groupId?: string;
  registeredAt: string;
  teamId?: string; // Reference to actual team if squad tournament
}

export interface TournamentTeamMember {
  username: string;
  inGameName: string;
}

export interface TournamentGroup {
  id: string;
  name: string;
  teams: TournamentTeam[];
  matches: TournamentMatch[];
  standings: TeamStanding[];
  roomId?: string;
  password?: string;
}

export interface TournamentMatch {
  id: string;
  groupId: string;
  round: number;
  teams: string[];
  results?: TeamResult[];
  status: 'pending' | 'ongoing' | 'completed';
  scheduledAt?: string;
}

export interface TeamResult {
  teamId: string;
  position: number;
  points: number;
}

export interface TeamStanding {
  teamId: string;
  teamName: string;
  points: number;
  matches: number;
  position: number;
}

interface TournamentContextType {
  tournaments: Tournament[];
  addTournament: (tournament: Tournament) => void;
  updateTournament: (id: string, updates: Partial<Tournament>) => void;
  registerTeam: (tournamentId: string, team: TournamentTeam) => void;
  registerPlayer: (tournamentId: string, player: TournamentPlayer) => void;
  getActiveTournaments: () => Tournament[];
  getUserTournaments: (username: string) => Tournament[];
  createGroups: (tournamentId: string) => void;
  updateMatchResult: (tournamentId: string, matchId: string, results: TeamResult[]) => void;
  addDemoTeams: (tournamentId: string) => void;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const useTournaments = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournaments must be used within a TournamentProvider');
  }
  return context;
};

interface TournamentProviderProps {
  children: ReactNode;
}

export const TournamentProvider: React.FC<TournamentProviderProps> = ({ children }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([
    {
      id: 'T001',
      name: 'Summer Champions League',
      game: 'VALORANT',
      prizePool: 50000,
      totalSlots: 128,
      teamsPerGroup: 8,
      registrationStart: '2024-01-15T00:00:00Z',
      registrationEnd: '2024-01-25T23:59:59Z',
      entryType: 'paid',
      entryFee: 500,
      status: 'open',
      createdBy: 'ClutchOwner',
      createdAt: '2024-01-10T12:00:00Z',
      registeredTeams: [],
      currentRound: 1,
      totalRounds: 4,
      mode: 'squad',
      registeredPlayers: []
    },
    {
      id: 'T002',
      name: 'Free Fire Battle Royale',
      game: 'Free Fire',
      prizePool: 25000,
      totalSlots: 400,
      teamsPerGroup: 12,
      registrationStart: '2024-01-20T00:00:00Z',
      registrationEnd: '2024-02-01T23:59:59Z',
      entryType: 'free',
      status: 'open',
      createdBy: 'ClutchOwner',
      createdAt: '2024-01-18T15:30:00Z',
      registeredTeams: [],
      currentRound: 1,
      totalRounds: 5,
      mode: 'solo',
      registeredPlayers: []
    }
  ]);

  const addTournament = (tournament: Tournament) => {
    setTournaments(prev => [tournament, ...prev]);
  };

  const updateTournament = (id: string, updates: Partial<Tournament>) => {
    setTournaments(prev => prev.map(tournament => 
      tournament.id === id ? { ...tournament, ...updates } : tournament
    ));
  };

  const registerTeam = (tournamentId: string, team: TournamentTeam) => {
    setTournaments(prev => prev.map(tournament => 
      tournament.id === tournamentId 
        ? { ...tournament, registeredTeams: [...tournament.registeredTeams, team] }
        : tournament
    ));
  };

  const getActiveTournaments = () => {
    return tournaments.filter(tournament => tournament.status === 'open');
  };

  const registerPlayer = (tournamentId: string, player: TournamentPlayer) => {
    setTournaments(prev => prev.map(tournament => 
      tournament.id === tournamentId 
        ? { 
            ...tournament, 
            registeredPlayers: [...(tournament.registeredPlayers || []), player] 
          }
        : tournament
    ));
  };

  const getUserTournaments = (username: string) => {
    return tournaments.filter(tournament => {
      // Check squad tournaments
      const isInSquadTournament = tournament.mode === 'squad' && 
        tournament.registeredTeams.some(team => 
          team.captain === username || team.members.some(member => member.username === username)
        );
      
      // Check solo tournaments
      const isInSoloTournament = tournament.mode === 'solo' && 
        tournament.registeredPlayers?.some(player => player.username === username);
      
      return isInSquadTournament || isInSoloTournament;
    });
  };

  const createGroups = (tournamentId: string) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return;

    const totalGroups = Math.floor(tournament.registeredTeams.length / tournament.teamsPerGroup);
    const groups: TournamentGroup[] = [];

    for (let i = 0; i < totalGroups; i++) {
      const startIndex = i * tournament.teamsPerGroup;
      const groupTeams = tournament.registeredTeams.slice(startIndex, startIndex + tournament.teamsPerGroup);
      
      groups.push({
        id: `G${i + 1}`,
        name: `Group ${i + 1}`,
        teams: groupTeams,
        matches: [],
        standings: groupTeams.map((team, index) => ({
          teamId: team.id,
          teamName: team.name,
          points: 0,
          matches: 0,
          position: index + 1
        }))
      });
    }

    // Handle remaining teams
    const remainingTeams = tournament.registeredTeams.slice(totalGroups * tournament.teamsPerGroup);
    if (remainingTeams.length > 0) {
      groups.push({
        id: `G${totalGroups + 1}`,
        name: `Group ${totalGroups + 1}`,
        teams: remainingTeams,
        matches: [],
        standings: remainingTeams.map((team, index) => ({
          teamId: team.id,
          teamName: team.name,
          points: 0,
          matches: 0,
          position: index + 1
        }))
      });
    }

    updateTournament(tournamentId, { 
      groups, 
      status: 'live' 
    });
  };

  const updateMatchResult = (tournamentId: string, matchId: string, results: TeamResult[]) => {
    setTournaments(prev => prev.map(tournament => {
      if (tournament.id !== tournamentId) return tournament;

      const updatedGroups = tournament.groups?.map(group => {
        const updatedMatches = group.matches.map(match => 
          match.id === matchId 
            ? { ...match, results, status: 'completed' as const }
            : match
        );

        // Recalculate standings
        const updatedStandings = group.standings.map(standing => {
          const teamResults = updatedMatches
            .filter(match => match.results && match.teams.includes(standing.teamId))
            .flatMap(match => match.results!.filter(result => result.teamId === standing.teamId));

          const totalPoints = teamResults.reduce((sum, result) => sum + result.points, 0);
          const matchCount = teamResults.length;

          return {
            ...standing,
            points: totalPoints,
            matches: matchCount
          };
        }).sort((a, b) => b.points - a.points);

        // Update positions
        updatedStandings.forEach((standing, index) => {
          standing.position = index + 1;
        });

        return {
          ...group,
          matches: updatedMatches,
          standings: updatedStandings
        };
      });

      return { ...tournament, groups: updatedGroups };
    }));
  };

  const addDemoTeams = (tournamentId: string) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return;

    const slotsToFill = tournament.totalSlots - tournament.registeredTeams.length;
    const demoTeams: TournamentTeam[] = [];

    for (let i = 0; i < slotsToFill; i++) {
      demoTeams.push({
        id: `demo_team_${i + 1}`,
        name: `Demo Team ${i + 1}`,
        captain: `Captain${i + 1}`,
        members: [
          { username: `Captain${i + 1}`, inGameName: `Cap${i + 1}` },
          { username: `Player${i + 1}A`, inGameName: `P${i + 1}A` },
          { username: `Player${i + 1}B`, inGameName: `P${i + 1}B` },
          { username: `Player${i + 1}C`, inGameName: `P${i + 1}C` }
        ],
        registeredAt: new Date().toISOString()
      });
    }

    setTournaments(prev => prev.map(tournament => 
      tournament.id === tournamentId 
        ? { ...tournament, registeredTeams: [...tournament.registeredTeams, ...demoTeams] }
        : tournament
    ));
  };

  return (
    <TournamentContext.Provider value={{
      tournaments,
      addTournament,
      updateTournament,
      registerTeam,
      registerPlayer,
      getActiveTournaments,
      getUserTournaments,
      createGroups,
      updateMatchResult,
      addDemoTeams
    }}>
      {children}
    </TournamentContext.Provider>
  );
};