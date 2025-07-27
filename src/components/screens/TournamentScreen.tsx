import React, { useState } from 'react';
import { Trophy, Users, Calendar, DollarSign, Plus, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useTournaments } from '../../contexts/TournamentContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { useTeams } from '../../contexts/TeamContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import TournamentCreation from './TournamentCreation';
import TournamentDetails from './TournamentDetails';

const TournamentScreen = () => {
  const { tournaments, registerTeam, addDemoTeams } = useTournaments();
  const { user } = useAuth();
  const { toast } = useToast();
  const { getUserTeams } = useTeams();
  const { addNotification } = useNotifications();
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'details'>('list');
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'live' | 'completed'>('all');
  const [gameFilter, setGameFilter] = useState<string>('all');
  const [showTeamSelection, setShowTeamSelection] = useState(false);
  const [selectedTournamentForReg, setSelectedTournamentForReg] = useState<string | null>(null);

  const games = ['VALORANT', 'Free Fire', 'PUBG Mobile', 'Call of Duty Mobile', 'Clash Royale', 'FIFA Mobile'];

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.game.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tournament.status === statusFilter;
    const matchesGame = gameFilter === 'all' || tournament.game === gameFilter;
    
    return matchesSearch && matchesStatus && matchesGame;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-600';
      case 'live': return 'bg-yellow-600';
      case 'completed': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrizePool = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  };

  const handleTournamentClick = (tournament: any) => {
    setSelectedTournament(tournament);
    setCurrentView('details');
  };

  const canCreateTournament = user?.role === 'community_admin' || user?.role === 'owner';

  if (currentView === 'create') {
    return <TournamentCreation onBack={() => setCurrentView('list')} />;
  }

  if (currentView === 'details' && selectedTournament) {
    return (
      <TournamentDetails 
        tournament={selectedTournament} 
        onBack={() => setCurrentView('list')} 
      />
    );
  }

  const handleRegisterTeam = (tournamentId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to register for tournaments",
        variant: "destructive"
      });
      return;
    }

    // Find the tournament
    const foundTournament = tournaments.find(t => t.id === tournamentId);
    if (!foundTournament) return;

    if (foundTournament.mode === 'solo') {
      // Solo registration - show confirmation and register player
      const confirmed = window.confirm(`Register for ${foundTournament.name}?\n\nYour profile info:\nUsername: ${user.username}\nIn-game ID: ${user.gameIds[foundTournament.game] || 'Not set'}`);
      if (confirmed) {
        const team = {
          id: `team_${Date.now()}`,
          name: user.username,
          captain: user.username,
          members: [{ username: user.username, inGameName: user.gameIds[foundTournament.game] || user.username }],
          registeredAt: new Date().toISOString()
        };
        registerTeam(tournamentId, team);
        
        // Add registration notification
        addNotification({
          type: 'tournament_registration',
          title: 'Registration Successful',
          message: `Successfully registered for ${foundTournament.name}`,
          data: { tournamentId, tournamentName: foundTournament.name }
        });
        
        toast({
          title: "Registration Successful!",
          description: `You've been registered for ${foundTournament.name}`,
        });
      }
    } else {
      // Squad registration - show team selection dialog
      setSelectedTournamentForReg(tournamentId);
      setShowTeamSelection(true);
    }
  };

  const handleSquadRegistration = (teamId: string) => {
    if (!selectedTournamentForReg || !user) return;
    
    const foundTournament = tournaments.find(t => t.id === selectedTournamentForReg);
    const userTeams = getUserTeams(user.username);
    const selectedTeam = userTeams.find(t => t.id === teamId);
    
    if (!foundTournament || !selectedTeam) return;
    
    const confirmed = window.confirm(`Register team "${selectedTeam.name}" for ${foundTournament.name}?`);
    if (confirmed) {
      const tournamentTeam = {
        id: `team_${Date.now()}`,
        name: selectedTeam.name,
        captain: selectedTeam.leader,
        members: selectedTeam.members.map(m => ({
          username: m.username,
          inGameName: user.gameIds[foundTournament.game] || m.username
        })),
        registeredAt: new Date().toISOString(),
        teamId: selectedTeam.id
      };
      
      registerTeam(selectedTournamentForReg, tournamentTeam);
      
      // Send notifications to all team members
      selectedTeam.members.forEach(member => {
        addNotification({
          type: 'tournament_registration',
          title: 'Team Tournament Registration',
          message: `Your team "${selectedTeam.name}" has been registered for ${foundTournament.name}`,
          data: { 
            tournamentId: selectedTournamentForReg, 
            tournamentName: foundTournament.name,
            teamName: selectedTeam.name
          }
        });
      });
      
      toast({
        title: "Team Registered!",
        description: `${selectedTeam.name} has been registered for ${foundTournament.name}`,
      });
      
      setShowTeamSelection(false);
      setSelectedTournamentForReg(null);
    }
  };

  const handleAddDemoTeams = (tournamentId: string) => {
    addDemoTeams(tournamentId);
    toast({
      title: "Demo Teams Added",
      description: "Tournament filled with demo teams to test bracket system",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Trophy className="w-8 h-8 mr-3 text-yellow-500" />
              Championship
            </h1>
            <p className="text-gray-300 mt-1">Compete in organized tournaments and win prizes</p>
          </div>
          
          {canCreateTournament && (
            <div className="flex space-x-2">
              <Button
                onClick={() => setCurrentView('create')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Tournament
              </Button>
              <Button
                onClick={() => {
                  const openTournament = filteredTournaments.find(t => t.status === 'open');
                  if (openTournament) {
                    handleAddDemoTeams(openTournament.id);
                  }
                }}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Fill Demo Teams
              </Button>
            </div>
          )}
        </div>

        {/* Filters */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search tournaments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all" className="text-white">All Status</SelectItem>
                  <SelectItem value="open" className="text-white">Open</SelectItem>
                  <SelectItem value="live" className="text-white">Live</SelectItem>
                  <SelectItem value="completed" className="text-white">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={gameFilter} onValueChange={setGameFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Filter by game" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all" className="text-white">All Games</SelectItem>
                  {games.map(game => (
                    <SelectItem key={game} value={game} className="text-white">
                      {game}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center text-gray-300">
                <Filter className="w-4 h-4 mr-2" />
                <span className="text-sm">{filteredTournaments.length} tournaments</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tournament Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map(tournament => (
            <Card 
              key={tournament.id} 
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-200 cursor-pointer group"
              onClick={() => handleTournamentClick(tournament)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg mb-2 group-hover:text-purple-300 transition-colors">
                      {tournament.name}
                    </CardTitle>
                    <Badge variant="secondary" className="mb-2">
                      {tournament.game}
                    </Badge>
                  </div>
                  <Badge className={`${getStatusColor(tournament.status)} text-white capitalize`}>
                    {tournament.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Prize Pool */}
                <div className="flex items-center text-green-400">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="font-semibold">{formatPrizePool(tournament.prizePool)} Prize Pool</span>
                </div>

                {/* Slots */}
                <div className="flex items-center text-blue-400">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{tournament.registeredTeams.length}/{tournament.totalSlots} Teams</span>
                </div>

                {/* Registration Period */}
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {tournament.status === 'open' ? 'Ends: ' : 'Ended: '}
                    {formatDate(tournament.registrationEnd)}
                  </span>
                </div>

                {/* Entry Type */}
                <div className="flex items-center justify-between">
                  <Badge variant={tournament.entryType === 'free' ? 'default' : 'secondary'}>
                    {tournament.entryType === 'free' ? 'Free Entry' : `₹${tournament.entryFee} Entry`}
                  </Badge>
                  
                  {tournament.status === 'open' && (
                    <Button 
                      size="sm" 
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => handleRegisterTeam(tournament.id)}
                    >
                      Register
                    </Button>
                  )}
                </div>

                {/* Progress Bar for Registration */}
                {tournament.status === 'open' && (
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((tournament.registeredTeams.length / tournament.totalSlots) * 100, 100)}%` 
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTournaments.length === 0 && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Trophy className="w-16 h-16 text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No tournaments found</h3>
              <p className="text-gray-400 text-center mb-4">
                {searchTerm || statusFilter !== 'all' || gameFilter !== 'all' 
                  ? 'Try adjusting your filters to see more tournaments.'
                  : 'No tournaments are currently available.'
                }
              </p>
              {canCreateTournament && (
                <Button
                  onClick={() => setCurrentView('create')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Tournament
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Team Selection Dialog */}
      <Dialog open={showTeamSelection} onOpenChange={setShowTeamSelection}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Select Team for Registration</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {user && getUserTeams(user.username).map((team) => (
              <Card key={team.id} className="bg-gray-700 border-gray-600 cursor-pointer hover:bg-gray-600" 
                    onClick={() => handleSquadRegistration(team.id)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">{team.name}</h4>
                      <p className="text-gray-400 text-sm">{team.members.length}/{team.maxMembers} members</p>
                    </div>
                    <Badge className="bg-purple-600">{team.game}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TournamentScreen;