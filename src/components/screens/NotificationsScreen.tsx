import React, { useState } from 'react';
import { Bell, Check, CheckCheck, X, Users, Trophy, MessageCircle, UserPlus, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useNotifications, Notification } from '../../contexts/NotificationContext';
import { useTeams } from '../../contexts/TeamContext';

const NotificationsScreen = () => {
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const { respondToInvitation } = useTeams();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'challenge_accepted':
        return <Target className="w-5 h-5 text-orange-400" />;
      case 'team_invite':
        return <Users className="w-5 h-5 text-purple-400" />;
      case 'new_follower':
        return <UserPlus className="w-5 h-5 text-blue-400" />;
      case 'new_message':
        return <MessageCircle className="w-5 h-5 text-green-400" />;
      case 'tournament_update':
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 'room_id':
        return <Trophy className="w-5 h-5 text-red-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleTeamInviteResponse = (notificationId: string, invitationId: string, response: 'accepted' | 'declined') => {
    respondToInvitation(invitationId, response);
    markAsRead(notificationId);
    if (response === 'accepted') {
      alert('You have joined the team!');
    } else {
      alert('Team invitation declined');
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Bell className="w-7 h-7 mr-2 text-blue-400" />
            Notifications
          </h1>
          {unreadCount > 0 && (
            <Badge className="bg-red-600">{unreadCount}</Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-400 hover:bg-gray-700"
          >
            <CheckCheck className="w-4 h-4 mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
          className={filter === 'all' ? 'bg-blue-600' : 'border-gray-600 text-gray-400'}
        >
          All ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter('unread')}
          size="sm"
          className={filter === 'unread' ? 'bg-blue-600' : 'border-gray-600 text-gray-400'}
        >
          Unread ({unreadCount})
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`bg-gray-800 border-gray-700 cursor-pointer transition-colors ${
                !notification.read ? 'border-l-4 border-l-blue-400' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-medium ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className="text-gray-400 hover:text-white p-1"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className={`text-sm mb-2 ${notification.read ? 'text-gray-400' : 'text-gray-300'}`}>
                      {notification.message}
                    </p>
                    
                    <p className="text-xs text-gray-500">{notification.timestamp}</p>
                    
                    {/* Team Invitation Actions */}
                    {notification.type === 'team_invite' && !notification.read && notification.data && (
                      <div className="flex space-x-2 mt-3">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTeamInviteResponse(notification.id, notification.data.teamId, 'accepted');
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTeamInviteResponse(notification.id, notification.data.teamId, 'declined');
                          }}
                          className="border-red-400 text-red-400 hover:bg-red-900/20"
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                    
                    {/* Challenge Accepted Actions */}
                    {notification.type === 'challenge_accepted' && notification.data && (
                      <div className="mt-3">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Opening chat with ${notification.data.opponent}`);
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Open Chat
                        </Button>
                      </div>
                    )}
                    
                    {/* Room ID Notification */}
                    {notification.type === 'room_id' && notification.data && (
                      <div className="mt-3 p-2 bg-gray-700 rounded">
                        <p className="text-xs text-gray-400 mb-1">Room ID:</p>
                        <p className="text-white font-mono">{notification.data.roomId}</p>
                        <p className="text-xs text-gray-400 mt-1">Password: {notification.data.password}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;