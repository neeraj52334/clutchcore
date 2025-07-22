
import { useState } from 'react';
import { ArrowLeft, UserPlus, UserCheck, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';

interface FollowListScreenProps {
  title: string;
  users: Array<{
    username: string;
    displayName: string;
    avatar: string;
    followers: string;
    following: string;
    games: string[];
    bio: string;
    isOnline: boolean;
  }>;
  followedUsers: Set<string>;
  onBack: () => void;
  onFollow: (username: string) => void;
  onMessage: (username: string) => void;
  onUserClick: (user: any) => void;
}

const FollowListScreen = ({ 
  title, 
  users, 
  followedUsers, 
  onBack, 
  onFollow, 
  onMessage, 
  onUserClick 
}: FollowListScreenProps) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">{title}</h1>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {users.map((user) => (
          <Card key={user.username} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="flex items-center space-x-3 flex-1 cursor-pointer"
                  onClick={() => onUserClick(user)}
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
                  onClick={() => onFollow(user.username)}
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
                  onClick={() => onMessage(user.username)}
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
  );
};

export default FollowListScreen;
