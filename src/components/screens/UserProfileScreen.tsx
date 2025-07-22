
import { useState } from 'react';
import { ArrowLeft, MessageCircle, UserPlus, UserCheck, Users, Trophy, Star } from 'lucide-react';
import { useChallenges } from '../../contexts/ChallengeContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface UserProfileScreenProps {
  user: {
    username: string;
    displayName: string;
    avatar: string;
    followers: string;
    following: string;
    games: string[];
    bio: string;
    isOnline: boolean;
  };
  isFollowing: boolean;
  onBack: () => void;
  onFollow: (username: string) => void;
  onMessage: (username: string) => void;
  onFollowersClick: () => void;
  onFollowingClick: () => void;
}

const UserProfileScreen = ({ 
  user, 
  isFollowing, 
  onBack, 
  onFollow, 
  onMessage, 
  onFollowersClick, 
  onFollowingClick 
}: UserProfileScreenProps) => {
  const { getUserChallenges } = useChallenges();
  
  // Get user's challenges from context
  const userChallenges = getUserChallenges(user.username);
  
  // Mock recent challenges for display (you can replace this with actual challenge history)
  const mockUserChallenges = [
    {
      id: 1,
      game: "VALORANT",
      type: "1v1",
      result: "Won",
      prize: 400,
      date: "2 days ago",
      entryPrices: [{ price: 200, selected: false }]
    },
    {
      id: 2,
      game: "Free Fire",
      type: "Squad",
      result: "Won",
      prize: 150,
      date: "1 week ago",
      entryPrices: [{ price: 100, selected: false }]
    },
    {
      id: 3,
      game: "BGMI",
      type: "Solo",
      result: "Pending",
      prize: 0,
      date: "3 hours ago",
      entryPrices: [{ price: 50, selected: false }, { price: 100, selected: false }]
    }
  ];

  const stats = {
    totalChallenges: 12,
    wins: 9,
    losses: 3,
    winRate: 75,
    totalEarnings: 1850
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">{user.displayName}</h1>
              <p className="text-sm text-gray-400">@{user.username}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-blue-600 text-white text-xl">
                    {user.displayName[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {user.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-gray-800 rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">{user.displayName}</h1>
                <p className="text-gray-400">@{user.username}</p>
                
                <div className="flex items-center space-x-6 mt-2">
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
                </div>
              </div>
            </div>

            <p className="text-gray-300 mb-4">{user.bio}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {user.games.map((game, index) => (
                <Badge key={index} variant="outline" className="text-blue-400 border-blue-400">
                  {game}
                </Badge>
              ))}
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={() => onFollow(user.username)}
                variant={isFollowing ? "outline" : "default"}
                className={`flex items-center space-x-1 flex-1 ${
                  isFollowing
                    ? 'border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Follow</span>
                  </>
                )}
              </Button>
              <Button 
                onClick={() => onMessage(user.username)}
                variant="outline"
                className="flex items-center space-x-1 flex-1 border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message</span>
              </Button>
            </div>
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

        {/* Recent Challenges */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Challenges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Show actual user challenges */}
            {userChallenges.map((challenge) => (
              <div key={challenge.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {challenge.game}
                  </Badge>
                  <div>
                    <p className="text-white font-medium">{challenge.type}</p>
                    <p className="text-sm text-gray-400">{challenge.createdAt}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={challenge.status === 'active' ? 'default' : 'secondary'}
                    className={challenge.status === 'active' ? 'bg-green-600' : 'bg-yellow-600'}
                  >
                    {challenge.status || 'Pending'}
                  </Badge>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {challenge.entryPrices.map((entry, idx) => (
                      <span key={idx} className="text-green-400 text-xs font-medium">
                        ₹{entry.price}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Show mock challenges if no actual challenges */}
            {userChallenges.length === 0 && mockUserChallenges.map((challenge) => (
              <div key={challenge.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {challenge.game}
                  </Badge>
                  <div>
                    <p className="text-white font-medium">{challenge.type}</p>
                    <p className="text-sm text-gray-400">{challenge.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={challenge.result === 'Won' ? 'default' : 'secondary'}
                    className={challenge.result === 'Won' ? 'bg-green-600' : 'bg-red-600'}
                  >
                    {challenge.result}
                  </Badge>
                  {challenge.prize > 0 && (
                    <p className="text-green-400 text-sm font-medium mt-1">+₹{challenge.prize}</p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfileScreen;
