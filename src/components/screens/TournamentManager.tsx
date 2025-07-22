import { useState } from 'react';
import { ArrowLeft, Users, Trophy, MessageCircle, Edit, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';

interface TournamentManagerProps {
  tournament: any;
  onBack: () => void;
}

export const TournamentManager = ({ tournament, onBack }: TournamentManagerProps) => {
  const [activeTab, setActiveTab] = useState('participants');
  const [matchDetails, setMatchDetails] = useState('');
  const [resultDetails, setResultDetails] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Player1', message: 'Good luck everyone!', timestamp: '10:30 AM' },
    { id: 2, user: 'Player2', message: 'Ready for the match', timestamp: '10:32 AM' },
  ]);

  const participants = [
    { id: 1, name: 'ProGamer123', team: 'Team Alpha', avatar: '', status: 'confirmed' },
    { id: 2, name: 'SniperKing', team: 'Team Beta', avatar: '', status: 'confirmed' },
    { id: 3, name: 'FastFingers', team: 'Team Gamma', avatar: '', status: 'pending' },
    { id: 4, name: 'HeadShot', team: 'Team Delta', avatar: '', status: 'confirmed' },
  ];

  const matches = [
    { id: 1, round: 'Quarter Finals', team1: 'Team Alpha', team2: 'Team Beta', status: 'completed', winner: 'Team Alpha' },
    { id: 2, round: 'Quarter Finals', team1: 'Team Gamma', team2: 'Team Delta', status: 'ongoing', winner: null },
    { id: 3, round: 'Semi Finals', team1: 'Team Alpha', team2: 'TBD', status: 'upcoming', winner: null },
  ];

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        user: 'Admin',
        message: chatMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage('');
    }
  };

  const handleUpdateMatch = () => {
    if (matchDetails.trim()) {
      alert('Match details updated successfully!');
      setMatchDetails('');
    }
  };

  const handleAddResult = () => {
    if (resultDetails.trim()) {
      alert('Match result added successfully!');
      setResultDetails('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{tournament.title}</h1>
            <p className="text-gray-400">{tournament.game} • {tournament.participants} participants</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === 'participants' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('participants')}
            className="flex items-center"
          >
            <Users className="w-4 h-4 mr-2" />
            Participants
          </Button>
          <Button
            variant={activeTab === 'matches' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('matches')}
            className="flex items-center"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Matches & Results
          </Button>
          <Button
            variant={activeTab === 'chat' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('chat')}
            className="flex items-center"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Tournament Chat
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'participants' && (
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Users className="w-5 h-5 mr-2" />
                Tournament Participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{participant.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-white">{participant.name}</h3>
                        <p className="text-gray-400">{participant.team}</p>
                      </div>
                    </div>
                    <Badge variant={participant.status === 'confirmed' ? 'default' : 'secondary'}>
                      {participant.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'matches' && (
          <div className="space-y-6">
            {/* Match Details Update */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Edit className="w-5 h-5 mr-2" />
                  Update Match Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter match details, server info, room codes, etc..."
                    value={matchDetails}
                    onChange={(e) => setMatchDetails(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  <Button onClick={handleUpdateMatch} className="bg-blue-600 hover:bg-blue-700">
                    Update Match Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Match Results */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Award className="w-5 h-5 mr-2" />
                  Add Match Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter match results, scores, winners, etc..."
                    value={resultDetails}
                    onChange={(e) => setResultDetails(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  <Button onClick={handleAddResult} className="bg-green-600 hover:bg-green-700">
                    Add Result
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Current Matches */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Match Schedule & Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {matches.map((match) => (
                    <div key={match.id} className="p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-white">{match.round}</h3>
                          <p className="text-gray-400">{match.team1} vs {match.team2}</p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={
                              match.status === 'completed' ? 'default' : 
                              match.status === 'ongoing' ? 'secondary' : 'outline'
                            }
                          >
                            {match.status}
                          </Badge>
                          {match.winner && (
                            <p className="text-green-400 mt-1">Winner: {match.winner}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'chat' && (
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <MessageCircle className="w-5 h-5 mr-2" />
                Tournament Chat (Participants Only)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-96 bg-gray-800 rounded-lg p-4 overflow-y-auto">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="mb-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-blue-400">{msg.user}</span>
                        <span className="text-xs text-gray-500">{msg.timestamp}</span>
                      </div>
                      <p className="text-gray-300">{msg.message}</p>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};