import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Plus, Users, Settings, Trophy, Target, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Tournament {
  id: string;
  name: string;
  game: string;
  prize_pool: number;
  prize_pool_type: string;
  min_teams: number;
  max_teams?: number;
  format: string;
  placement_points?: string;
  kill_points: number;
  status: string;
  created_at: string;
}

interface TournamentManager {
  id: string;
  tournament_id: string;
  manager_id: string;
  permissions: string;
  assigned_at: string;
}

const MahasagramScreen = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [managers, setManagers] = useState<TournamentManager[]>([]);
  const [activeTab, setActiveTab] = useState('tournaments');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Form state for tournament creation
  const [formData, setFormData] = useState({
    name: '',
    game: '',
    prize_pool: '',
    prize_pool_type: 'Fixed',
    min_teams: '24',
    max_teams: '',
    format: 'League',
    placement_points: '15,12,10,8,6,4,2,1',
    kill_points: '1'
  });

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from('mahasagram_tournaments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTournaments(data || []);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tournaments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('mahasagram_tournaments')
        .insert({
          name: formData.name,
          game: formData.game,
          prize_pool: parseFloat(formData.prize_pool),
          prize_pool_type: formData.prize_pool_type,
          min_teams: parseInt(formData.min_teams),
          max_teams: formData.max_teams ? parseInt(formData.max_teams) : null,
          format: formData.format,
          placement_points: formData.placement_points,
          kill_points: parseInt(formData.kill_points),
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setTournaments([data, ...tournaments]);
      setIsCreateModalOpen(false);
      setFormData({
        name: '',
        game: '',
        prize_pool: '',
        prize_pool_type: 'Fixed',
        min_teams: '24',
        max_teams: '',
        format: 'League',
        placement_points: '15,12,10,8,6,4,2,1',
        kill_points: '1'
      });

      toast({
        title: "Success",
        description: "Tournament created successfully!",
        variant: "default"
      });
    } catch (error) {
      console.error('Error creating tournament:', error);
      toast({
        title: "Error",
        description: "Failed to create tournament",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      Setup: 'bg-yellow-500',
      Registration: 'bg-blue-500',
      Live: 'bg-green-500',
      Completed: 'bg-gray-500'
    };
    return (
      <Badge className={`${colors[status as keyof typeof colors]} text-white`}>
        {status}
      </Badge>
    );
  };

  const TournamentCard = ({ tournament }: { tournament: Tournament }) => (
    <Card className="border border-border">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{tournament.name}</CardTitle>
            <p className="text-muted-foreground">{tournament.game}</p>
          </div>
          {getStatusBadge(tournament.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Prize Pool:</span>
            <span className="font-medium">${tournament.prize_pool}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Format:</span>
            <span>{tournament.format}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Min Teams:</span>
            <span>{tournament.min_teams}</span>
          </div>
          <div className="flex gap-2 mt-4">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                setSelectedTournament(tournament.id);
                setIsAssignModalOpen(true);
              }}
            >
              <Users className="w-4 h-4 mr-1" />
              Managers
            </Button>
            <Button size="sm" variant="outline">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CreateTournamentModal = () => (
    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Tournament</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateTournament} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Tournament Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="game">Game</Label>
              <Select value={formData.game} onValueChange={(value) => setFormData({...formData, game: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select game" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBG">PUBG</SelectItem>
                  <SelectItem value="Fortnite">Fortnite</SelectItem>
                  <SelectItem value="Apex Legends">Apex Legends</SelectItem>
                  <SelectItem value="Call of Duty">Call of Duty</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prize_pool">Prize Pool ($)</Label>
              <Input
                id="prize_pool"
                type="number"
                value={formData.prize_pool}
                onChange={(e) => setFormData({...formData, prize_pool: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="prize_pool_type">Prize Pool Type</Label>
              <Select value={formData.prize_pool_type} onValueChange={(value) => setFormData({...formData, prize_pool_type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fixed">Fixed</SelectItem>
                  <SelectItem value="Dynamic">Dynamic (60% of fees)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min_teams">Minimum Teams</Label>
              <Input
                id="min_teams"
                type="number"
                value={formData.min_teams}
                onChange={(e) => setFormData({...formData, min_teams: e.target.value})}
                min="24"
                required
              />
            </div>
            <div>
              <Label htmlFor="max_teams">Maximum Teams (Optional)</Label>
              <Input
                id="max_teams"
                type="number"
                value={formData.max_teams}
                onChange={(e) => setFormData({...formData, max_teams: e.target.value})}
                placeholder="Leave blank for unlimited"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="format">Tournament Format</Label>
            <Select value={formData.format} onValueChange={(value) => setFormData({...formData, format: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="League">League</SelectItem>
                <SelectItem value="Swiss">Swiss</SelectItem>
                <SelectItem value="Knockout">Knockout</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="placement_points">Placement Points</Label>
              <Input
                id="placement_points"
                value={formData.placement_points}
                onChange={(e) => setFormData({...formData, placement_points: e.target.value})}
                placeholder="e.g. 15,12,10,8,6,4,2,1"
              />
            </div>
            <div>
              <Label htmlFor="kill_points">Kill Points per Kill</Label>
              <Input
                id="kill_points"
                type="number"
                value={formData.kill_points}
                onChange={(e) => setFormData({...formData, kill_points: e.target.value})}
                min="0"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Tournament
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Loading tournaments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Mahasagram Tournaments
          </h1>
          <p className="text-muted-foreground">Manage mega tournaments and assign tournament managers</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Tournament
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="tournaments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
          
          {tournaments.length === 0 && (
            <Card className="p-8 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No tournaments yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first Mahasagram tournament to get started
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Tournament
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Tournaments</p>
                    <p className="text-2xl font-bold">{tournaments.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Live Tournaments</p>
                    <p className="text-2xl font-bold">
                      {tournaments.filter(t => t.status === 'Live').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Prize Pool</p>
                    <p className="text-2xl font-bold">
                      ${tournaments.reduce((sum, t) => sum + t.prize_pool, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertCircle className="w-8 h-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Registration Open</p>
                    <p className="text-2xl font-bold">
                      {tournaments.filter(t => t.status === 'Registration').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <CreateTournamentModal />
    </div>
  );
};

export default MahasagramScreen;