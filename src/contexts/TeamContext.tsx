import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TeamMember {
  id: string;
  username: string;
  avatar: string;
  role: 'leader' | 'member';
  joinedAt: string;
}

interface Team {
  id: string;
  name: string;
  leader: string;
  members: TeamMember[];
  game: string;
  maxMembers: number;
  description?: string;
  createdAt: string;
  isRecruiting: boolean;
}

interface TeamInvitation {
  id: string;
  teamId: string;
  teamName: string;
  teamLeader: string;
  invitedUser: string;
  status: 'pending' | 'accepted' | 'declined';
  sentAt: string;
}

interface TeamContextType {
  teams: Team[];
  invitations: TeamInvitation[];
  createTeam: (team: Omit<Team, 'id' | 'createdAt'>) => void;
  invitePlayer: (teamId: string, username: string) => void;
  respondToInvitation: (invitationId: string, response: 'accepted' | 'declined') => void;
  removeMember: (teamId: string, memberId: string) => void;
  getUserTeams: (username: string) => Team[];
  getUserInvitations: (username: string) => TeamInvitation[];
  leaveTeam: (teamId: string, username: string) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const useTeams = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeams must be used within a TeamProvider');
  }
  return context;
};

export const TeamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: 'team_1',
      name: 'Shadow Esports',
      leader: 'SkillzMaster',
      members: [
        {
          id: 'member_1',
          username: 'SkillzMaster',
          avatar: '/placeholder.svg',
          role: 'leader',
          joinedAt: '2 months ago'
        },
        {
          id: 'member_2',
          username: 'ProGamer99',
          avatar: '/placeholder.svg',
          role: 'member',
          joinedAt: '1 month ago'
        }
      ],
      game: 'VALORANT',
      maxMembers: 5,
      description: 'Competitive VALORANT team looking for skilled players',
      createdAt: '2 months ago',
      isRecruiting: true
    }
  ]);

  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);

  const createTeam = (teamData: Omit<Team, 'id' | 'createdAt'>) => {
    const newTeam: Team = {
      ...teamData,
      id: `team_${Date.now()}`,
      createdAt: 'now'
    };
    setTeams(prev => [newTeam, ...prev]);
  };

  const invitePlayer = (teamId: string, username: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    const invitation: TeamInvitation = {
      id: `inv_${Date.now()}`,
      teamId,
      teamName: team.name,
      teamLeader: team.leader,
      invitedUser: username,
      status: 'pending',
      sentAt: 'now'
    };

    setInvitations(prev => [invitation, ...prev]);
  };

  const respondToInvitation = (invitationId: string, response: 'accepted' | 'declined') => {
    const invitation = invitations.find(inv => inv.id === invitationId);
    if (!invitation) return;

    // Update invitation status
    setInvitations(prev => 
      prev.map(inv => 
        inv.id === invitationId ? { ...inv, status: response } : inv
      )
    );

    // If accepted, add member to team
    if (response === 'accepted') {
      setTeams(prev => 
        prev.map(team => {
          if (team.id === invitation.teamId) {
            const newMember: TeamMember = {
              id: `member_${Date.now()}`,
              username: invitation.invitedUser,
              avatar: '/placeholder.svg',
              role: 'member',
              joinedAt: 'now'
            };
            return {
              ...team,
              members: [...team.members, newMember]
            };
          }
          return team;
        })
      );
    }
  };

  const removeMember = (teamId: string, memberId: string) => {
    setTeams(prev => 
      prev.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            members: team.members.filter(member => member.id !== memberId)
          };
        }
        return team;
      })
    );
  };

  const leaveTeam = (teamId: string, username: string) => {
    setTeams(prev => 
      prev.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            members: team.members.filter(member => member.username !== username)
          };
        }
        return team;
      })
    );
  };

  const getUserTeams = (username: string) => {
    return teams.filter(team => 
      team.members.some(member => member.username === username)
    );
  };

  const getUserInvitations = (username: string) => {
    return invitations.filter(inv => 
      inv.invitedUser === username && inv.status === 'pending'
    );
  };

  return (
    <TeamContext.Provider value={{
      teams,
      invitations,
      createTeam,
      invitePlayer,
      respondToInvitation,
      removeMember,
      getUserTeams,
      getUserInvitations,
      leaveTeam
    }}>
      {children}
    </TeamContext.Provider>
  );
};