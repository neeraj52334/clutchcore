import React, { useState } from 'react';
import { ArrowLeft, Trophy, Users, Calendar, DollarSign, Settings, Play, Crown, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Tournament, useTournaments } from '../../contexts/TournamentContext';
import { useAuth } from '../../contexts/AuthContext';
import TournamentBracketManager from './TournamentBracketManager';
import { RoomIdPass } from '../ui/room-id-pass';

interface TournamentDetailsProps {
  tournament: Tournament;
  onBack: () => void;
}

const TournamentDetails: React.FC<TournamentDetailsProps> = ({ tournament, onBack }) => {
  const { user } = useAuth();
  const { publishTournamentRoom, publishGroupRoom, getUserTournaments } = useTournaments();
  const [activeTab, setActiveTab] = useState('overview');
  const [showManager, setShowManager] = useState(false);
  
  const isOwner = user?.username === tournament.createdBy || user?.role === 'community_admin' || user?.role === 'owner';
  const isParticipant = user ? getUserTournaments(user.username).some(t => t.id === tournament.id) : false;
  
  if (showManager) {
    return <TournamentBracketManager tournament={tournament} onBack={() => setShowManager(false)} />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-600';
      case 'live': return 'bg-yellow-600';
      case 'completed': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const registrationProgress = (tournament.registeredTeams.length / tournament.totalSlots) * 100;
  const totalGroups = Math.floor(tournament.totalSlots / tournament.teamsPerGroup);
  const remainingTeams = tournament.totalSlots % tournament.teamsPerGroup;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            onClick={onBack}
            variant="ghost" 
            size="sm"
            className="text-white hover:bg-white/10 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tournaments
          </Button>
        </div>

        {/* Tournament Header */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
                  <div>
                    <h1 className="text-3xl font-bold text-white">{tournament.name}</h1>
                    <div className="flex items-center mt-2 space-x-4">
                      <Badge variant="secondary" className="text-sm">
                        {tournament.game}
                      </Badge>
                      <Badge className={`${getStatusColor(tournament.status)} text-white capitalize`}>
                        {tournament.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center text-green-400">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span className="font-semibold">{formatPrizePool(tournament.prizePool)}</span>
                  </div>
                  <div className="flex items-center text-blue-400">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{tournament.registeredTeams.length}/{tournament.totalSlots} Teams</span>
                  </div>
                  <div className="flex items-center text-purple-400">
                    <Crown className="w-4 h-4 mr-2" />
                    <span>{tournament.teamsPerGroup} per group</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Round {tournament.currentRound}/{tournament.totalRounds}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 lg:mt-0 lg:ml-6">
                {isOwner ? (
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => setShowManager(true)}
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Manage Tournament
                    </Button>
                  </div>
                ) : (
                  <>
                    {tournament.status === 'open' && (
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full lg:w-auto">
                        Register Team
                      </Button>
                    )}
                    {tournament.status === 'live' && (
                      <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white w-full lg:w-auto">
                        <Play className="w-4 h-4 mr-2" />
                        Join Live
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Registration Progress */}
            {tournament.status === 'open' && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">Registration Progress</span>
                  <span className="text-gray-300 text-sm">{Math.round(registrationProgress)}%</span>
                </div>
                <Progress 
                  value={registrationProgress} 
                  className="h-2 bg-gray-700"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border-gray-700">
            <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
            <TabsTrigger value="teams" className="text-white">Teams</TabsTrigger>
            <TabsTrigger value="brackets" className="text-white">Brackets</TabsTrigger>
            <TabsTrigger value="rules" className="text-white">Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Room ID & Password for Tournament */}
              {(isParticipant || isOwner) && (tournament.entryType === 'paid' || tournament.status === 'live') && (
                <div className="lg:col-span-2">
                  <RoomIdPass
                    title="Tournament Room"
                    roomId={tournament.roomId}
                    password={tournament.roomPassword}
                    isPublished={tournament.isRoomPublished}
                    isOwner={isOwner}
                    onPublish={(roomId, password) => publishTournamentRoom(tournament.id, roomId, password)}
                  />
                </div>
              )}

              {/* Tournament Info */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Tournament Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-gray-300 text-sm font-medium">Registration Period</h4>
                    <p className="text-white">{formatDate(tournament.registrationStart)}</p>
                    <p className="text-white">to {formatDate(tournament.registrationEnd)}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-gray-300 text-sm font-medium">Entry Type</h4>
                    <p className="text-white">
                      {tournament.entryType === 'free' ? 'Free Entry' : `₹${tournament.entryFee} Entry Fee`}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-gray-300 text-sm font-medium">Format</h4>
                    <p className="text-white">League/Seed Style Tournament</p>
                    <p className="text-gray-400 text-sm">
                      {totalGroups} groups with {tournament.teamsPerGroup} teams each
                      {remainingTeams > 0 && ` + 1 group with ${remainingTeams} teams`}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-gray-300 text-sm font-medium">Created By</h4>
                    <p className="text-white">{tournament.createdBy}</p>
                    <p className="text-gray-400 text-sm">{formatDate(tournament.createdAt)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Prize Distribution */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Prize Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-yellow-600/20 border border-yellow-600/30 rounded-lg">
                      <div className="flex items-center">
                        <Crown className="w-5 h-5 text-yellow-500 mr-2" />
                        <span className="text-white font-medium">1st Place</span>
                      </div>
                      <span className="text-yellow-400 font-bold">
                        {formatPrizePool(tournament.prizePool * 0.5)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-600/20 border border-gray-600/30 rounded-lg">
                      <span className="text-white">2nd Place</span>
                      <span className="text-gray-300 font-medium">
                        {formatPrizePool(tournament.prizePool * 0.3)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-orange-600/20 border border-orange-600/30 rounded-lg">
                      <span className="text-white">3rd Place</span>
                      <span className="text-orange-400 font-medium">
                        {formatPrizePool(tournament.prizePool * 0.2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="teams" className="mt-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Registered Teams</CardTitle>
              </CardHeader>
              <CardContent>
                {tournament.registeredTeams.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No teams registered yet</h3>
                    <p className="text-gray-400">
                      Be the first to register your team for this tournament!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tournament.registeredTeams.map((team, index) => (
                      <div key={team.id} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium">{team.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">Captain: {team.captain}</p>
                        <p className="text-gray-400 text-xs">
                          Registered: {formatDate(team.registeredAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brackets" className="mt-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Tournament Brackets</CardTitle>
              </CardHeader>
              <CardContent>
                {tournament.status === 'open' ? (
                  <div className="text-center py-8">
                    <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Brackets Coming Soon</h3>
                    <p className="text-gray-400">
                      Brackets will be generated once registration closes.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Settings className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Brackets Available</h3>
                    <p className="text-gray-400 mb-4">
                      Tournament brackets and group assignments are now live.
                    </p>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      View Brackets
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="mt-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Tournament Rules</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Registration Rules</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Teams must register before the registration deadline</li>
                      <li>All team members must be verified users</li>
                      <li>Entry fee (if applicable) must be paid during registration</li>
                      <li>Team composition cannot be changed after registration</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2">Format Rules</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Tournament follows league/seed style format</li>
                      <li>Teams are divided into groups of {tournament.teamsPerGroup}</li>
                      <li>Top teams from each group advance to next round</li>
                      <li>Final bracket consists of qualified teams</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2">Match Rules</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>All matches must be played at scheduled times</li>
                      <li>Teams must join match rooms 10 minutes before start time</li>
                      <li>Results must be reported within 30 minutes of match completion</li>
                      <li>Disputes must be reported immediately to tournament admins</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2">Code of Conduct</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>No cheating, hacking, or use of unauthorized software</li>
                      <li>Respectful communication with all participants</li>
                      <li>No sharing of room passwords with unauthorized parties</li>
                      <li>Violation of rules may result in disqualification</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TournamentDetails;