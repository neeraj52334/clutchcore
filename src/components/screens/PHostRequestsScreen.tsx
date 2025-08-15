
import { useState } from 'react';
import { Shield, CheckCircle, XCircle, Eye, MessageSquare, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback } from '../ui/avatar';

const PHostRequestsScreen = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const pendingRequests = [
    {
      id: 1,
      challengeId: 'CH_VL_001',
      game: 'VALORANT',
      entryFee: 200,
      requester: 'SkillzMaster',
      opponent: 'ProGamer99',
      requestTime: '2 hours ago',
      status: 'pending'
    },
    {
      id: 2,
      challengeId: 'CH_FF_045',
      game: 'Free Fire',
      entryFee: 150,
      requester: 'FireKing',
      opponent: 'GameMaster',
      requestTime: '5 hours ago',
      status: 'pending'
    }
  ];

  const acceptedRequests = [
    {
      id: 3,
      challengeId: 'CH_PG_234',
      game: 'PUBG Mobile',
      entryFee: 300,
      playerA: 'WarriorX',
      playerB: 'TacticalGamer',
      acceptedTime: '1 day ago',
      status: 'active',
      evidenceA: true,
      evidenceB: false
    }
  ];

  const completedRequests = [
    {
      id: 4,
      challengeId: 'CH_VL_089',
      game: 'VALORANT',
      entryFee: 250,
      playerA: 'SkillzMaster',
      playerB: 'ProPlayer123',
      winner: 'SkillzMaster',
      completedTime: '3 days ago',
      status: 'completed'
    },
    {
      id: 5,
      challengeId: 'CH_FF_156',
      game: 'Free Fire',
      entryFee: 100,
      playerA: 'FireMaster',
      playerB: 'QuickShot',
      winner: 'QuickShot',
      completedTime: '1 week ago',
      status: 'completed'
    }
  ];

  const handleAcceptRequest = (requestId: number) => {
    console.log('Accepted request:', requestId);
    // Move to accepted requests
  };

  const handleDeclineRequest = (requestId: number) => {
    console.log('Declined request:', requestId);
    // Remove from pending
  };

  const handleDeclareWinner = (challengeId: string, winner: string) => {
    console.log('Declared winner:', winner, 'for challenge:', challengeId);
    // Move to completed
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <Shield className="w-7 h-7 mr-2 text-green-400" />
          P-Host Challenges
        </h1>
        <Badge className="bg-blue-600 text-white">
          {pendingRequests.length} Pending
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="pending" className="text-white data-[state=active]:bg-blue-600">
            Challenges ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="accepted" className="text-white data-[state=active]:bg-blue-600">
            Active ({acceptedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="text-white data-[state=active]:bg-blue-600">
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Pending Requests</h3>
              <p className="text-gray-400">All challenges are currently handled</p>
            </div>
          ) : (
            pendingRequests.map((request) => (
              <Card key={request.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        {request.game}
                      </Badge>
                      <Badge className="bg-yellow-600">
                        ₹{request.entryFee}+ Entry
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-400">{request.requestTime}</span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Challenge ID:</span>
                      <span className="text-white font-mono">{request.challengeId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Requested by:</span>
                      <span className="text-white">{request.requester}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Opponent:</span>
                      <span className="text-white">{request.opponent}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleAcceptRequest(request.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 flex items-center justify-center space-x-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Accept</span>
                    </Button>
                    <Button 
                      onClick={() => handleDeclineRequest(request.id)}
                      variant="outline"
                      className="flex-1 border-red-600 text-red-400 hover:bg-red-900/20 flex items-center justify-center space-x-1"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Decline</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {acceptedRequests.map((request) => (
            <Card key={request.id} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-green-400" />
                    Overseeing Challenge
                  </span>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {request.game}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Challenge ID:</p>
                    <p className="text-white font-mono">{request.challengeId}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Entry Fee:</p>
                    <p className="text-green-400 font-medium">₹{request.entryFee}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Player A:</p>
                    <p className="text-white">{request.playerA}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Player B:</p>
                    <p className="text-white">{request.playerB}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-white font-medium">Evidence Review</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm">{request.playerA}</span>
                        {request.evidenceA ? (
                          <Badge className="bg-green-600">Submitted</Badge>
                        ) : (
                          <Badge className="bg-red-600">Pending</Badge>
                        )}
                      </div>
                      {request.evidenceA && (
                        <Button size="sm" variant="outline" className="w-full border-gray-600 text-gray-400">
                          View Screenshot
                        </Button>
                      )}
                    </div>
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm">{request.playerB}</span>
                        {request.evidenceB ? (
                          <Badge className="bg-green-600">Submitted</Badge>
                        ) : (
                          <Badge className="bg-red-600">Pending</Badge>
                        )}
                      </div>
                      {request.evidenceB && (
                        <Button size="sm" variant="outline" className="w-full border-gray-600 text-gray-400">
                          View Screenshot
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 flex items-center justify-center space-x-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>Match Chat</span>
                  </Button>
                  {request.evidenceA && request.evidenceB && (
                    <Button 
                      className="flex-1 bg-orange-600 hover:bg-orange-700 flex items-center justify-center space-x-1"
                      onClick={() => {
                        // Show winner selection modal
                        const winner = prompt(`Who won the match?\n1. ${request.playerA}\n2. ${request.playerB}\n\nEnter 1 or 2:`);
                        if (winner === '1') {
                          handleDeclareWinner(request.challengeId, request.playerA);
                        } else if (winner === '2') {
                          handleDeclareWinner(request.challengeId, request.playerB);
                        }
                      }}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Declare Winner</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {completedRequests.map((request) => (
            <Card key={request.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      {request.game}
                    </Badge>
                    <Badge className="bg-green-600">
                      Completed
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-400">{request.completedTime}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Challenge ID:</span>
                    <span className="text-white font-mono">{request.challengeId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Players:</span>
                    <span className="text-white">{request.playerA} vs {request.playerB}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Winner:</span>
                    <span className="text-green-400 font-medium">{request.winner}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Prize:</span>
                    <span className="text-yellow-400">₹{request.entryFee * 2}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PHostRequestsScreen;
