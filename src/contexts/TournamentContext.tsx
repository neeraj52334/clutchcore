import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Tournament {
  id: string;
  tournamentId: string; // Unique searchable ID
  name: string;
  title: string; // Alias for name for backward compatibility
  organizer: string; // Alias for createdBy
  game: string;
  prizePool: number;
  totalSlots: number;
  maxParticipants: number; // Alias for totalSlots
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
  mode: 'solo' | 'duo' | 'squad';
  registeredPlayers?: TournamentPlayer[]; // For solo tournaments
  roomId?: string;
  roomPassword?: string;
  isRoomPublished?: boolean;
  isPasswordProtected?: boolean;
  password?: string;
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
  isRoomPublished?: boolean;
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
  createGroups: (tournamentId: string, numberOfGroups?: number) => void;
  updateMatchResult: (tournamentId: string, matchId: string, results: TeamResult[]) => void;
  addDemoTeams: (tournamentId: string) => void;
  publishTournamentRoom: (tournamentId: string, roomId: string, password: string) => void;
  publishGroupRoom: (tournamentId: string, groupId: string, roomId: string, password: string) => void;
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
      tournamentId: 'TOUR_VL_2024_001',
      name: 'Summer Champions League',
      title: 'Summer Champions League',
      organizer: 'ClutchOwner',
      game: 'VALORANT',
      prizePool: 50000,
      totalSlots: 128,
      maxParticipants: 128,
      teamsPerGroup: 8,
      registrationStart: '2024-01-15T00:00:00Z',
      registrationEnd: '2024-01-25T23:59:59Z',
      entryType: 'paid',
      entryFee: 500,
      status: 'open',
      createdBy: 'ClutchOwner',
      createdAt: '2024-01-10T12:00:00Z',
      registeredTeams: [
        {
          id: 'team1',
          name: 'Fire Legends',
          captain: 'ProGamer1',
          members: [
            { username: 'ProGamer1', inGameName: 'FireLord' },
            { username: 'Player2', inGameName: 'BlazeMaster' },
            { username: 'Player3', inGameName: 'InfernoKing' },
            { username: 'Player4', inGameName: 'FlameStrike' }
          ],
          registeredAt: '2024-01-15T10:00:00Z'
        },
        {
          id: 'team2',
          name: 'Storm Raiders',
          captain: 'StormCaptain',
          members: [
            { username: 'StormCaptain', inGameName: 'ThunderBolt' },
            { username: 'Lightning1', inGameName: 'LightningFast' },
            { username: 'Thunder2', inGameName: 'StormBringer' },
            { username: 'Rain3', inGameName: 'TempestFury' }
          ],
          registeredAt: '2024-01-15T11:00:00Z'
        },
        {
          id: 'team3',
          name: 'Shadow Wolves',
          captain: 'AlphaWolf',
          members: [
            { username: 'AlphaWolf', inGameName: 'ShadowAlpha' },
            { username: 'BetaWolf', inGameName: 'MoonHowl' },
            { username: 'GammaWolf', inGameName: 'NightStalker' },
            { username: 'DeltaWolf', inGameName: 'DarkHunter' }
          ],
          registeredAt: '2024-01-15T12:00:00Z'
        },
        {
          id: 'team4',
          name: 'Ice Breakers',
          captain: 'FrostKing',
          members: [
            { username: 'FrostKing', inGameName: 'IceEmperor' },
            { username: 'IceQueen', inGameName: 'CrystalShield' },
            { username: 'Blizzard', inGameName: 'FrozenStorm' },
            { username: 'Glacier', inGameName: 'IceShard' }
          ],
          registeredAt: '2024-01-15T13:00:00Z'
        },
        {
          id: 'team5',
          name: 'Venom Strikers',
          captain: 'VenomLeader',
          members: [
            { username: 'VenomLeader', inGameName: 'ToxicFang' },
            { username: 'Poison1', inGameName: 'DeadlyStrike' },
            { username: 'Viper2', inGameName: 'VenomBite' },
            { username: 'Cobra3', inGameName: 'LethalDose' }
          ],
          registeredAt: '2024-01-15T14:00:00Z'
        },
        {
          id: 'team6',
          name: 'Golden Eagles',
          captain: 'EagleEye',
          members: [
            { username: 'EagleEye', inGameName: 'GoldenTalon' },
            { username: 'Falcon1', inGameName: 'SkyHunter' },
            { username: 'Hawk2', inGameName: 'WindRider' },
            { username: 'Phoenix3', inGameName: 'FireBird' }
          ],
          registeredAt: '2024-01-15T15:00:00Z'
        },
        {
          id: 'team7',
          name: 'Cyber Ninjas',
          captain: 'NinjaMaster',
          members: [
            { username: 'NinjaMaster', inGameName: 'SilentBlade' },
            { username: 'Samurai1', inGameName: 'SteelEdge' },
            { username: 'Ronin2', inGameName: 'GhostStrike' },
            { username: 'Shinobi3', inGameName: 'ShadowStep' }
          ],
          registeredAt: '2024-01-15T16:00:00Z'
        },
        {
          id: 'team8',
          name: 'Titan Force',
          captain: 'TitanLeader',
          members: [
            { username: 'TitanLeader', inGameName: 'IronGiant' },
            { username: 'Steel1', inGameName: 'MetalCrush' },
            { username: 'Chrome2', inGameName: 'TitanFist' },
            { username: 'Alloy3', inGameName: 'HeavyMetal' }
          ],
          registeredAt: '2024-01-15T17:00:00Z'
        }
      ],
      currentRound: 1,
      totalRounds: 4,
      mode: 'squad',
      registeredPlayers: []
    },
    {
      id: 'T002',
      tournamentId: 'TOUR_FF_2024_002',
      name: 'Free Fire Battle Royale',
      title: 'Free Fire Battle Royale',
      organizer: 'ClutchOwner',
      game: 'Free Fire',
      prizePool: 25000,
      totalSlots: 400,
      maxParticipants: 400,
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

  const createGroups = (tournamentId: string, numberOfGroups?: number) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return;

    const teamsToAssign = tournament.registeredTeams;
    const groupCount = numberOfGroups || Math.max(2, Math.ceil(teamsToAssign.length / tournament.teamsPerGroup));
    const groups: TournamentGroup[] = [];

    // Shuffle teams for random distribution
    const shuffledTeams = [...teamsToAssign].sort(() => Math.random() - 0.5);

    // Create groups with balanced team distribution
    for (let i = 0; i < groupCount; i++) {
      groups.push({
        id: `G${i + 1}`,
        name: `Group ${String.fromCharCode(65 + i)}`, // Group A, B, C, etc.
        teams: [],
        matches: [],
        standings: []
      });
    }

    // Distribute teams evenly across groups
    shuffledTeams.forEach((team, index) => {
      const groupIndex = index % groupCount;
      groups[groupIndex].teams.push(team);
      groups[groupIndex].standings.push({
        teamId: team.id,
        teamName: team.name,
        points: 0,
        matches: 0,
        position: groups[groupIndex].teams.length
      });
    });

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

  const publishTournamentRoom = (tournamentId: string, roomId: string, password: string) => {
    updateTournament(tournamentId, { 
      roomId, 
      roomPassword: password, 
      isRoomPublished: true 
    });
  };

  const publishGroupRoom = (tournamentId: string, groupId: string, roomId: string, password: string) => {
    setTournaments(prev => prev.map(tournament => {
      if (tournament.id !== tournamentId) return tournament;

      const updatedGroups = tournament.groups?.map(group => 
        group.id === groupId 
          ? { ...group, roomId, password, isRoomPublished: true }
          : group
      );

      return { ...tournament, groups: updatedGroups };
    }));
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
      addDemoTeams,
      publishTournamentRoom,
      publishGroupRoom
    }}>
      {children}
    </TournamentContext.Provider>
  );
};