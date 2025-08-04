import React, { useState } from 'react';
import { ArrowLeft, Users, Trophy, Settings, Award, MessageSquare, Shield, Play, UserCheck, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Tournament, TournamentGroup, useTournaments } from '../../contexts/TournamentContext';
import { useToast } from '../../hooks/use-toast';
import { RoomIdPass } from '../ui/room-id-pass';

interface TournamentBracketManagerProps {
  tournament: Tournament;
  onBack: () => void;
}

const TournamentBracketManager: React.FC<TournamentBracketManagerProps> = ({ tournament, onBack }) => {
  const { updateTournament, createGroups, updateMatchResult, publishGroupRoom } = useTournaments();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showGroupCreation, setShowGroupCreation] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  
  // Group creation state
  const [numberOfGroups, setNumberOfGroups] = useState(4);
  const [assignmentType, setAssignmentType] = useState<'auto' | 'manual'>('auto');
  const [selectedGroup, setSelectedGroup] = useState<TournamentGroup | null>(null);
  
  // Result entry state
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [teamResults, setTeamResults] = useState<{[key: string]: {position: number, points: number}}>({});
  
  // Announcement state
  const [announcementData, setAnnouncementData] = useState({
    roomId: '',
    password: '',
    message: ''
  });

  const handleCreateGroups = () => {
    if (assignmentType === 'auto') {
      // Auto-assign teams to groups
      createGroups(tournament.id, numberOfGroups);
      toast({
        title: "Groups Created Successfully!",
        description: `${numberOfGroups} groups created with automatic team assignment`
      });
    } else {
      // Create empty groups for manual assignment
      const groups: TournamentGroup[] = [];
      for (let i = 0; i < numberOfGroups; i++) {
        groups.push({
          id: `G${i + 1}`,
          name: `Group ${String.fromCharCode(65 + i)}`, // Group A, B, C, etc.
          teams: [],
          matches: [],
          standings: []
        });
      }
      
      updateTournament(tournament.id, { 
        groups, 
        status: 'live' 
      });
      
      toast({
        title: "Groups Created!",
        description: "Empty groups created. You can now manually assign teams."
      });
    }
    setShowGroupCreation(false);
  };

  const handleManualTeamAssignment = (teamId: string, groupId: string) => {
    if (!tournament.groups) return;
    
    const updatedGroups = tournament.groups.map(group => {
      // Remove team from all groups first (both teams and standings)
      const filteredTeams = group.teams.filter(team => team.id !== teamId);
      const filteredStandings = group.standings.filter(s => s.teamId !== teamId);
      
      if (group.id === groupId) {
        // Add team to selected group
        const team = tournament.registeredTeams.find(t => t.id === teamId);
        if (team) {
          const newStanding = {
            teamId: team.id,
            teamName: team.name,
            points: 0,
            matches: 0,
            position: filteredTeams.length + 1
          };
          
          return {
            ...group,
            teams: [...filteredTeams, team],
            standings: [...filteredStandings, newStanding]
          };
        }
      }
      
      return { 
        ...group, 
        teams: filteredTeams,
        standings: filteredStandings
      };
    });
    
    updateTournament(tournament.id, { groups: updatedGroups });
    
    toast({
      title: "Team Assigned",
      description: "Team has been moved to the selected group"
    });
  };

  const handleUpdateResult = () => {
    if (!selectedMatch || !selectedGroup) return;
    
    const results = Object.entries(teamResults).map(([teamId, result]) => ({
      teamId,
      position: result.position,
      points: result.points
    }));
    
    updateMatchResult(tournament.id, selectedMatch.id, results);
    
    toast({
      title: "Results Updated",
      description: "Match results have been recorded successfully"
    });
    
    setShowResultDialog(false);
    setSelectedMatch(null);
    setTeamResults({});
  };

  const handleCreateNextRound = () => {
    if (!tournament.groups) return;
    
    // Logic to advance top teams from each group to next round
    const qualifiedTeams = tournament.groups.flatMap(group => 
      group.standings
        .sort((a, b) => b.points - a.points)
        .slice(0, 2) // Top 2 from each group
        .map(standing => tournament.registeredTeams.find(team => team.id === standing.teamId))
        .filter(Boolean)
    );
    
    // Create new groups for next round
    const nextRoundGroups = Math.ceil(qualifiedTeams.length / 4);
    const newGroups: TournamentGroup[] = [];
    
    for (let i = 0; i < nextRoundGroups; i++) {
      const startIndex = i * 4;
      const groupTeams = qualifiedTeams.slice(startIndex, startIndex + 4);
      
      newGroups.push({
        id: `R${tournament.currentRound + 1}_G${i + 1}`,
        name: `Round ${tournament.currentRound + 1} - Group ${String.fromCharCode(65 + i)}`,
        teams: groupTeams,
        matches: [],
        standings: groupTeams.map((team, index) => ({
          teamId: team!.id,
          teamName: team!.name,
          points: 0,
          matches: 0,
          position: index + 1
        }))
      });
    }
    
    updateTournament(tournament.id, {
      groups: newGroups,
      currentRound: tournament.currentRound + 1
    });
    
    toast({
      title: "Next Round Created",
      description: `Round ${tournament.currentRound + 1} groups have been created with qualified teams`
    });
  };

  const handleSendAnnouncement = () => {
    if (!selectedGroup) return;
    
    const updatedGroups = tournament.groups?.map(group => 
      group.id === selectedGroup.id 
        ? { 
            ...group, 
            roomId: announcementData.roomId, 
            password: announcementData.password 
          }
        : group
    );
    
    updateTournament(tournament.id, { groups: updatedGroups });
    
    // Here you would send notifications to all team members in the group
    toast({
      title: "Announcement Sent",
      description: `Room details sent to all teams in ${selectedGroup.name}`
    });
    
    setShowAnnouncementDialog(false);
    setAnnouncementData({ roomId: '', password: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              onClick={onBack}
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/10 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">{tournament.name}</h1>
              <p className="text-gray-300">Tournament Management</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {!tournament.groups && tournament.registeredTeams.length > 0 && (
              <Button
                onClick={() => setShowGroupCreation(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                Create Groups
              </Button>
            )}
            
            {tournament.groups && tournament.currentRound < tournament.totalRounds && (
              <Button
                onClick={handleCreateNextRound}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Next Round
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border-gray-700">
            <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
            <TabsTrigger value="groups" className="text-white">Groups</TabsTrigger>
            <TabsTrigger value="matches" className="text-white">Matches</TabsTrigger>
            <TabsTrigger value="results" className="text-white">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Registered Teams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {tournament.registeredTeams.length}
                  </div>
                  <p className="text-gray-400">out of {tournament.totalSlots} slots</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Current Round
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {tournament.currentRound}
                  </div>
                  <p className="text-gray-400">of {tournament.totalRounds} rounds</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Groups Created
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {tournament.groups?.length || 0}
                  </div>
                  <p className="text-gray-400">active groups</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="groups" className="mt-6">
            {!tournament.groups ? (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Settings className="w-16 h-16 text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Groups Created</h3>
                  <p className="text-gray-400 text-center mb-4">
                    Create groups to organize teams and start the tournament.
                  </p>
                  <Button
                    onClick={() => setShowGroupCreation(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Create Groups
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Unassigned Teams (always show if teams are not assigned to groups) */}
                {tournament.registeredTeams.some(team => !tournament.groups?.some(group => group.teams.some(t => t.id === team.id))) && (
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Unassigned Teams</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tournament.registeredTeams
                          .filter(team => !tournament.groups?.some(group => group.teams.some(t => t.id === team.id)))
                          .map((team) => (
                          <div key={team.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                            <div>
                              <h4 className="text-white font-medium">{team.name}</h4>
                              <p className="text-gray-400 text-sm">Captain: {team.captain}</p>
                            </div>
                            <Select onValueChange={(groupId) => handleManualTeamAssignment(team.id, groupId)}>
                              <SelectTrigger className="w-32 bg-gray-600 border-gray-500 text-white">
                                <SelectValue placeholder="Assign" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-700 border-gray-600">
                                {tournament.groups?.map(group => (
                                  <SelectItem key={group.id} value={group.id} className="text-white">
                                    {group.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-6">
                  {tournament.groups.map((group) => (
                    <div key={group.id} className="space-y-4">
                      {/* Group Room ID & Password */}
                      <RoomIdPass
                        title={`${group.name} Room`}
                        roomId={group.roomId}
                        password={group.password}
                        isPublished={group.isRoomPublished}
                        isOwner={true}
                        onPublish={(roomId, password) => publishGroupRoom(tournament.id, group.id, roomId, password)}
                        className="lg:col-span-2"
                      />
                      
                      {/* Group Details */}
                      <Card className="bg-gray-800/50 border-gray-700">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-white">{group.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {group.teams.length === 0 ? (
                              <p className="text-gray-400 text-center py-4">No teams assigned</p>
                            ) : (
                              group.teams.map((team) => (
                                <div key={team.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                                  <div>
                                    <h4 className="text-white font-medium">{team.name}</h4>
                                    <p className="text-gray-400 text-sm">Captain: {team.captain}</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="outline">
                                      #{group.standings.find(s => s.teamId === team.id)?.position || '-'}
                                    </Badge>
                                    {/* Option to reassign team */}
                                    <Select onValueChange={(groupId) => handleManualTeamAssignment(team.id, groupId)}>
                                      <SelectTrigger className="w-24 bg-gray-600 border-gray-500 text-white">
                                        <SelectValue placeholder="Move" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-700 border-gray-600">
                                        {tournament.groups?.map(g => (
                                          <SelectItem key={g.id} value={g.id} className="text-white">
                                            {g.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="matches" className="mt-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Match Management</CardTitle>
              </CardHeader>
              <CardContent>
                {tournament.groups ? (
                  <div className="space-y-4">
                    {tournament.groups.map((group) => (
                      <div key={group.id} className="p-4 bg-gray-700/50 rounded-lg">
                        <h3 className="text-white font-medium mb-3">{group.name}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-gray-600/50 rounded border">
                            <div>
                              <p className="text-white">Group Stage Match</p>
                              <p className="text-gray-400 text-sm">{group.teams.length} teams competing</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedGroup(group);
                                  setSelectedMatch({ id: `${group.id}_match`, groupId: group.id });
                                  setShowResultDialog(true);
                                }}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Award className="w-4 h-4 mr-1" />
                                Add Result
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Play className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Create groups first to manage matches</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Tournament Results</CardTitle>
              </CardHeader>
              <CardContent>
                {tournament.groups ? (
                  <div className="space-y-6">
                    {tournament.groups.map((group) => (
                      <div key={group.id}>
                        <h3 className="text-white font-medium mb-3">{group.name} Standings</h3>
                        <div className="space-y-2">
                          {group.standings
                            .sort((a, b) => b.points - a.points)
                            .map((standing) => (
                            <div key={standing.teamId} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                              <div className="flex items-center">
                                <Badge className="mr-3">#{standing.position}</Badge>
                                <div>
                                  <h4 className="text-white font-medium">{standing.teamName}</h4>
                                  <p className="text-gray-400 text-sm">{standing.matches} matches played</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-yellow-400 font-bold">{standing.points} pts</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Results will appear after matches are played</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Group Creation Dialog */}
      <Dialog open={showGroupCreation} onOpenChange={setShowGroupCreation}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Create Tournament Groups</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Number of Groups</Label>
              <Select value={numberOfGroups.toString()} onValueChange={(value) => setNumberOfGroups(parseInt(value))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {[2, 4, 6, 8, 10, 12, 16].map(num => (
                    <SelectItem key={num} value={num.toString()} className="text-white">
                      {num} Groups
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-white">Team Assignment</Label>
              <Select value={assignmentType} onValueChange={(value: 'auto' | 'manual') => setAssignmentType(value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="auto" className="text-white">Automatic Assignment</SelectItem>
                  <SelectItem value="manual" className="text-white">Manual Assignment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowGroupCreation(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateGroups}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Create Groups
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Result Entry Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Enter Match Results</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedGroup?.teams.map((team, index) => (
              <div key={team.id} className="flex items-center space-x-4 p-3 bg-gray-700/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-white font-medium">{team.name}</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <Label className="text-gray-300">Position:</Label>
                  <Select 
                    value={teamResults[team.id]?.position?.toString() || ''} 
                    onValueChange={(value) => setTeamResults(prev => ({
                      ...prev,
                      [team.id]: { ...prev[team.id], position: parseInt(value) }
                    }))}
                  >
                    <SelectTrigger className="w-20 bg-gray-600 border-gray-500 text-white">
                      <SelectValue placeholder="#" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {Array.from({ length: selectedGroup.teams.length }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()} className="text-white">
                          #{i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Label className="text-gray-300">Points:</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    className="w-20 bg-gray-600 border-gray-500 text-white"
                    value={teamResults[team.id]?.points || ''}
                    onChange={(e) => setTeamResults(prev => ({
                      ...prev,
                      [team.id]: { ...prev[team.id], points: parseInt(e.target.value) || 0 }
                    }))}
                  />
                </div>
              </div>
            ))}
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowResultDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateResult}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Save Results
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Announcement Dialog */}
      <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Send Group Announcement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Room ID</Label>
              <Input
                value={announcementData.roomId}
                onChange={(e) => setAnnouncementData(prev => ({ ...prev, roomId: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter room ID"
              />
            </div>
            
            <div>
              <Label className="text-white">Room Password</Label>
              <Input
                value={announcementData.password}
                onChange={(e) => setAnnouncementData(prev => ({ ...prev, password: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter room password"
              />
            </div>
            
            <div>
              <Label className="text-white">Additional Message</Label>
              <Textarea
                value={announcementData.message}
                onChange={(e) => setAnnouncementData(prev => ({ ...prev, message: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Any additional instructions..."
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAnnouncementDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendAnnouncement}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Send Announcement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TournamentBracketManager;