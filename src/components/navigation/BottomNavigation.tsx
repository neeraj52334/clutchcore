
import { Home, Search, Swords, User, FileText } from 'lucide-react';
import { Button } from '../ui/button';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'gamer' | 'community_admin' | 'p_host' | 'owner';
}

const BottomNavigation = ({ activeTab, onTabChange, userRole }: BottomNavigationProps) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'compete', icon: Swords, label: 'Compete' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  // Add role-specific tab
  if (userRole === 'p_host') {
    tabs.push({ id: 'requests', icon: FileText, label: 'Requests' });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800">
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center space-y-1 py-2 px-3 ${
                isActive 
                  ? 'text-blue-400 bg-blue-900/30' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
