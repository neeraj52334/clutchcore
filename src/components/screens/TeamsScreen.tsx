import React, { useState } from 'react';
import { Plus, Users, Crown, UserPlus, UserMinus, LogOut, Search, Wallet, Send, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { useAuth } from '../../contexts/AuthContext';
import { useTeams } from '../../contexts/TeamContext';
import { useNotifications } from '../../contexts/NotificationContext';

const TeamsScreen = () => {
  const { user } = useAuth();
  const { teams, createTeam, invitePlayer, removeMember, getUserTeams, leaveTeam, addPrizeToTeam, distributeFunds } = useTeams();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('browse');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [inviteUsername, setInviteUsername] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [gameFilter, setGameFilter] = useState('all');

  const [createForm, setCreateForm] = useState({
    name: '',
    game: '',
    maxMembers: 5,
    description: ''
  });

  const userTeams = user ? getUserTeams(user.username) : [];
  const canCreateMoreTeams = userTeams.length < 2;
  const availableTeams = teams.filter(team => 
    !team.members.some(member => member.username === user?.username) && 
    team.isRecruiting &&
    team.members.length < team.maxMembers
  );

  const filteredTeams = availableTeams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.leader.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = gameFilter === 'all' || team.game.toLowerCase() === gameFilter.toLowerCase();
    return matchesSearch && matchesGame;
  });

  const games = ['VALORANT', 'Free Fire', 'BGMI', 'COD Mobile'];

  const handleCreateTeam = () => {
    if (!user || !createForm.name || !createForm.game) {
      alert('Please fill in all required fields');
      return;
    }

    if (!canCreateMoreTeams) {
      alert('You can only create or join a maximum of 2 teams');
      return;
    }

    const leaderMember = {
      id: `member_${Date.now()}`,
      username: user.username,
      avatar: user.avatar,
      role: 'leader' as const,
      joinedAt: 'now'
    };

    createTeam({
      name: createForm.name,
      leader: user.username,
      members: [leaderMember],
      game: createForm.game,
      maxMembers: createForm.maxMembers,
      description: createForm.description,
      isRecruiting: true
    });

    setCreateForm({ name: '', game: '', maxMembers: 5, description: '' });
    setShowCreateForm(false);
    setActiveTab('my-teams');
    alert('Team created successfully!');
  };

  const handleInvitePlayer = (teamId: string) => {
    if (!inviteUsername.trim()) {
      alert('Please enter a username');
      return;
    }

    invitePlayer(teamId, inviteUsername);
    
    // Add notification for the invited user
    addNotification({
      type: 'team_invite',
      title: 'Team Invitation',
      message: `You've been invited to join a team`,
      data: { teamId }
    });

    setInviteUsername('');
    alert(`Invitation sent to ${inviteUsername}!`);
  };

  const handleRemoveMember = (teamId: string, memberId: string, memberName: string) => {
    if (confirm(`Remove ${memberName} from the team?`)) {
      removeMember(teamId, memberId);
      alert(`${memberName} has been removed from the team`);
    }
  };

  const handleLeaveTeam = (teamId: string, teamName: string) => {
    if (confirm(`Are you sure you want to leave ${teamName}?`)) {
      leaveTeam(teamId, user!.username);
      alert(`You have left ${teamName}`);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <Users className="w-7 h-7 mr-2 text-purple-400" />
          Teams
        </h1>
        <Button
          onClick={() => setShowCreateForm(true)}
          disabled={!canCreateMoreTeams}
          className="bg-purple-600 hover:bg-purple-700 flex items-center space-x-1 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Create Team</span>
        </Button>
      </div>

      {/* Create Team Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-400" />
                Create Team
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Team Name *</Label>
                <Input
                  placeholder="Enter team name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Game *</Label>
                <Select value={createForm.game} onValueChange={(value) => 
                  setCreateForm(prev => ({ ...prev, game: value }))
                }>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select a game" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {games.map((game) => (
                      <SelectItem key={game} value={game} className="text-white">
                        {game}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Max Members</Label>
                <Select value={createForm.maxMembers.toString()} onValueChange={(value) => 
                  setCreateForm(prev => ({ ...prev, maxMembers: parseInt(value) }))
                }>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {[3, 4, 5, 6, 8, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()} className="text-white">
                        {num} members
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Description</Label>
                <Textarea
                  placeholder="Team description..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  onClick={handleCreateTeam}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Create Team
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 border-gray-600 text-gray-400 hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="browse" className="data-[state=active]:bg-purple-600">
            Browse Teams
          </TabsTrigger>
          <TabsTrigger value="my-teams" className="data-[state=active]:bg-purple-600">
            My Teams ({userTeams.length})
          </TabsTrigger>
          <TabsTrigger value="wallet" className="data-[state=active]:bg-purple-600">
            <Wallet className="w-4 h-4 mr-1" />
            Team Wallet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <Select value={gameFilter} onValueChange={setGameFilter}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all" className="text-white">All Games</SelectItem>
                {games.map((game) => (
                  <SelectItem key={game} value={game.toLowerCase()} className="text-white">
                    {game}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Available Teams */}
          <div className="space-y-4">
            {filteredTeams.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No teams found</p>
              </div>
            ) : (
              filteredTeams.map((team) => (
                <Card key={team.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-white font-bold text-lg">{team.name}</h3>
                        <p className="text-gray-400 text-sm">Led by {team.leader}</p>
                      </div>
                      <Badge className="bg-blue-600">{team.game}</Badge>
                    </div>
                    
                    {team.description && (
                      <p className="text-gray-300 mb-3">{team.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-400">
                          {team.members.length}/{team.maxMembers} members
                        </span>
                        {team.isRecruiting && (
                          <Badge variant="outline" className="border-green-400 text-green-400">
                            Recruiting
                          </Badge>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        disabled={!team.isRecruiting || team.members.length >= team.maxMembers}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Request to Join
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="my-teams" className="space-y-4">
          {userTeams.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">You haven't joined any teams yet</p>
              <Button 
                onClick={() => setActiveTab('browse')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Browse Teams
              </Button>
            </div>
          ) : (
            userTeams.map((team) => {
              const isLeader = team.leader === user?.username;
              return (
                <Card key={team.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-white font-bold text-lg flex items-center">
                          {team.name}
                          {isLeader && <Crown className="w-4 h-4 ml-2 text-yellow-400" />}
                        </h3>
                        <p className="text-gray-400 text-sm">{team.game} • {team.members.length}/{team.maxMembers} members</p>
                      </div>
                      {!isLeader && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleLeaveTeam(team.id, team.name)}
                          className="border-red-400 text-red-400 hover:bg-red-900/20"
                        >
                          <LogOut className="w-4 h-4 mr-1" />
                          Leave
                        </Button>
                      )}
                    </div>

                    {/* Team Members */}
                    <div className="space-y-2 mb-4">
                      <h4 className="text-white font-medium">Members</h4>
                      <div className="space-y-2">
                        {team.members.map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback className="bg-blue-600 text-white text-xs">
                                  {member.username[0]?.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-white font-medium">{member.username}</p>
                                <p className="text-xs text-gray-400">Joined {member.joinedAt}</p>
                              </div>
                              {member.role === 'leader' && (
                                <Crown className="w-4 h-4 text-yellow-400" />
                              )}
                            </div>
                            {isLeader && member.role !== 'leader' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRemoveMember(team.id, member.id, member.username)}
                                className="border-red-400 text-red-400 hover:bg-red-900/20"
                              >
                                <UserMinus className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Invite Players (Leader only) */}
                    {isLeader && team.members.length < team.maxMembers && (
                      <div className="space-y-2">
                        <h4 className="text-white font-medium">Invite Players</h4>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Enter username"
                            value={inviteUsername}
                            onChange={(e) => setInviteUsername(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                          <Button 
                            onClick={() => handleInvitePlayer(team.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <UserPlus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="wallet" className="space-y-4">
          {userTeams.filter(team => team.leader === user?.username).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">You need to be a team leader to manage team wallet</p>
            </div>
          ) : (
            userTeams.filter(team => team.leader === user?.username).map((team) => (
              <Card key={team.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Wallet className="w-5 h-5 mr-2 text-green-400" />
                    {team.name} Wallet
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">Current Balance</p>
                      <p className="text-2xl font-bold text-green-400">₹{team.wallet.balance}</p>
                    </div>
                  </div>

                  {/* Distribution Section */}
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Distribute Funds</h4>
                    {team.members.filter(member => member.role !== 'leader').map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="bg-blue-600 text-white text-xs">
                              {member.username[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-white">{member.username}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            placeholder="Amount"
                            className="w-24 bg-gray-600 border-gray-500 text-white"
                            onChange={(e) => {
                              // Store amount for this member
                            }}
                          />
                          <Button 
                            size="sm"
                            onClick={() => {
                              const amount = parseInt((document.querySelector(`input[placeholder="Amount"]`) as HTMLInputElement)?.value || '0');
                              if (amount > 0 && amount <= team.wallet.balance) {
                                distributeFunds(team.id, member.id, amount);
                                alert(`₹${amount} distributed to ${member.username}`);
                              } else {
                                alert('Invalid amount or insufficient balance');
                              }
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Transaction History */}
                  <div className="space-y-3">
                    <h4 className="text-white font-medium flex items-center">
                      <History className="w-4 h-4 mr-2" />
                      Recent Transactions
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {team.wallet.transactions.slice(0, 10).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                          <div>
                            <p className="text-white font-medium">{transaction.description}</p>
                            <p className="text-xs text-gray-400">{transaction.createdAt}</p>
                          </div>
                          <p className={`font-bold ${transaction.type === 'prize_received' ? 'text-green-400' : 'text-red-400'}`}>
                            {transaction.type === 'prize_received' ? '+' : '-'}₹{transaction.amount}
                          </p>
                        </div>
                      ))}
                      {team.wallet.transactions.length === 0 && (
                        <p className="text-gray-400 text-center py-4">No transactions yet</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamsScreen;