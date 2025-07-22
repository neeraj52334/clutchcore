import { useState } from 'react';
import { Search, TrendingUp, Users, Trophy, Gamepad2, Hash, MessageCircle, UserPlus, UserCheck } from 'lucide-react';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';

interface SearchScreenProps {
  onUserClick?: (user: any) => void;
}

const SearchScreen = ({ onUserClick }: SearchScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  const handleFollow = (username: string) => {
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(username)) {
        newSet.delete(username);
      } else {
        newSet.add(username);
      }
      return newSet;
    });
  };

  const handleMessage = (username: string) => {
    alert(`Opening chat with ${username}...`);
    // In real app, this would navigate to chat screen
  };

  const trendingChallenges = [
    {
      id: 1,
      creator: "SkillzMaster",
      game: "VALORANT",
      type: "1v1",
      entryFee: 200,
      challengeId: "CH_VL_001"
    },
    {
      id: 2,
      creator: "ProGamer99",
      game: "Free Fire",
      type: "4v4",
      entryFee: 100,
      challengeId: "CH_FF_045"
    }
  ];

  const sampleUsers = [
    {
      username: "SkillzMaster",
      displayName: "Skillz Master",
      avatar: "/placeholder.svg",
      followers: "2.5K",
      following: "156",
      games: ["VALORANT", "CS:GO"],
      bio: "Pro gamer | VALORANT Immortal | Looking for scrims",
      isOnline: true
    },
    {
      username: "FireQueen",
      displayName: "Fire Queen",
      avatar: "/placeholder.svg",
      followers: "1.8K",
      following: "89",
      games: ["Free Fire", "PUBG Mobile"],
      bio: "Free Fire Champion | Content Creator 🔥",
      isOnline: false
    },
    {
      username: "ESportsKing",
      displayName: "ESports King",
      avatar: "/placeholder.svg",
      followers: "5.2K",
      following: "234",
      games: ["PUBG Mobile", "COD Mobile"],
      bio: "Tournament Organizer | DM for collabs",
      isOnline: true
    },
    {
      username: "GamerGirl",
      displayName: "Gamer Girl",
      avatar: "/placeholder.svg",
      followers: "890",
      following: "67",
      games: ["VALORANT", "Apex Legends"],
      bio: "Casual gamer | Always up for duos",
      isOnline: true
    }
  ];

  const popularTournaments = [
    {
      id: 1,
      title: "VALORANT Championship",
      organizer: "ESL India",
      participants: 64,
      prizePool: 50000
    },
    {
      id: 2,
      title: "Free Fire Masters",
      organizer: "GameOn Esports",
      participants: 89,
      prizePool: 25000
    }
  ];

  const featuredGames = [
    { name: "VALORANT", players: "2.5K", icon: "🎯" },
    { name: "Free Fire", players: "5.2K", icon: "🔥" },
    { name: "PUBG Mobile", players: "3.8K", icon: "🎮" },
    { name: "Call of Duty", players: "1.9K", icon: "⚔️" }
  ];

  const topCommunities = [
    {
      name: "ESL India",
      members: "12.5K",
      tournaments: 45,
      avatar: "/placeholder.svg"
    },
    {
      name: "GameOn Esports",
      members: "8.2K",
      tournaments: 32,
      avatar: "/placeholder.svg"
    },
    {
      name: "Pro Gaming India",
      members: "15.8K",
      tournaments: 67,
      avatar: "/placeholder.svg"
    }
  ];

  const filterOptions = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'challenges', label: 'Challenges', icon: Gamepad2 },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'communities', label: 'Communities', icon: Hash }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Search Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search users, tournaments, challenges, IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />
        </div>
        
        {/* Filter Pills */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {filterOptions.map((filter) => {
            const Icon = filter.icon;
            return (
              <Button
                key={filter.id}
                variant={searchFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchFilter(filter.id)}
                className={`flex items-center space-x-1 flex-shrink-0 ${
                  searchFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{filter.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Search Results or Default Content */}
      {searchQuery ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">
            Search Results for "{searchQuery}"
          </h2>
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No results found</p>
            <p className="text-sm text-gray-500 mt-2">
              Try searching for usernames, tournament names, or challenge IDs
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Users Section */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-400" />
              Discover Gamers
            </h2>
            <div className="space-y-3">
              {sampleUsers.map((user) => (
                <Card key={user.username} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div 
                        className="flex items-center space-x-3 flex-1 cursor-pointer"
                        onClick={() => onUserClick?.(user)}
                      >
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-purple-600 text-white">
                              {user.displayName[0]}
                            </AvatarFallback>
                          </Avatar>
                          {user.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-white">{user.displayName}</h3>
                          <p className="text-sm text-gray-400">@{user.username}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span>{user.followers} followers</span>
                            <span>{user.following} following</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-3">{user.bio}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {user.games.map((game, index) => (
                        <Badge key={index} variant="outline" className="text-blue-400 border-blue-400 text-xs">
                          {game}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleFollow(user.username)}
                        variant={followedUsers.has(user.username) ? "outline" : "default"}
                        size="sm"
                        className={`flex items-center space-x-1 flex-1 ${
                          followedUsers.has(user.username)
                            ? 'border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white'
                            : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                      >
                        {followedUsers.has(user.username) ? (
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
                        onClick={() => handleMessage(user.username)}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1 flex-1 border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Message</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Trending Challenges */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
              Trending Challenges
            </h2>
            <div className="space-y-3">
              {trendingChallenges.map((challenge) => (
                <Card key={challenge.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-blue-600 text-white">
                            {challenge.creator[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{challenge.creator}</p>
                          <p className="text-sm text-gray-400">ID: {challenge.challengeId}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        {challenge.game}
                      </Badge>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-gray-400">{challenge.type}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400 font-medium">₹{challenge.entryFee}</span>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Join
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Popular Tournaments */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
              Popular Tournaments
            </h2>
            <div className="space-y-3">
              {popularTournaments.map((tournament) => (
                <Card key={tournament.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-white">{tournament.title}</h3>
                        <p className="text-gray-400 text-sm">by {tournament.organizer}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold">₹{tournament.prizePool.toLocaleString()}</p>
                        <p className="text-gray-400 text-sm">{tournament.participants} players</p>
                      </div>
                    </div>
                    <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Featured Games */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Gamepad2 className="w-5 h-5 mr-2 text-green-400" />
              Featured Games
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {featuredGames.map((game) => (
                <Card key={game.name} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{game.icon}</div>
                    <h3 className="font-medium text-white">{game.name}</h3>
                    <p className="text-sm text-gray-400">{game.players} active players</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Top Communities */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Hash className="w-5 h-5 mr-2 text-purple-400" />
              Top Communities
            </h2>
            <div className="space-y-3">
              {topCommunities.map((community) => (
                <Card key={community.name} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={community.avatar} />
                          <AvatarFallback className="bg-purple-600 text-white">
                            {community.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-white">{community.name}</h3>
                          <p className="text-sm text-gray-400">{community.members} members</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-400 font-medium">{community.tournaments}</p>
                        <p className="text-xs text-gray-400">tournaments</p>
                      </div>
                    </div>
                    <Button className="w-full mt-3 bg-purple-600 hover:bg-purple-700">
                      Follow
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchScreen;
