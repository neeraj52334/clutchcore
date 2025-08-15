import { useState } from 'react';
import { Edit, Share, Trophy, Users, Star, Settings, LogOut, Plus, Building, Calendar, Building2, MessageSquare, Target, GamepadIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useChallenges } from '../../contexts/ChallengeContext';
import { useTournaments } from '../../contexts/TournamentContext';
import { useTeams } from '../../contexts/TeamContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import CommunityDashboard from './CommunityDashboard';

interface ProfileScreenProps {
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
  setActiveView?: (view: string) => void;
}

const ProfileScreen = ({ onFollowersClick, onFollowingClick, setActiveView }: ProfileScreenProps) => {
  const { user, logout, updateUser } = useAuth();
  const { challenges, getUserChallenges, getUserJoinedChallenges } = useChallenges();
  const { tournaments, getUserTournaments } = useTournaments();
  const { getUserTeams } = useTeams();
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [showCreateTournament, setShowCreateTournament] = useState(false);
  const [showCommunityDashboard, setShowCommunityDashboard] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    gameIds: user?.gameIds || {}
  });

  // Mock community data - in real app this would come from database
  const userCommunity = user?.role === 'community_admin' ? {
    id: 1,
    name: "Elite Gaming Hub",
    members: 1250,
    tournaments: 15,
    createdAt: "2 months ago"
  } : null;

  // Get user's challenges, tournaments, and teams
  const userChallenges = user ? getUserChallenges(user.username) : [];
  const userJoinedChallenges = user ? getUserJoinedChallenges(user.username) : [];
  const allUserChallenges = [...userChallenges, ...userJoinedChallenges];
  const userTournaments = user ? getUserTournaments(user.username) : [];
  const userTeams = user ? getUserTeams(user.username) : [];

  // Mock posts data - in real app this would come from database
  const userPosts = [
    {
      id: 1,
      content: "Just hit Immortal in VALORANT! Ready for some serious 1v1s 💀",
      timestamp: "2 hours ago",
      likes: 12,
      comments: 3
    },
    {
      id: 2,
      content: "Looking for Free Fire squad members for upcoming tournament. DM me!",
      timestamp: "1 day ago",
      likes: 8,
      comments: 5
    }
  ];

  const stats = {
    totalChallenges: allUserChallenges.length,
    wins: 8,
    losses: 7,
    winRate: 53,
    totalEarnings: 2850
  };

  // Categorize tournaments by status
  const upcomingTournaments = userTournaments.filter(t => t.status === 'open');
  const ongoingTournaments = userTournaments.filter(t => t.status === 'live');
  const completedTournaments = userTournaments.filter(t => t.status === 'completed');

  const handleSaveProfile = () => {
    if (user) {
      updateUser({
        username: editForm.username,
        gameIds: editForm.gameIds
      });
    }
    setIsEditing(false);
  };

  const addGameId = (game: string, id: string) => {
    setEditForm(prev => ({
      ...prev,
      gameIds: { ...prev.gameIds, [game]: id }
    }));
  };

  const handleCreateCommunity = () => {
    // In real app, this would create a community in the database
    setShowCreateCommunity(false);
    // Show success message
  };

  const handleCreateTournament = () => {
    // In real app, this would create a tournament in the database
    setShowCreateTournament(false);
    // Show success message
  };

  if (!user) return null;

  if (showCommunityDashboard) {
    return <CommunityDashboard />;
  }

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-blue-600 text-white text-xl">
                {user.username[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={editForm.username}
                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-white">{user.username}</h1>
                  <p className="text-gray-400">{user.email}</p>
                </>
              )}
              
              <div className="flex items-center space-x-4 mt-2">
                <button 
                  onClick={onFollowersClick}
                  className="text-center hover:bg-gray-700 p-2 rounded transition-colors"
                >
                  <p className="text-white font-medium">{user.followers}</p>
                  <p className="text-xs text-gray-400">Followers</p>
                </button>
                <button 
                  onClick={onFollowingClick}
                  className="text-center hover:bg-gray-700 p-2 rounded transition-colors"
                >
                  <p className="text-white font-medium">{user.following}</p>
                  <p className="text-xs text-gray-400">Following</p>
                </button>
                <Badge className="bg-blue-600 text-white">
                  {user.role === 'gamer' ? 'Gamer' : 
                   user.role === 'community_admin' ? 'Community Admin' : 'P-Host'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700">
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="border-gray-600 text-gray-400"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-400">
                  <Share className="w-4 h-4" />
                </Button>
                </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Game IDs Section */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
            My Game IDs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(user.gameIds).length === 0 ? (
            <p className="text-gray-400 text-center py-4">No game IDs linked</p>
          ) : (
            Object.entries(user.gameIds).map(([game, id]) => (
              <div key={game} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="text-white font-medium capitalize">{game}</p>
                  <p className="text-gray-400 text-sm">{id}</p>
                </div>
                {isEditing && (
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-400">
                    Edit
                  </Button>
                )}
              </div>
            ))
          )}
          
          {isEditing && (
            <div className="p-3 bg-gray-700 rounded-lg">
              <div className="flex space-x-2">
                <Input
                  placeholder="Game (e.g., valorant)"
                  className="bg-gray-600 border-gray-500 text-white"
                />
                <Input
                  placeholder="Player ID"
                  className="bg-gray-600 border-gray-500 text-white"
                />
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Star className="w-5 h-5 mr-2 text-purple-400" />
            Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-white">{stats.totalChallenges}</p>
              <p className="text-sm text-gray-400">Total Challenges</p>
            </div>
            <div className="text-center p-3 bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-green-400">{stats.winRate}%</p>
              <p className="text-sm text-gray-400">Win Rate</p>
            </div>
            <div className="text-center p-3 bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-blue-400">{stats.wins}</p>
              <p className="text-sm text-gray-400">Wins</p>
            </div>
            <div className="text-center p-3 bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-yellow-400">₹{stats.totalEarnings}</p>
              <p className="text-sm text-gray-400">Total Earnings</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player Activity Tabs */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Player Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-700">
              <TabsTrigger value="posts" className="data-[state=active]:bg-blue-600">
                <MessageSquare className="w-4 h-4 mr-1" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="arena" className="data-[state=active]:bg-blue-600">
                <Trophy className="w-4 h-4 mr-1" />
                My Arena
              </TabsTrigger>
              <TabsTrigger value="teams" className="data-[state=active]:bg-blue-600">
                <Users className="w-4 h-4 mr-1" />
                Teams
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-4 space-y-3">
              {userPosts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No posts yet</p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                </div>
              ) : (
                userPosts.map((post) => (
                  <div key={post.id} className="p-4 bg-gray-700 rounded-lg">
                    <p className="text-white mb-2">{post.content}</p>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{post.timestamp}</span>
                      <div className="flex items-center space-x-4">
                        <span>❤️ {post.likes}</span>
                        <span>💬 {post.comments}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="arena" className="mt-4 space-y-4">
              {/* Created Challenges */}
              <div>
                <h4 className="text-white font-medium mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-orange-400" />
                  Created Challenges ({userChallenges.length})
                </h4>
                <div className="space-y-2">
                  {userChallenges.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No challenges created yet</p>
                  ) : (
                    userChallenges.map((challenge) => (
                      <div key={challenge.id} className="p-3 bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">{challenge.game} {challenge.type}</p>
                            <p className="text-sm text-gray-400">ID: {challenge.challengeId}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={challenge.status === 'open' ? 'bg-yellow-600' : 'bg-green-600'}>
                              {challenge.status}
                            </Badge>
                            <span className="text-green-400 font-medium text-sm">₹{challenge.entryPrices[0]?.price || 0}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Accepted Challenges */}
              <div>
                <h4 className="text-white font-medium mb-2 flex items-center">
                  <GamepadIcon className="w-4 h-4 mr-2 text-green-400" />
                  Accepted Challenges ({userJoinedChallenges.length})
                </h4>
                <div className="space-y-2">
                  {userJoinedChallenges.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No challenges accepted yet</p>
                  ) : (
                    userJoinedChallenges.map((challenge) => (
                      <div key={challenge.id} className="p-3 bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">{challenge.game} {challenge.type}</p>
                            <p className="text-sm text-gray-400">vs {challenge.creator}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-blue-600">Joined</Badge>
                            <span className="text-green-400 font-medium text-sm">₹{challenge.entryPrices[0]?.price || 0}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Registered Tournaments */}
              <div>
                <h4 className="text-white font-medium mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                  Registered Tournaments ({userTournaments.length})
                </h4>
                <div className="space-y-2">
                  {userTournaments.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No tournaments registered</p>
                  ) : (
                    userTournaments.map((tournament) => (
                      <div key={tournament.id} className="p-3 bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">{tournament.name}</p>
                            <p className="text-sm text-gray-400">{tournament.game} • {tournament.totalSlots} slots</p>
                          </div>
                          <Badge className={
                            tournament.status === 'open' ? 'bg-blue-600' :
                            tournament.status === 'live' ? 'bg-green-600' : 'bg-gray-600'
                          }>
                            {tournament.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="teams" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">My Teams</h3>
                <Button
                  onClick={() => setActiveView?.('teams')}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Create Team
                </Button>
              </div>
              
              {userTeams.length === 0 ? (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Users className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-white mb-2">No Teams Yet</h3>
                      <p className="text-gray-400 mb-4">You haven't joined any teams. Create or join one to get started!</p>
                      <Button
                        onClick={() => setActiveView?.('teams')}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Browse Teams
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {userTeams.map((team) => (
                    <Card key={team.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="bg-purple-600 p-2 rounded-lg">
                              <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="text-white font-medium">{team.name}</h4>
                              <p className="text-sm text-gray-400">{team.game} • {team.members.length} members</p>
                            </div>
                          </div>
                          <Badge className={team.leader === user?.username ? 'bg-yellow-600' : 'bg-blue-600'}>
                            {team.leader === user?.username ? 'Leader' : 'Member'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Community Management - Only for Community Admins */}
      {user.role === 'community_admin' && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-400" />
              Community Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {userCommunity ? (
              <>
                <div 
                  className="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                  onClick={() => setShowCommunityDashboard(true)}
                >
                  <h3 className="text-white font-bold text-lg">{userCommunity.name}</h3>
                  <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
                    <span>{userCommunity.members} members</span>
                    <span>{userCommunity.tournaments} tournaments</span>
                    <span>Created {userCommunity.createdAt}</span>
                  </div>
                  <p className="text-blue-400 text-sm mt-1">Click to manage →</p>
                </div>
                <div className="space-y-2">
                  <Button 
                    onClick={() => setShowCommunityDashboard(true)}
                    className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Manage Communities
                  </Button>
                  <Button 
                    onClick={() => setShowCreateTournament(true)}
                    className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Create Tournament
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Button 
                  onClick={() => setShowCommunityDashboard(true)}
                  className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Manage Communities
                </Button>
                <Button 
                  onClick={() => setShowCreateCommunity(true)}
                  variant="outline"
                  className="w-full border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white flex items-center justify-center"
                >
                  <Building className="w-4 h-4 mr-2" />
                  Create New Community
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Community Modal */}
      {showCreateCommunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Create Community</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-400">Community Name</Label>
                <Input className="bg-gray-700 border-gray-600 text-white" placeholder="Enter community name" />
              </div>
              <div>
                <Label className="text-gray-400">Description</Label>
                <Input className="bg-gray-700 border-gray-600 text-white" placeholder="Brief description" />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleCreateCommunity} className="flex-1 bg-green-600 hover:bg-green-700">
                  Create
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateCommunity(false)}
                  className="flex-1 border-gray-600 text-gray-400"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Tournament Modal */}
      {showCreateTournament && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Create Tournament</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-400">Tournament Name</Label>
                <Input className="bg-gray-700 border-gray-600 text-white" placeholder="Enter tournament name" />
              </div>
              <div>
                <Label className="text-gray-400">Game</Label>
                <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white">
                  <option value="">Select Game</option>
                  <option value="valorant">VALORANT</option>
                  <option value="freefire">Free Fire</option>
                  <option value="pubg">PUBG Mobile</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-gray-400">Entry Fee (₹)</Label>
                  <Input className="bg-gray-700 border-gray-600 text-white" type="number" placeholder="500" />
                </div>
                <div>
                  <Label className="text-gray-400">Prize Pool (₹)</Label>
                  <Input className="bg-gray-700 border-gray-600 text-white" type="number" placeholder="10000" />
                </div>
              </div>
              <div>
                <Label className="text-gray-400">Max Participants</Label>
                <Input className="bg-gray-700 border-gray-600 text-white" type="number" placeholder="64" />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleCreateTournament} className="flex-1 bg-green-600 hover:bg-green-700">
                  Create Tournament
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateTournament(false)}
                  className="flex-1 border-gray-600 text-gray-400"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4 space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start border-gray-600 text-gray-400 hover:bg-gray-700"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button 
            variant="outline" 
            onClick={logout}
            className="w-full justify-start border-red-600 text-red-400 hover:bg-red-900/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileScreen;
