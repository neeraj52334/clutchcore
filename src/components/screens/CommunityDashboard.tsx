import { useState } from 'react';
import { ArrowLeft, Users, Trophy, MessageSquare, Plus, Edit, Eye, Calendar, Target, Upload, Award, Megaphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  tournaments: number;
  cover: string;
  created: string;
}

const CommunityDashboard = () => {
  const [activeView, setActiveView] = useState<'list' | 'manage' | 'create' | 'edit-tournament'>('list');
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [showCreateTournament, setShowCreateTournament] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [editTab, setEditTab] = useState('participants');
  
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    category: ''
  });

  const [tournamentForm, setTournamentForm] = useState({
    title: '',
    game: '',
    type: '',
    entryFee: '',
    prizePool: '',
    maxParticipants: '',
    deadline: ''
  });

  const [announcement, setAnnouncement] = useState('');
  const [resultText, setResultText] = useState('');
  const [resultImage, setResultImage] = useState<File | null>(null);

  const myCommunities: Community[] = [
    {
      id: '1',
      name: 'Elite Gaming Hub',
      description: 'Competitive gaming community for VALORANT and CS2 players',
      members: 2456,
      tournaments: 15,
      cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop',
      created: '6 months ago'
    },
    {
      id: '2', 
      name: 'FF Champions',
      description: 'Free Fire tournament organizers and competitive players',
      members: 1823,
      tournaments: 8,
      cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop',
      created: '3 months ago'
    }
  ];

  const communityTournaments = [
    {
      id: 1,
      title: "Elite VALORANT Championship",
      game: "VALORANT",
      participants: 64,
      maxParticipants: 128,
      prizePool: 25000,
      status: "active",
      participantsList: [
        { id: 1, name: 'ProGamer123', team: 'Team Alpha', position: null },
        { id: 2, name: 'SniperKing', team: 'Team Beta', position: null },
        { id: 3, name: 'FastFingers', team: 'Team Gamma', position: null },
      ],
      announcements: [
        { id: 1, text: 'Tournament starts at 6 PM IST', timestamp: '2 hours ago' },
        { id: 2, text: 'Room ID: VAL123, Password: elite2024', timestamp: '1 hour ago' },
      ],
      results: [
        { id: 1, text: '1st Place: Team Alpha', image: null },
        { id: 2, text: '2nd Place: Team Beta', image: null },
      ]
    },
    {
      id: 2,
      title: "FF Weekend Cup",
      game: "Free Fire", 
      participants: 32,
      maxParticipants: 64,
      prizePool: 10000,
      status: "upcoming",
      participantsList: [
        { id: 1, name: 'FFMaster', team: 'Solo', position: null },
        { id: 2, name: 'FireKing', team: 'Solo', position: null },
      ],
      announcements: [],
      results: []
    }
  ];

  const handleCreateCommunity = () => {
    console.log('Creating community:', newCommunity);
    setNewCommunity({ name: '', description: '', category: '' });
    setActiveView('list');
  };

  const handleCreateTournament = () => {
    const newTournament = {
      id: Date.now(),
      ...tournamentForm,
      participants: 0,
      status: 'upcoming',
      participantsList: [],
      announcements: [],
      results: []
    };
    
    // Add to home feed and tournament section
    console.log('Creating tournament for all sections:', newTournament);
    
    setTournamentForm({
      title: '',
      game: '',
      type: '',
      entryFee: '',
      prizePool: '',
      maxParticipants: '',
      deadline: ''
    });
    setShowCreateTournament(false);
  };

  const handleEditTournament = (tournament: any) => {
    setSelectedTournament(tournament);
    setActiveView('edit-tournament');
  };

  const handlePostAnnouncement = () => {
    if (announcement.trim()) {
      console.log('Posting announcement:', announcement);
      setAnnouncement('');
    }
  };

  const handlePostResult = () => {
    if (resultText.trim()) {
      console.log('Posting result:', { text: resultText, image: resultImage });
      setResultText('');
      setResultImage(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResultImage(e.target.files[0]);
    }
  };

  if (activeView === 'create') {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveView('list')}
            className="border-gray-600 text-gray-400 hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-white">Create New Community</h1>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Community Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Community Name</Label>
              <Input
                value={newCommunity.name}
                onChange={(e) => setNewCommunity(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter community name"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Description</Label>
              <Textarea
                value={newCommunity.description}
                onChange={(e) => setNewCommunity(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your community..."
                className="bg-gray-700 border-gray-600 text-white"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Category</Label>
              <Select value={newCommunity.category} onValueChange={(value) => 
                setNewCommunity(prev => ({ ...prev, category: value }))
              }>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="valorant" className="text-white">VALORANT</SelectItem>
                  <SelectItem value="freefire" className="text-white">Free Fire</SelectItem>
                  <SelectItem value="pubg" className="text-white">PUBG Mobile</SelectItem>
                  <SelectItem value="cod" className="text-white">Call of Duty</SelectItem>
                  <SelectItem value="general" className="text-white">General Gaming</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setActiveView('list')}
                className="flex-1 border-gray-600 text-gray-400 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateCommunity}
                disabled={!newCommunity.name || !newCommunity.description}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Create Community
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeView === 'manage' && selectedCommunity) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveView('list')}
              className="border-gray-600 text-gray-400 hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-white">{selectedCommunity.name}</h1>
          </div>
          <Button
            onClick={() => setShowCreateTournament(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Tournament
          </Button>
        </div>

        {/* Create Tournament Modal */}
        {showCreateTournament && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="bg-gray-800 border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                  Create Tournament
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Tournament Title</Label>
                  <Input
                    value={tournamentForm.title}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter tournament name"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Game</Label>
                  <Select value={tournamentForm.game} onValueChange={(value) => 
                    setTournamentForm(prev => ({ ...prev, game: value }))
                  }>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select game" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="valorant" className="text-white">VALORANT</SelectItem>
                      <SelectItem value="freefire" className="text-white">Free Fire</SelectItem>
                      <SelectItem value="pubg" className="text-white">PUBG Mobile</SelectItem>
                      <SelectItem value="cod" className="text-white">Call of Duty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Type</Label>
                    <Select value={tournamentForm.type} onValueChange={(value) => 
                      setTournamentForm(prev => ({ ...prev, type: value }))
                    }>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="solo" className="text-white">Solo</SelectItem>
                        <SelectItem value="squad" className="text-white">Squad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Entry Fee (₹)</Label>
                    <Input
                      type="number"
                      value={tournamentForm.entryFee}
                      onChange={(e) => setTournamentForm(prev => ({ ...prev, entryFee: e.target.value }))}
                      placeholder="0"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Prize Pool (₹)</Label>
                    <Input
                      type="number"
                      value={tournamentForm.prizePool}
                      onChange={(e) => setTournamentForm(prev => ({ ...prev, prizePool: e.target.value }))}
                      placeholder="0"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Max Participants</Label>
                    <Input
                      type="number"
                      value={tournamentForm.maxParticipants}
                      onChange={(e) => setTournamentForm(prev => ({ ...prev, maxParticipants: e.target.value }))}
                      placeholder="64"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Registration Deadline</Label>
                  <Input
                    type="datetime-local"
                    value={tournamentForm.deadline}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, deadline: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateTournament(false)}
                    className="flex-1 border-gray-600 text-gray-400 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateTournament}
                    disabled={!tournamentForm.title || !tournamentForm.game}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Create Tournament
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-blue-600">Overview</TabsTrigger>
            <TabsTrigger value="tournaments" className="text-white data-[state=active]:bg-blue-600">Tournaments</TabsTrigger>
            <TabsTrigger value="members" className="text-white data-[state=active]:bg-blue-600">Members</TabsTrigger>
            <TabsTrigger value="messages" className="text-white data-[state=active]:bg-blue-600">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-400">Members</span>
                  </div>
                  <p className="text-2xl font-bold text-white mt-2">{selectedCommunity.members.toLocaleString()}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-400">Tournaments</span>
                  </div>
                  <p className="text-2xl font-bold text-white mt-2">{selectedCommunity.tournaments}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-green-400" />
                    <span className="text-gray-400">Created</span>
                  </div>
                  <p className="text-xl font-bold text-white mt-2">{selectedCommunity.created}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tournaments" className="space-y-4">
            <div className="space-y-3">
              {communityTournaments.map((tournament) => (
                <Card key={tournament.id} className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-white">{tournament.title}</h3>
                        <p className="text-gray-400 text-sm">{tournament.game}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={tournament.status === 'active' ? 'bg-green-600' : 'bg-yellow-600'}>
                          {tournament.status}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-gray-600 text-gray-400 hover:bg-gray-700"
                          onClick={() => handleEditTournament(tournament)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between text-sm text-gray-400">
                      <span>{tournament.participants}/{tournament.maxParticipants} participants</span>
                      <span>₹{tournament.prizePool.toLocaleString()} prize pool</span>
                    </div>
                    <p className="text-blue-400 text-xs mt-1">Click edit button to manage participants, announcements & results →</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Member Management</h3>
              <p className="text-gray-400">View and manage community members</p>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <div className="text-center py-8">
              <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Community Messages</h3>
              <p className="text-gray-400">Send announcements to community members</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Tournament Edit View
  if (activeView === 'edit-tournament' && selectedTournament) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveView('manage')}
            className="border-gray-600 text-gray-400 hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Community
          </Button>
          <h1 className="text-2xl font-bold text-white">{selectedTournament.title}</h1>
        </div>

        <div className="flex space-x-4 mb-6">
          <Button
            variant={editTab === 'participants' ? 'default' : 'outline'}
            onClick={() => setEditTab('participants')}
            className="flex items-center"
          >
            <Users className="w-4 h-4 mr-2" />
            Participants
          </Button>
          <Button
            variant={editTab === 'announcements' ? 'default' : 'outline'}
            onClick={() => setEditTab('announcements')}
            className="flex items-center"
          >
            <Megaphone className="w-4 h-4 mr-2" />
            Announcements
          </Button>
          <Button
            variant={editTab === 'results' ? 'default' : 'outline'}
            onClick={() => setEditTab('results')}
            className="flex items-center"
          >
            <Award className="w-4 h-4 mr-2" />
            Results
          </Button>
        </div>

        {editTab === 'participants' && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Tournament Participants ({selectedTournament.participants})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedTournament.participantsList.map((participant: any, index: number) => (
                <div key={participant.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {participant.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-white">{participant.name}</h3>
                      <p className="text-gray-400">{participant.team}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">Position:</span>
                    <Input
                      type="number"
                      placeholder="0"
                      className="w-20 bg-gray-600 border-gray-500 text-white"
                      defaultValue={participant.position || ''}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {editTab === 'announcements' && (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Megaphone className="w-5 h-5 mr-2" />
                  Post Announcement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Share room ID, password, match timings, or important updates..."
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={4}
                />
                <Button 
                  onClick={handlePostAnnouncement}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Post Announcement
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Previous Announcements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedTournament.announcements.map((ann: any) => (
                  <div key={ann.id} className="p-3 bg-gray-700 rounded-lg">
                    <p className="text-white">{ann.text}</p>
                    <p className="text-gray-400 text-sm mt-1">{ann.timestamp}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {editTab === 'results' && (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Post Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter match result, winner, positions (1st, 2nd, 3rd)..."
                  value={resultText}
                  onChange={(e) => setResultText(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={3}
                />
                
                <div className="space-y-2">
                  <Label className="text-white">Upload Result Image (Optional)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Button variant="outline" className="border-gray-600 text-gray-400">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  {resultImage && (
                    <p className="text-green-400 text-sm">Image selected: {resultImage.name}</p>
                  )}
                </div>

                <Button 
                  onClick={handlePostResult}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Post Result
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Tournament Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedTournament.results.map((result: any) => (
                  <div key={result.id} className="p-3 bg-gray-700 rounded-lg">
                    <p className="text-white font-semibold">{result.text}</p>
                    {result.image && (
                      <div className="mt-2">
                        <img src={result.image} alt="Result" className="rounded-lg max-w-sm" />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <Users className="w-7 h-7 mr-2 text-blue-400" />
          My Communities
        </h1>
        <Button
          onClick={() => setActiveView('create')}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Community
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myCommunities.map((community) => (
          <Card key={community.id} className="bg-gray-800 border-gray-700 overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => {
                  setSelectedCommunity(community);
                  setActiveView('manage');
                }}>
            <div className="relative h-32">
              <img 
                src={community.cover} 
                alt={community.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-2 left-2">
                <h3 className="font-bold text-white text-lg">{community.name}</h3>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-gray-400 text-sm mb-3">{community.description}</p>
              <div className="flex justify-between text-sm">
                <div className="flex items-center text-blue-400">
                  <Users className="w-4 h-4 mr-1" />
                  {community.members.toLocaleString()} members
                </div>
                <div className="flex items-center text-yellow-400">
                  <Trophy className="w-4 h-4 mr-1" />
                  {community.tournaments} tournaments
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityDashboard;