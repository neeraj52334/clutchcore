
import { useState } from 'react';
import { ArrowLeft, Search, Send, MoreVertical, Users, User, Plus } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';

interface MessagesScreenProps {
  onBack: () => void;
}

const MessagesScreen = ({ onBack }: MessagesScreenProps) => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  // Sample following users data
  const followingUsers = [
    {
      username: "SkillzMaster",
      displayName: "Skillz Master",
      avatar: "/placeholder.svg",
      isOnline: true
    },
    {
      username: "FireQueen",
      displayName: "Fire Queen",
      avatar: "/placeholder.svg",
      isOnline: false
    },
    {
      username: "ESportsKing",
      displayName: "ESports King",
      avatar: "/placeholder.svg",
      isOnline: true
    },
    {
      username: "GamerGirl",
      displayName: "Gamer Girl",
      avatar: "/placeholder.svg",
      isOnline: true
    }
  ];

  const chatList = [
    {
      id: '1',
      type: 'direct',
      name: 'SkillzMaster',
      lastMessage: 'GG! Ready for the rematch?',
      timestamp: '2m ago',
      unreadCount: 2,
      avatar: '/placeholder.svg',
      online: true
    },
    {
      id: '2',
      type: 'challenge',
      name: 'Challenge CH_VL_001',
      lastMessage: 'Share your room ID',
      timestamp: '15m ago',
      unreadCount: 1,
      participants: ['You', 'ProGamer99']
    },
    {
      id: '3',
      type: 'tournament',
      name: 'VALORANT Championship',
      lastMessage: 'Tournament starts in 1 hour',
      timestamp: '1h ago',
      unreadCount: 0,
      participants: ['64 players']
    },
    {
      id: '4',
      type: 'direct',
      name: 'ProGamer99',
      lastMessage: 'Thanks for the match!',
      timestamp: '3h ago',
      unreadCount: 0,
      avatar: '/placeholder.svg',
      online: false
    }
  ];

  const messages = [
    {
      id: '1',
      sender: 'SkillzMaster',
      message: 'Hey! Ready for our 1v1?',
      timestamp: '10:30 AM',
      isOwn: false
    },
    {
      id: '2',
      sender: 'You',
      message: 'Yeah! Let me know the room details',
      timestamp: '10:32 AM',
      isOwn: true
    },
    {
      id: '3',
      sender: 'SkillzMaster',
      message: 'Room ID: VALO-2024-001\nPassword: clutch123',
      timestamp: '10:33 AM',
      isOwn: false
    },
    {
      id: '4',
      sender: 'You',
      message: 'Joining now!',
      timestamp: '10:34 AM',
      isOwn: true
    },
    {
      id: '5',
      sender: 'SkillzMaster',
      message: 'GG! Ready for the rematch?',
      timestamp: '11:45 AM',
      isOwn: false
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleStartChat = (user: any) => {
    // Create new chat with user
    console.log('Starting chat with:', user.username);
    setShowNewChatModal(false);
    // In real app, this would create a new chat and navigate to it
  };

  const selectedChatData = chatList.find(chat => chat.id === selectedChat);

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={selectedChat ? () => setSelectedChat(null) : onBack}
              className="text-white hover:bg-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">
                {selectedChat ? selectedChatData?.name : 'Messages'}
              </h1>
              {selectedChat && selectedChatData?.type === 'direct' && (
                <p className="text-sm text-gray-400">
                  {selectedChatData.online ? 'Online' : 'Last seen 2h ago'}
                </p>
              )}
            </div>
          </div>
          {!selectedChat && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowNewChatModal(true)}
              className="text-white hover:bg-gray-700"
            >
              <Plus className="w-5 h-5" />
            </Button>
          )}
          {selectedChat && (
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
              <MoreVertical className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">New Chat</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewChatModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </Button>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-300">Following</h3>
              {followingUsers.map((user) => (
                <div
                  key={user.username}
                  onClick={() => handleStartChat(user)}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg cursor-pointer"
                >
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-purple-600 text-white">
                        {user.displayName[0]}
                      </AvatarFallback>
                    </Avatar>
                    {user.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.displayName}</p>
                    <p className="text-sm text-gray-400">@{user.username}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!selectedChat ? (
        /* Chat List */
        <div className="flex-1 overflow-y-auto">
          {/* Search */}
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search messages..."
                className="pl-10 bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="divide-y divide-gray-700">
            {chatList.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className="p-4 hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {chat.type === 'direct' ? (
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={chat.avatar} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {chat.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                        {chat.type === 'challenge' ? (
                          <User className="w-6 h-6 text-blue-400" />
                        ) : (
                          <Users className="w-6 h-6 text-purple-400" />
                        )}
                      </div>
                    )}
                    {chat.type === 'direct' && chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium truncate">{chat.name}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">{chat.timestamp}</span>
                        {chat.unreadCount > 0 && (
                          <Badge className="bg-blue-600 text-white min-w-[20px] h-5 text-xs flex items-center justify-center">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 truncate mt-1">{chat.lastMessage}</p>
                    {chat.participants && (
                      <p className="text-xs text-gray-500 mt-1">
                        {chat.participants.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Chat View */
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isOwn
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  {!message.isOwn && (
                    <p className="text-xs text-gray-300 mb-1">{message.sender}</p>
                  )}
                  <p className="whitespace-pre-wrap">{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.isOwn ? 'text-blue-200' : 'text-gray-400'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-gray-800 border-gray-600 text-white"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesScreen;
