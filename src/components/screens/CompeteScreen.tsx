import { useState } from 'react';
import { Plus, Swords, Trophy, Users, Clock, Target, Filter, MessageCircle, X, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useWallet } from '../../contexts/WalletContext';
import { useAuth } from '../../contexts/AuthContext';
import { useChallenges } from '../../contexts/ChallengeContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { TournamentManager } from './TournamentManager';
import { RoomIdPass } from '../ui/room-id-pass';
import { TournamentPasswordDialog } from '../ui/tournament-password-dialog';

const CompeteScreen = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [gameFilter, setGameFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showTournamentManager, setShowTournamentManager] = useState(false);
  const [registeredTournaments, setRegisteredTournaments] = useState(new Set());
  const [registeredChallenges, setRegisteredChallenges] = useState(new Set());
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [pendingTournament, setPendingTournament] = useState(null);
  const [challengeForm, setChallengeForm] = useState({
    game: '',
    type: '',
    entryPrices: [{ price: '', selected: false }],
    rules: ''
  });
  
  const { deductMoney } = useWallet();
  const { user } = useAuth();
  const { challenges, addChallenge, getUserChallenges, getUserJoinedChallenges, publishChallengeRoom } = useChallenges();
  const { addNotification } = useNotifications();

  // Game logo mapping
  const gameLogos = {
    'Free Fire': '🔥',
    'BGMI': '🎯', 
    'Call of Duty': '⚔️',
    'COD Mobile': '⚔️',
    'Valorant': '💀',
    'VALORANT': '💀'
  };

  const games = [
    { value: 'all', label: 'All Games', icon: '🎮' },
    { value: 'valorant', label: 'VALORANT', icon: '💀' },
    { value: 'freefire', label: 'Free Fire', icon: '🔥' },
    { value: 'bgmi', label: 'BGMI', icon: '🎯' },
    { value: 'cod', label: 'Call of Duty Mobile', icon: '⚔️' }
  ];

  const typeFilters = [
    { value: 'all', label: 'All Types' },
    { value: 'solo', label: 'Solo' },
    { value: 'squad', label: 'Squad' }
  ];

  const statusFilters = [
    { value: 'all', label: 'All' },
    { value: 'free', label: 'Free' },
    { value: 'paid', label: 'Paid' }
  ];

  // Get user's challenges from context
  const myChallenges = user ? getUserChallenges(user.username) : [];

  // Get all available challenges from context (exclude user's own challenges)
  const availableChallenges = challenges.filter(challenge => challenge.creator !== user?.username);

  const featuredTournaments = [
    {
      id: 1,
      title: "VALORANT Championship 2024",
      organizer: "Elite Gaming Hub",
      game: "VALORANT",
      type: "squad",
      entryFee: 500,
      prizePool: 50000,
      participants: "64/128",
      currentParticipants: 64,
      maxParticipants: 128,
      deadline: "2 days left",
      status: "paid",
      banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=200&fit=crop",
      isPasswordProtected: true
    },
    {
      id: 2,
      title: "Free Fire Masters",
      organizer: "GameOn Esports", 
      game: "Free Fire",
      type: "solo",
      entryFee: 0,
      prizePool: 25000,
      participants: "89/100",
      currentParticipants: 89,
      maxParticipants: 100,
      deadline: "5 hours left",
      status: "free",
      banner: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=200&fit=crop",
      isPasswordProtected: false
    }
  ];

  const tournaments = [
    ...featuredTournaments,
    {
      id: 3,
      title: "BGMI Pro League",
      organizer: "BGMI Officials",
      game: "BGMI",
      type: "squad",
      entryFee: 300,
      prizePool: 15000,
      participants: "24/50",
      currentParticipants: 24,
      maxParticipants: 50,
      deadline: "1 day left",
      status: "paid",
      banner: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=200&fit=crop",
      isPasswordProtected: false
    },
    {
      id: 4,
      title: "COD Mobile Tournament",
      organizer: "Call of Duty League",
      game: "COD Mobile",
      type: "squad",
      entryFee: 250,
      prizePool: 30000,
      participants: "45/64",
      currentParticipants: 45,
      maxParticipants: 64,
      deadline: "3 days left",
      status: "paid",
      banner: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=200&fit=crop",
      isPasswordProtected: false
    },
    {
      id: 5,
      title: "Free Fire Community Cup",
      organizer: "FF Community",
      game: "Free Fire",
      type: "solo",
      entryFee: 0,
      prizePool: 5000,
      participants: "156/200",
      currentParticipants: 156,
      maxParticipants: 200,
      deadline: "6 hours left",
      status: "free",
      banner: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=200&fit=crop",
      isPasswordProtected: false
    }
  ];

  const filteredChallenges = gameFilter === 'all' 
    ? availableChallenges 
    : availableChallenges.filter(challenge => {
        const gameValue = challenge.game.toLowerCase().replace(' ', '').replace('mobile', '');
        return gameValue.includes(gameFilter) || gameFilter.includes(gameValue);
      });

  const filteredTournaments = tournaments.filter(tournament => {
    const gameMatch = gameFilter === 'all' || tournament.game.toLowerCase().includes(gameFilter);
    const typeMatch = typeFilter === 'all' || tournament.type === typeFilter;
    const statusMatch = statusFilter === 'all' || tournament.status === statusFilter;
    return gameMatch && typeMatch && statusMatch;
  });

  const handleCreateChallenge = async () => {
    try {
      const validPrices = challengeForm.entryPrices.filter(ep => ep.price && parseFloat(ep.price) > 0);
      if (validPrices.length === 0) {
        alert('Please add at least one valid entry price');
        return;
      }
      
      // Create new challenge object
      const newChallenge = {
        id: Date.now(),
        creator: user?.username || "Anonymous",
        game: challengeForm.game.charAt(0).toUpperCase() + challengeForm.game.slice(1),
        type: challengeForm.type,
        entryPrices: validPrices.map(ep => ({ price: parseFloat(ep.price), selected: false })),
        challengeId: `CH_${challengeForm.game.toUpperCase().slice(0,2)}_${Date.now().toString().slice(-3)}`,
        createdAt: "now",
        icon: getGameIcon(challengeForm.game.charAt(0).toUpperCase() + challengeForm.game.slice(1)),
        status: "pending",
        opponent: null
      };

      // Add to global challenges context
      addChallenge(newChallenge);
      
      // Add notification for challenge creation
      addNotification({
        type: 'challenge_accepted',
        title: 'Challenge Created!',
        message: `Your ${challengeForm.game} ${challengeForm.type} challenge is now live`,
        data: { challengeId: newChallenge.challengeId }
      });
      
      console.log('Challenge created:', newChallenge);
      alert('Challenge created successfully!');
      
      setChallengeForm({ game: '', type: '', entryPrices: [{ price: '', selected: false }], rules: '' });
      setShowCreateForm(false);
      setActiveTab('my-challenges');
    } catch (error) {
      console.error('Failed to create challenge:', error);
      alert('Error creating challenge');
    }
  };

  const handleJoinChallenge = async (challenge: any, selectedPrice?: number) => {
    if (!selectedPrice || selectedPrice === 0) {
      // Free challenge - show confirmation
      if (confirm(`Confirm registration for ${challenge.challengeId}?`)) {
        setRegisteredChallenges(prev => new Set([...prev, challenge.challengeId]));
        
        // Add notification for challenge acceptance
        addNotification({
          type: 'challenge_accepted',
          title: 'Challenge Joined!',
          message: `You joined ${challenge.creator}'s ${challenge.game} challenge`,
          data: { challengeId: challenge.challengeId, opponent: challenge.creator }
        });
        
        alert(`Successfully joined ${challenge.challengeId}!`);
      }
    } else {
      // Paid challenge - show payment confirmation
      if (confirm(`Pay ₹${selectedPrice} to join ${challenge.challengeId}?`)) {
        try {
          await deductMoney(selectedPrice, 'challenge_entry', challenge.challengeId);
          setRegisteredChallenges(prev => new Set([...prev, challenge.challengeId]));
          
          // Add notification for paid challenge acceptance
          addNotification({
            type: 'challenge_accepted',
            title: 'Challenge Joined!',
            message: `You joined ${challenge.creator}'s ${challenge.game} challenge for ₹${selectedPrice}`,
            data: { challengeId: challenge.challengeId, opponent: challenge.creator, amount: selectedPrice }
          });
          
          console.log('Successfully joined challenge:', challenge.challengeId);
          alert(`Successfully joined ${challenge.challengeId}!`);
        } catch (error) {
          console.error('Failed to join challenge:', error);
          alert('Insufficient balance or error joining challenge');
        }
      }
    }
  };

  const addEntryPrice = () => {
    if (challengeForm.entryPrices.length < 5) {
      setChallengeForm(prev => ({
        ...prev,
        entryPrices: [...prev.entryPrices, { price: '', selected: false }]
      }));
    }
  };

  const removeEntryPrice = (index: number) => {
    setChallengeForm(prev => ({
      ...prev,
      entryPrices: prev.entryPrices.filter((_, i) => i !== index)
    }));
  };

  const updateEntryPrice = (index: number, value: string) => {
    setChallengeForm(prev => ({
      ...prev,
      entryPrices: prev.entryPrices.map((item, i) => 
        i === index ? { ...item, price: value } : item
      )
    }));
  };

  const handleTournamentRegister = async (tournament: any) => {
    if (!user) {
      alert('Please login to register for tournaments');
      return;
    }

    // Check if user is already registered
    if (registeredTournaments.has(tournament.id)) {
      alert('You are already registered for this tournament!');
      return;
    }

    // Check if tournament is password protected
    if (tournament.isPasswordProtected) {
      setPendingTournament(tournament);
      setShowPasswordDialog(true);
      return;
    }

    // Proceed with normal registration
    proceedWithRegistration(tournament);
  };

  const proceedWithRegistration = async (tournament: any) => {
    if (tournament.entryFee === 0) {
      // Free tournament - show confirmation
      if (confirm(`Confirm registration for ${tournament.title}?`)) {
        setRegisteredTournaments(prev => new Set([...prev, tournament.id]));
        
        // Add notification for tournament registration
        addNotification({
          type: 'tournament_update',
          title: 'Tournament Registered!',
          message: `You registered for ${tournament.title}`,
          data: { tournamentId: tournament.id, tournamentName: tournament.title }
        });
        
        alert(`Successfully registered for ${tournament.title}!`);
      }
    } else {
      // Paid tournament - show payment confirmation
      if (confirm(`Pay ₹${tournament.entryFee} to register for ${tournament.title}?`)) {
        try {
          await deductMoney(tournament.entryFee, 'tournament_entry', tournament.id.toString());
          setRegisteredTournaments(prev => new Set([...prev, tournament.id]));
          
          // Add notification for paid tournament registration
          addNotification({
            type: 'tournament_update',
            title: 'Tournament Registered!',
            message: `You registered for ${tournament.title} - Entry fee: ₹${tournament.entryFee}`,
            data: { tournamentId: tournament.id, tournamentName: tournament.title, entryFee: tournament.entryFee }
          });
          
          alert(`Payment successful! Registered for ${tournament.title}`);
        } catch (error) {
          console.error('Failed to register for tournament:', error);
          alert('Insufficient balance or error registering for tournament');
        }
      }
    }
  };

  const handlePasswordSubmit = (password: string) => {
    // In a real app, this would verify the password against the database
    // For now, we'll simulate password verification
    const correctPassword = "alpha beta gamma delta"; // Mock password for demo
    
    if (password === correctPassword) {
      setShowPasswordDialog(false);
      if (pendingTournament) {
        proceedWithRegistration(pendingTournament);
        setPendingTournament(null);
      }
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  const handlePasswordDialogClose = () => {
    setShowPasswordDialog(false);
    setPendingTournament(null);
  };

  const handleMatchChat = (item: any, type: 'challenge' | 'tournament') => {
    if (!user) {
      alert('Please login to access chat');
      return;
    }

    const isRegistered = type === 'challenge' 
      ? registeredChallenges.has(item.challengeId)
      : registeredTournaments.has(item.id);
    
    if (!isRegistered) {
      alert('You must be registered to access the chat!');
      return;
    }
    
    // Open chat modal or navigate to chat
    setSelectedTournament(item);
    // For now, just show an alert. In real app, this would open a chat modal
    alert(`Opening ${type} chat for: ${type === 'challenge' ? item.challengeId : item.title}`);
  };

  const handleTournamentClick = (tournament: any) => {
    // Only allow community admins to manage tournaments
    if (user?.role === 'community_admin') {
      setSelectedTournament(tournament);
      setShowTournamentManager(true);
    } else {
      // For regular users, show tournament details or allow registration
      alert(`Tournament: ${tournament.title}\nGame: ${tournament.game}\nEntry Fee: ${tournament.entryFee === 0 ? 'Free' : '₹' + tournament.entryFee}\nPrize Pool: ₹${tournament.prizePool}`);
    }
  };

  const challengeTypes = {
    valorant: ['1v1', '5v5'],
    freefire: ['Solo', '4v4', 'Squad'],
    bgmi: ['Solo', 'Duo', 'Squad'],
    cod: ['1v1', '5v5', 'Battle Royale']
  };

  const getGameIcon = (gameName: string) => {
    return gameLogos[gameName] || '🎮';
  };

  if (showTournamentManager && selectedTournament) {
    return (
      <TournamentManager 
        tournament={selectedTournament} 
        onBack={() => setShowTournamentManager(false)} 
      />
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <Swords className="w-7 h-7 mr-2 text-blue-400" />
          Compete
        </h1>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-600 hover:bg-green-700 flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Create</span>
        </Button>
      </div>

      {/* Create Challenge Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-400" />
                Create Challenge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Game</Label>
                <Select value={challengeForm.game} onValueChange={(value) => 
                  setChallengeForm(prev => ({ ...prev, game: value, type: '' }))
                }>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select a game" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {games.slice(1).map((game) => (
                      <SelectItem key={game.value} value={game.value} className="text-white">
                        <span className="flex items-center space-x-2">
                          <span>{game.icon}</span>
                          <span>{game.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {challengeForm.game && (
                <div className="space-y-2">
                  <Label className="text-white">Challenge Type</Label>
                  <Select value={challengeForm.type} onValueChange={(value) => 
                    setChallengeForm(prev => ({ ...prev, type: value }))
                  }>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select challenge type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {challengeTypes[challengeForm.game as keyof typeof challengeTypes]?.map((type) => (
                        <SelectItem key={type} value={type} className="text-white">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Entry Prices (₹)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEntryPrice}
                    disabled={challengeForm.entryPrices.length >= 5}
                    className="border-gray-600 text-gray-400 hover:bg-gray-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Price
                  </Button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {challengeForm.entryPrices.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={entry.price}
                        onChange={(e) => updateEntryPrice(index, e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white flex-1"
                      />
                      {challengeForm.entryPrices.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeEntryPrice(index)}
                          className="border-gray-600 text-red-400 hover:bg-red-900/20"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400">Add up to 5 different entry prices for your challenge</p>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Special Rules (Optional)</Label>
                <Input
                  placeholder="Any specific conditions..."
                  value={challengeForm.rules}
                  onChange={(e) => setChallengeForm(prev => ({ ...prev, rules: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 border-gray-600 text-gray-400 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateChallenge}
                  disabled={!challengeForm.game || !challengeForm.type || challengeForm.entryPrices.every(ep => !ep.price)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Create Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="my-challenges" className="text-white data-[state=active]:bg-blue-600">
            My Challenges
          </TabsTrigger>
          <TabsTrigger value="browse" className="text-white data-[state=active]:bg-blue-600">
            Browse Challenges
          </TabsTrigger>
          <TabsTrigger value="tournaments" className="text-white data-[state=active]:bg-blue-600">
            Tournaments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-challenges" className="space-y-4">
          <div className="space-y-3">
            {myChallenges.map((challenge) => (
              <Card key={challenge.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                <div className="relative h-20 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-3xl">{getGameIcon(challenge.game)}</span>
                  <div className="absolute top-2 right-2">
                    <Badge 
                      variant={challenge.status === 'active' ? 'default' : 'secondary'}
                      className={challenge.status === 'active' ? 'bg-green-600' : 'bg-yellow-600'}
                    >
                      {challenge.status}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        {challenge.game}
                      </Badge>
                    </div>
                          <div className="flex flex-wrap gap-1">
                            {challenge.entryPrices.map((entry, idx) => (
                              <span key={idx} className="text-green-400 font-medium text-xs">
                                ₹{entry.price}
                              </span>
                            ))}
                          </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Challenge ID:</span>
                      <span className="text-white font-mono">{challenge.challengeId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white">{challenge.type}</span>
                    </div>
                    {challenge.opponent && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Opponent:</span>
                        <span className="text-white">{challenge.opponent}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Created:</span>
                      <span className="text-white">{challenge.createdAt}</span>
                    </div>
                  </div>

                  {/* Room ID & Password for registered challenges */}
                  {registeredChallenges.has(challenge.challengeId) && (
                    <div className="mt-4">
                      <RoomIdPass
                        title="Challenge Room"
                        roomId={challenge.roomId}
                        password={challenge.roomPassword}
                        isPublished={challenge.isRoomPublished}
                        isOwner={user?.username === challenge.creator}
                        onPublish={(roomId, password) => publishChallengeRoom(challenge.challengeId, roomId, password)}
                      />
                    </div>
                  )}

                  <div className="flex space-x-2 mt-4">
                    <Button 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleMatchChat(challenge, 'challenge')}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Match Chat
                    </Button>
                    <Button variant="outline" className="flex-1 border-gray-600 text-gray-400">
                      Upload Result
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="browse" className="space-y-4">
          {/* Game Filter Section */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Filter className="w-5 h-5 text-blue-400" />
                <h3 className="text-white font-medium">Filter by Game</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {games.map((game) => (
                  <Button
                    key={game.value}
                    variant={gameFilter === game.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGameFilter(game.value)}
                    className={`flex items-center space-x-1 ${
                      gameFilter === game.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-400 border-gray-600 hover:bg-gray-600'
                    }`}
                  >
                    <span>{game.icon}</span>
                    <span>{game.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {filteredChallenges.map((challenge) => (
              <Card key={challenge.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                <div className="relative h-20 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                  <span className="text-3xl">{challenge.icon || getGameIcon(challenge.game)}</span>
                  <div className="absolute top-2 left-2">
                    <Badge variant="outline" className="text-white border-white/50 bg-black/20">
                      {challenge.game}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-blue-600 text-white">
                          {challenge.creator[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">{challenge.creator}</p>
                        <p className="text-sm text-gray-400">{challenge.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {challenge.entryPrices.map((entry, idx) => (
                        <Badge 
                          key={idx} 
                          variant="outline" 
                          className="text-green-400 border-green-400 cursor-pointer hover:bg-green-400/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinChallenge(challenge, entry.price);
                          }}
                        >
                          ₹{entry.price}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{challenge.type}</span>
                      <span>ID: {challenge.challengeId}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">Select entry price:</p>
                      <div className="flex flex-wrap gap-1">
                        {challenge.entryPrices.map((entry, idx) => (
                          <Button
                            key={idx}
                            size="sm"
                            onClick={() => handleJoinChallenge(challenge, entry.price)}
                            className="bg-green-600 hover:bg-green-700 text-xs"
                            disabled={registeredChallenges.has(challenge.challengeId)}
                          >
                            ₹{entry.price}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-gray-600 text-gray-400"
                      onClick={() => handleMatchChat(challenge, 'challenge')}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredChallenges.length === 0 && (
              <div className="text-center py-8">
                <Swords className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Challenges Found</h3>
                <p className="text-gray-400">
                  No challenges available for the selected game filter.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tournaments" className="space-y-4">
          {/* Featured Tournaments */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
              Featured Tournaments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredTournaments.map((tournament, index) => (
                <Card 
                  key={index} 
                  className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                  onClick={() => handleTournamentClick(tournament)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        {gameLogos[tournament.game] || tournament.game[0]}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{tournament.title}</h3>
                        <p className="text-gray-400">{tournament.game}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Prize Pool</span>
                        <span className="text-green-400 font-semibold">₹{tournament.prizePool}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Entry Fee</span>
                        <span className="text-blue-400 font-semibold">{tournament.entryFee === 0 ? 'Free' : `₹${tournament.entryFee}`}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Participants</span>
                        <span className="text-gray-300">{tournament.participants}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Type</span>
                        <Badge variant="secondary">{tournament.type}</Badge>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                        style={{ width: `${(tournament.currentParticipants / tournament.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                    
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTournamentRegister(tournament);
                      }}
                    >
                      {registeredTournaments.has(tournament.id) ? 'Registered' : 'Register Now'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tournament Filters */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <Filter className="w-5 h-5 text-blue-400" />
                <h3 className="text-white font-medium">Tournament Filters</h3>
              </div>
              
              {/* Game Filter */}
              <div>
                <h4 className="text-sm text-gray-400 mb-2">Games</h4>
                <div className="flex flex-wrap gap-2">
                  {games.map((game) => (
                    <Button
                      key={game.value}
                      variant={gameFilter === game.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGameFilter(game.value)}
                      className={`flex items-center space-x-1 ${
                        gameFilter === game.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-400 border-gray-600 hover:bg-gray-600'
                      }`}
                    >
                      <span>{game.icon}</span>
                      <span>{game.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Type & Status Filters */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-gray-400 mb-2">Type</h4>
                  <div className="flex flex-wrap gap-2">
                    {typeFilters.map((type) => (
                      <Button
                        key={type.value}
                        variant={typeFilter === type.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTypeFilter(type.value)}
                        className={typeFilter === type.value ? 'bg-purple-600' : 'bg-gray-700 text-gray-400 border-gray-600'}
                      >
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 mb-2">Entry</h4>
                  <div className="flex flex-wrap gap-2">
                    {statusFilters.map((status) => (
                      <Button
                        key={status.value}
                        variant={statusFilter === status.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setStatusFilter(status.value)}
                        className={statusFilter === status.value ? 'bg-green-600' : 'bg-gray-700 text-gray-400 border-gray-600'}
                      >
                        {status.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tournament List */}
          <div className="space-y-4">
            {filteredTournaments.map((tournament) => (
              <Card 
                key={tournament.id} 
                className="bg-gray-800 border-gray-700 overflow-hidden cursor-pointer hover:border-gray-600 transition-colors"
                onClick={() => handleTournamentClick(tournament)}
              >
                <div className="relative">
                  <img 
                    src={tournament.banner} 
                    alt={tournament.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex flex-col space-y-1">
                    <Badge className="bg-red-500 text-white">
                      <Clock className="w-3 h-3 mr-1" />
                      {tournament.deadline}
                    </Badge>
                     <Badge className={tournament.status === 'free' ? 'bg-green-500' : 'bg-yellow-500'}>
                       {tournament.status === 'free' ? 'FREE' : 'PAID'}
                     </Badge>
                     {tournament.isPasswordProtected && (
                       <Badge className="bg-orange-500 text-white">
                         <Lock className="w-3 h-3 mr-1" />
                         PROTECTED
                       </Badge>
                     )}
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="text-2xl">{gameLogos[tournament.game] || '🎮'}</span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-white text-lg">{tournament.title}</h3>
                      <p className="text-gray-400 text-sm">by {tournament.organizer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold">₹{tournament.prizePool.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm">Prize Pool</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {tournament.participants || `${tournament.currentParticipants}/${tournament.maxParticipants}`}
                    </span>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      {tournament.type}
                    </Badge>
                     <span>Entry: {tournament.entryFee === 0 ? 'Free' : `₹${tournament.entryFee}`}</span>
                     {tournament.isPasswordProtected && (
                       <Badge variant="outline" className="text-orange-400 border-orange-400">
                         <Lock className="w-3 h-3 mr-1" />
                         Protected
                       </Badge>
                     )}
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ 
                        width: `${tournament.currentParticipants ? 
                          (tournament.currentParticipants / tournament.maxParticipants) * 100 : 
                          Math.random() * 80 + 10}%` 
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTournamentRegister(tournament);
                      }}
                    >
                      {registeredTournaments.has(tournament.id) ? 'Registered' : 'Register Now'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-gray-600 text-gray-400 hover:bg-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMatchChat(tournament, 'tournament');
                      }}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredTournaments.length === 0 && (
              <div className="text-center py-8">
                <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Tournaments Found</h3>
                <p className="text-gray-400">
                  No tournaments match your current filter criteria.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Tournament Password Dialog */}
      <TournamentPasswordDialog
        isOpen={showPasswordDialog}
        onClose={handlePasswordDialogClose}
        onSubmit={handlePasswordSubmit}
        tournamentName={pendingTournament?.title || ''}
      />
    </div>
  );
};

export default CompeteScreen;