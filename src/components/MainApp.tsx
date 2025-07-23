
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ChallengeProvider } from '../contexts/ChallengeContext';
import { TournamentProvider } from '../contexts/TournamentContext';
import TopNavigation from './navigation/TopNavigation';
import BottomNavigation from './navigation/BottomNavigation';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import CompeteScreen from './screens/CompeteScreen';
import ProfileScreen from './screens/ProfileScreen';
import MessagesScreen from './screens/MessagesScreen';
import WalletScreen from './screens/WalletScreen';
import PHostRequestsScreen from './screens/PHostRequestsScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import FollowListScreen from './screens/FollowListScreen';
import OwnerDashboard from './screens/OwnerDashboard';
import TournamentScreen from './screens/TournamentScreen';


const MainApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentScreen, setCurrentScreen] = useState('main');
  const [selectedUser, setSelectedUser] = useState(null);
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [followListType, setFollowListType] = useState<'followers' | 'following'>('followers');
  const { user } = useAuth();

  // Sample data for follow lists
  const sampleFollowData = [
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
    }
  ];

  const handleUserClick = (userData: any) => {
    setSelectedUser(userData);
    setCurrentScreen('userProfile');
  };

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
    console.log(`Opening chat with ${username}...`);
    // Navigate to messages and start chat
    setCurrentScreen('messages');
  };

  const handleFollowersClick = () => {
    setFollowListType('followers');
    setCurrentScreen('followList');
  };

  const handleFollowingClick = () => {
    setFollowListType('following');
    setCurrentScreen('followList');
  };

  const renderScreen = () => {
    // Owner Dashboard - full screen replacement
    if (user?.role === 'owner' && activeTab === 'profile') {
      return <OwnerDashboard />;
    }

    switch (currentScreen) {
      case 'messages':
        return <MessagesScreen onBack={() => setCurrentScreen('main')} />;
      case 'wallet':
        return <WalletScreen onBack={() => setCurrentScreen('main')} />;
      case 'userProfile':
        return (
          <UserProfileScreen
            user={selectedUser}
            isFollowing={followedUsers.has(selectedUser?.username)}
            onBack={() => setCurrentScreen('main')}
            onFollow={handleFollow}
            onMessage={handleMessage}
            onFollowersClick={handleFollowersClick}
            onFollowingClick={handleFollowingClick}
          />
        );
      case 'followList':
        return (
          <FollowListScreen
            title={followListType === 'followers' ? 'Followers' : 'Following'}
            users={sampleFollowData}
            followedUsers={followedUsers}
            onBack={() => setCurrentScreen(selectedUser ? 'userProfile' : 'main')}
            onFollow={handleFollow}
            onMessage={handleMessage}
            onUserClick={handleUserClick}
          />
        );
      default:
        switch (activeTab) {
          case 'home':
            return <HomeScreen />;
          case 'search':
            return <SearchScreen onUserClick={handleUserClick} />;
          case 'compete':
            return <CompeteScreen />;
          case 'tournaments':
            return <TournamentScreen />;
          case 'profile':
            return (
              <ProfileScreen
                onFollowersClick={handleFollowersClick}
                onFollowingClick={handleFollowingClick}
              />
            );
          case 'requests':
            return <PHostRequestsScreen />;
          default:
            return <HomeScreen />;
        }
    }
  };

  return (
    <ChallengeProvider>
      <TournamentProvider>
        <div className="min-h-screen bg-gray-900 text-white">
        {/* Hide top navigation for owner dashboard */}
        {!(user?.role === 'owner' && activeTab === 'profile') && (
          <TopNavigation 
            onMessagesClick={() => setCurrentScreen('messages')}
            onWalletClick={() => setCurrentScreen('wallet')}
          />
        )}
        
        <main className={`${!(user?.role === 'owner' && activeTab === 'profile') ? 'pb-20 pt-16' : ''}`}>
          {renderScreen()}
        </main>

        {/* Hide bottom navigation for owner dashboard */}
        {!(user?.role === 'owner' && activeTab === 'profile') && (
          <BottomNavigation 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            userRole={user?.role || 'gamer'}
          />
        )}
        </div>
      </TournamentProvider>
    </ChallengeProvider>
  );
};

export default MainApp;
