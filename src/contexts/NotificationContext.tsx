import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'challenge_accepted' | 'team_invite' | 'new_follower' | 'new_message' | 'tournament_update' | 'room_id';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: any; // Additional data specific to notification type
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  getUnreadCount: () => number;
  removeNotification: (notificationId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif_1',
      type: 'challenge_accepted',
      title: 'Challenge Accepted!',
      message: 'ProGamer99 accepted your VALORANT 1v1 challenge',
      timestamp: '2 minutes ago',
      read: false,
      data: { challengeId: 'CH_VL_001', opponent: 'ProGamer99' }
    },
    {
      id: 'notif_2',
      type: 'team_invite',
      title: 'Team Invitation',
      message: 'Shadow Esports wants you to join their team',
      timestamp: '10 minutes ago',
      read: false,
      data: { teamId: 'team_1', teamName: 'Shadow Esports', teamLeader: 'SkillzMaster' }
    },
    {
      id: 'notif_3',
      type: 'new_follower',
      title: 'New Follower',
      message: 'GameMaster123 started following you',
      timestamp: '1 hour ago',
      read: true,
      data: { followerId: 'GameMaster123' }
    },
    {
      id: 'notif_4',
      type: 'tournament_update',
      title: 'Tournament Registration Successful',
      message: 'You have been successfully registered for VALORANT Championship',
      timestamp: '30 minutes ago',
      read: false,
      data: { tournamentId: 'tourn_1', tournamentName: 'VALORANT Championship' }
    },
    {
      id: 'notif_5',
      type: 'room_id',
      title: 'Tournament Room Details',
      message: 'Room ID and password for VALORANT Championship has been shared',
      timestamp: '15 minutes ago',
      read: false,
      data: { 
        tournamentId: 'tourn_1', 
        tournamentName: 'VALORANT Championship',
        roomId: 'VCT2024_ROOM_001',
        password: 'VCT2024'
      }
    }
  ]);

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notif_${Date.now()}`,
      timestamp: 'now',
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      getUnreadCount,
      removeNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};