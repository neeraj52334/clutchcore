import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Trophy, Target, Users, AlertTriangle, Clock, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Tournament {
  id: string;
  name: string;
  game: string;
  prize_pool: number;
  status: string;
  placement_points: string;
  kill_points: number;
}

interface MatchResult {
  id: string;
  tournament_id: string;
  team_name: string;
  match_number: number;
  placement: number;
  kills: number;
  placement_points: number;
  total_points: number;
}

interface Dispute {
  id: string;
  tournament_id: string;
  reported_by: string;
  match_number?: number;
  reason: string;
  description?: string;
  status: string;
  created_at: string;
}

interface TournamentManagerDashboardProps {
  tournamentId: string;
  onBack: () => void;
}

const TournamentManagerDashboard = ({ tournamentId, onBack }: TournamentManagerDashboardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state for match results
  const [resultForm, setResultForm] = useState({
    match_number: '',
    team_name: '',
    placement: '',
    kills: '0'
  });

  useEffect(() => {
    fetchTournamentData();
  }, [tournamentId]);

  const fetchTournamentData = async () => {
    try {
      // Fetch tournament details
      const { data: tournamentData, error: tournamentError } = await supabase
        .from('mahasagram_tournaments')
        .select('*')
        .eq('id', tournamentId)
        .single();

      if (tournamentError) throw tournamentError;
      setTournament(tournamentData);

      // Fetch match results
      const { data: resultsData, error: resultsError } = await supabase
        .from('match_results')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('created_at', { ascending: false });

      if (resultsError) throw resultsError;
      setResults(resultsData || []);

      // Fetch disputes
      const { data: disputesData, error: disputesError } = await supabase
        .from('disputes')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('created_at', { ascending: false });

      if (disputesError) throw disputesError;
      setDisputes(disputesData || []);

      // Calculate leaderboard
      if (resultsData && resultsData.length > 0) {
        calculateLeaderboard(resultsData);
      }
    } catch (error) {
      console.error('Error fetching tournament data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tournament data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateLeaderboard = (resultsData: MatchResult[]) => {
    const teamStats = resultsData.reduce((acc, result) => {
      if (!acc[result.team_name]) {
        acc[result.team_name] = {
          team_name: result.team_name,
          total_points: 0,
          total_kills: 0,
          matches_played: 0
        };
      }
      acc[result.team_name].total_points += result.total_points;
      acc[result.team_name].total_kills += result.kills;
      acc[result.team_name].matches_played += 1;
      return acc;
    }, {} as any);

    const leaderboardData = Object.values(teamStats).sort((a: any, b: any) => b.total_points - a.total_points);
    setLeaderboard(leaderboardData);
  };

  const handleSubmitResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !tournament) return;

    try {
      // Calculate placement points based on tournament settings
      const placementPointsArray = tournament.placement_points?.split(',').map(p => parseInt(p.trim())) || [];
      const placementPoints = placementPointsArray[parseInt(resultForm.placement) - 1] || 0;

      const { data, error } = await supabase
        .from('match_results')
        .insert({
          tournament_id: tournamentId,
          team_name: resultForm.team_name,
          match_number: parseInt(resultForm.match_number),
          placement: parseInt(resultForm.placement),
          kills: parseInt(resultForm.kills),
          placement_points: placementPoints,
          submitted_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setResults([data, ...results]);
      setIsResultsModalOpen(false);
      setResultForm({
        match_number: '',
        team_name: '',
        placement: '',
        kills: '0'
      });

      // Recalculate leaderboard
      calculateLeaderboard([data, ...results]);

      toast({
        title: "Success",
        description: "Match result submitted successfully!",
        variant: "default"
      });
    } catch (error) {
      console.error('Error submitting result:', error);
      toast({
        title: "Error",
        description: "Failed to submit match result",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      Open: 'bg-yellow-500',
      'Under Review': 'bg-blue-500',
      Resolved: 'bg-green-500',
      Rejected: 'bg-red-500'
    };
    return (
      <Badge className={`${colors[status as keyof typeof colors]} text-white`}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Loading tournament data...</p>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Tournament not found</h3>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Button variant="outline" onClick={onBack} className="mb-4">
            ← Back to Tournaments
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            {tournament.name}
          </h1>
          <p className="text-muted-foreground">Tournament Management Dashboard</p>
        </div>
        <Button onClick={() => setIsResultsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Submit Result
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Prize Pool</p>
                <p className="text-2xl font-bold">${tournament.prize_pool}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Matches Played</p>
                <p className="text-2xl font-bold">{results.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Teams Participating</p>
                <p className="text-2xl font-bold">{leaderboard.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Open Disputes</p>
                <p className="text-2xl font-bold">
                  {disputes.filter(d => d.status === 'Open').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="results">Match Results</TabsTrigger>
          <TabsTrigger value="disputes">Disputes</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.slice(0, 5).map((result) => (
                    <div key={result.id} className="flex justify-between items-center p-2 bg-muted rounded">
                      <div>
                        <p className="font-medium">{result.team_name}</p>
                        <p className="text-sm text-muted-foreground">Match {result.match_number}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{result.total_points} pts</p>
                        <p className="text-sm text-muted-foreground">#{result.placement} • {result.kills} kills</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboard.slice(0, 5).map((team, index) => (
                    <div key={team.team_name} className="flex justify-between items-center p-2 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">#{index + 1}</span>
                        <span className="font-medium">{team.team_name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{team.total_points} pts</p>
                        <p className="text-sm text-muted-foreground">{team.total_kills} kills</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle>Tournament Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Total Points</TableHead>
                    <TableHead>Total Kills</TableHead>
                    <TableHead>Matches</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.map((team, index) => (
                    <TableRow key={team.team_name}>
                      <TableCell className="font-medium">#{index + 1}</TableCell>
                      <TableCell>{team.team_name}</TableCell>
                      <TableCell>{team.total_points}</TableCell>
                      <TableCell>{team.total_kills}</TableCell>
                      <TableCell>{team.matches_played}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Match Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Match</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Placement</TableHead>
                    <TableHead>Kills</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>#{result.match_number}</TableCell>
                      <TableCell>{result.team_name}</TableCell>
                      <TableCell>#{result.placement}</TableCell>
                      <TableCell>{result.kills}</TableCell>
                      <TableCell>{result.placement_points}</TableCell>
                      <TableCell className="font-medium">{result.total_points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disputes">
          <Card>
            <CardHeader>
              <CardTitle>Dispute Center</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Match</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disputes.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell>{dispute.id.slice(0, 8)}</TableCell>
                      <TableCell>{dispute.match_number ? `#${dispute.match_number}` : 'General'}</TableCell>
                      <TableCell>{dispute.reason}</TableCell>
                      <TableCell>{getStatusBadge(dispute.status)}</TableCell>
                      <TableCell>{new Date(dispute.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Results Input Modal */}
      <Dialog open={isResultsModalOpen} onOpenChange={setIsResultsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Match Result</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitResult} className="space-y-4">
            <div>
              <Label htmlFor="match_number">Match Number</Label>
              <Input
                id="match_number"
                type="number"
                value={resultForm.match_number}
                onChange={(e) => setResultForm({...resultForm, match_number: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="team_name">Team Name</Label>
              <Input
                id="team_name"
                value={resultForm.team_name}
                onChange={(e) => setResultForm({...resultForm, team_name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="placement">Placement</Label>
              <Select 
                value={resultForm.placement} 
                onValueChange={(value) => setResultForm({...resultForm, placement: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select placement" />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(num => (
                    <SelectItem key={num} value={num.toString()}>#{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="kills">Kills</Label>
              <Input
                id="kills"
                type="number"
                value={resultForm.kills}
                onChange={(e) => setResultForm({...resultForm, kills: e.target.value})}
                min="0"
                required
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsResultsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Submit Result
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TournamentManagerDashboard;