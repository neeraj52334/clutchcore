
import { MessageCircle, Wallet, ArrowLeft, Bell, Users } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface TopNavigationProps {
  onMessagesClick: () => void;
  onWalletClick: () => void;
  onNotificationsClick: () => void;
  onTeamsClick: () => void;
  showBack?: boolean;
  onBackClick?: () => void;
  title?: string;
}

const TopNavigation = ({ 
  onMessagesClick, 
  onWalletClick,
  onNotificationsClick,
  onTeamsClick,
  showBack = false, 
  onBackClick,
  title 
}: TopNavigationProps) => {
  const { balance } = useWallet();
  const { getUnreadCount } = useNotifications();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          {showBack ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="text-white hover:bg-gray-800 mr-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          ) : null}
          
          {title ? (
            <h1 className="text-xl font-bold text-white">{title}</h1>
          ) : (
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-green-400 p-2 rounded-lg mr-2">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <h1 className="text-xl font-bold text-white">
                Clutch<span className="text-blue-400">Core</span>
              </h1>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onTeamsClick}
            className="text-white hover:bg-gray-800"
          >
            <Users className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onNotificationsClick}
            className="text-white hover:bg-gray-800 relative"
          >
            <Bell className="w-5 h-5" />
            {getUnreadCount() > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                {getUnreadCount()}
              </Badge>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onMessagesClick}
            className="text-white hover:bg-gray-800 relative"
          >
            <MessageCircle className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
              3
            </Badge>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onWalletClick}
            className="text-white hover:bg-gray-800 flex items-center space-x-1"
          >
            <Wallet className="w-5 h-5" />
            <span className="text-sm font-medium">₹{balance.toLocaleString()}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
