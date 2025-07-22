import { useState } from 'react';
import { Crown, Users, Shield, Settings, ArrowLeft, Plus, Search, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface OwnerDashboardProps {
  onBack?: () => void;
}

interface RoleAssignment {
  id: string;
  identifier: string; // email, phone, or userid
  newRole: 'community_admin' | 'p_host';
  status: 'pending' | 'assigned' | 'failed';
  assignedAt?: string;
}

const OwnerDashboard = ({ onBack }: OwnerDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'roles' | 'users'>('overview');
  const [showRoleAssignment, setShowRoleAssignment] = useState(false);
  const [roleForm, setRoleForm] = useState({
    identifier: '',
    role: 'community_admin' as 'community_admin' | 'p_host'
  });
  const [roleAssignments, setRoleAssignments] = useState<RoleAssignment[]>([
    {
      id: '1',
      identifier: 'admin@example.com',
      newRole: 'community_admin',
      status: 'assigned',
      assignedAt: '2024-01-15'
    },
    {
      id: '2',
      identifier: '+91-9876543210',
      newRole: 'p_host',
      status: 'assigned',
      assignedAt: '2024-01-14'
    }
  ]);

  // Mock system stats
  const systemStats = {
    totalUsers: 15420,
    communityAdmins: 25,
    pHosts: 45,
    totalCommunities: 125,
    totalTournaments: 340,
    totalChallenges: 2540,
    monthlyRevenue: 285000
  };

  // Mock recent users for management
  const recentUsers = [
    {
      id: '1',
      username: 'GamerPro',
      email: 'gamer@example.com',
      role: 'gamer',
      avatar: '/placeholder.svg',
      joinedAt: '2024-01-20',
      status: 'active'
    },
    {
      id: '2',
      username: 'TourneyMaster',
      email: 'admin@example.com',
      role: 'community_admin',
      avatar: '/placeholder.svg',
      joinedAt: '2024-01-15',
      status: 'active'
    },
    {
      id: '3',
      username: 'ProHost',
      email: 'host@example.com',
      role: 'p_host',
      avatar: '/placeholder.svg',
      joinedAt: '2024-01-14',
      status: 'active'
    }
  ];

  const handleAssignRole = () => {
    if (!roleForm.identifier || !roleForm.role) return;

    const newAssignment: RoleAssignment = {
      id: Date.now().toString(),
      identifier: roleForm.identifier,
      newRole: roleForm.role,
      status: 'assigned',
      assignedAt: new Date().toISOString().split('T')[0]
    };

    setRoleAssignments(prev => [newAssignment, ...prev]);
    setRoleForm({ identifier: '', role: 'community_admin' });
    setShowRoleAssignment(false);
  };

  const removeRoleAssignment = (id: string) => {
    setRoleAssignments(prev => prev.filter(assignment => assignment.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="text-gray-400">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <Crown className="w-8 h-8 text-yellow-400" />
            <h1 className="text-2xl font-bold">Owner Dashboard</h1>
          </div>
          <Badge className="bg-yellow-600 text-white">
            Master Admin
          </Badge>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="flex space-x-1 p-4">
          {[
            { id: 'overview', label: 'Overview', icon: Settings },
            { id: 'roles', label: 'Role Management', icon: Shield },
            { id: 'users', label: 'User Management', icon: Users }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 ${
                activeTab === tab.id ? 'bg-blue-600' : 'text-gray-400'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* System Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-blue-400">{systemStats.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Total Users</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-green-400">{systemStats.communityAdmins}</p>
                  <p className="text-sm text-gray-400">Community Admins</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-purple-400">{systemStats.pHosts}</p>
                  <p className="text-sm text-gray-400">P-Hosts</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-400">₹{systemStats.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Monthly Revenue</p>
                </CardContent>
              </Card>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <p className="text-xl font-bold text-orange-400">{systemStats.totalCommunities}</p>
                  <p className="text-sm text-gray-400">Active Communities</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <p className="text-xl font-bold text-red-400">{systemStats.totalTournaments}</p>
                  <p className="text-sm text-gray-400">Total Tournaments</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <p className="text-xl font-bold text-cyan-400">{systemStats.totalChallenges}</p>
                  <p className="text-sm text-gray-400">Total Challenges</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {activeTab === 'roles' && (
          <>
            {/* Role Assignment Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Role Management</h2>
              <Button 
                onClick={() => setShowRoleAssignment(true)}
                className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Assign Role</span>
              </Button>
            </div>

            {/* Role Assignments List */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Role Assignments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {roleAssignments.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No role assignments yet</p>
                ) : (
                  roleAssignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <p className="text-white font-medium">{assignment.identifier}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={assignment.newRole === 'community_admin' ? 'bg-blue-600' : 'bg-purple-600'}>
                            {assignment.newRole === 'community_admin' ? 'Community Admin' : 'P-Host'}
                          </Badge>
                          <Badge 
                            variant={assignment.status === 'assigned' ? 'default' : 'secondary'}
                            className={
                              assignment.status === 'assigned' ? 'bg-green-600' : 
                              assignment.status === 'pending' ? 'bg-yellow-600' : 'bg-red-600'
                            }
                          >
                            {assignment.status}
                          </Badge>
                        </div>
                        {assignment.assignedAt && (
                          <p className="text-gray-400 text-sm">Assigned on {assignment.assignedAt}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRoleAssignment(assignment.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'users' && (
          <>
            {/* User Management Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">User Management</h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input 
                    placeholder="Search users..."
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Users List */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">All Users</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {user.username[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">{user.username}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                        <p className="text-gray-500 text-xs">Joined {user.joinedAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={
                        user.role === 'gamer' ? 'bg-gray-600' :
                        user.role === 'community_admin' ? 'bg-blue-600' : 'bg-purple-600'
                      }>
                        {user.role === 'gamer' ? 'Gamer' : 
                         user.role === 'community_admin' ? 'Community Admin' : 'P-Host'}
                      </Badge>
                      <Badge className={user.status === 'active' ? 'bg-green-600' : 'bg-red-600'}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Role Assignment Modal */}
      {showRoleAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Assign Role</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-400">User ID, Email, or Phone Number</Label>
                <Input 
                  value={roleForm.identifier}
                  onChange={(e) => setRoleForm(prev => ({ ...prev, identifier: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white" 
                  placeholder="Enter user ID, email, or phone number" 
                />
              </div>
              <div>
                <Label className="text-gray-400">Role</Label>
                <select 
                  value={roleForm.role}
                  onChange={(e) => setRoleForm(prev => ({ ...prev, role: e.target.value as 'community_admin' | 'p_host' }))}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value="community_admin">Community Admin</option>
                  <option value="p_host">P-Host</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleAssignRole}
                  className="flex-1 bg-green-600 hover:bg-green-700 flex items-center justify-center"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Assign Role
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowRoleAssignment(false)}
                  className="flex-1 border-gray-600 text-gray-400"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;