import React, { useState } from 'react';
import { ArrowLeft, Calendar, Users, Trophy, DollarSign, Clock, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useTournaments, Tournament } from '../../contexts/TournamentContext';

interface TournamentCreationProps {
  onBack: () => void;
}

const TournamentCreation: React.FC<TournamentCreationProps> = ({ onBack }) => {
  const { addTournament } = useTournaments();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    game: '',
    mode: 'squad' as 'solo' | 'duo' | 'squad',
    prizePool: '',
    totalSlots: '',
    teamsPerGroup: '',
    registrationStart: '',
    registrationEnd: '',
    entryType: 'free' as 'free' | 'paid',
    entryFee: '',
    description: '',
    isPasswordProtected: false,
    password: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const games = [
    'VALORANT',
    'Free Fire',
    'PUBG Mobile',
    'Call of Duty Mobile',
    'Clash Royale',
    'FIFA Mobile'
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Tournament name is required';
    if (!formData.game) newErrors.game = 'Game selection is required';
    if (!formData.prizePool || isNaN(Number(formData.prizePool))) {
      newErrors.prizePool = 'Valid prize pool amount is required';
    }
    if (!formData.totalSlots || isNaN(Number(formData.totalSlots))) {
      newErrors.totalSlots = 'Valid total slots number is required';
    }
    if (!formData.teamsPerGroup || isNaN(Number(formData.teamsPerGroup))) {
      newErrors.teamsPerGroup = 'Valid teams per group number is required';
    }
    if (!formData.registrationStart) newErrors.registrationStart = 'Registration start date is required';
    if (!formData.registrationEnd) newErrors.registrationEnd = 'Registration end date is required';
    
    if (formData.entryType === 'paid' && (!formData.entryFee || isNaN(Number(formData.entryFee)))) {
      newErrors.entryFee = 'Entry fee is required for paid tournaments';
    }
    
    if (formData.isPasswordProtected && !formData.password.trim()) {
      newErrors.password = 'Password is required for protected tournaments';
    }
    
    if (formData.isPasswordProtected && formData.password.trim().split(' ').length !== 4) {
      newErrors.password = 'Password must be exactly 4 words';
    }

    // Date validation
    const startDate = new Date(formData.registrationStart);
    const endDate = new Date(formData.registrationEnd);
    const now = new Date();

    if (startDate < now) {
      newErrors.registrationStart = 'Registration start date cannot be in the past';
    }
    if (endDate <= startDate) {
      newErrors.registrationEnd = 'Registration end date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const totalSlots = Number(formData.totalSlots);
    const teamsPerGroup = Number(formData.teamsPerGroup);
    const totalGroups = Math.floor(totalSlots / teamsPerGroup);
    const remainingTeams = totalSlots % teamsPerGroup;
    const actualGroups = remainingTeams > 0 ? totalGroups + 1 : totalGroups;
    const totalRounds = Math.ceil(Math.log2(actualGroups)) + 1; // Estimate rounds

    const tournament: Tournament = {
      id: `T${Date.now()}`,
      tournamentId: `TOUR_${formData.game.replace(/\s+/g, '').toUpperCase()}_${Date.now()}`,
      name: formData.name,
      title: formData.name,
      organizer: 'ClutchOwner', // Set default organizer, can be dynamic later
      game: formData.game,
      prizePool: Number(formData.prizePool),
      totalSlots: totalSlots,
      maxParticipants: totalSlots,
      teamsPerGroup: teamsPerGroup,
      registrationStart: formData.registrationStart,
      registrationEnd: formData.registrationEnd,
      entryType: formData.entryType,
      entryFee: formData.entryType === 'paid' ? Number(formData.entryFee) : undefined,
      status: 'open',
      createdBy: 'ClutchOwner', // In real app, get from auth context
      createdAt: new Date().toISOString(),
      registeredTeams: [],
      currentRound: 1,
      totalRounds: totalRounds,
      mode: formData.mode,
      registeredPlayers: []
    };

    addTournament(tournament);
    
    toast({
      title: "Tournament Created!",
      description: `${tournament.name} has been created successfully.`,
    });

    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            onClick={onBack}
            variant="ghost" 
            size="sm"
            className="text-white hover:bg-white/10 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Create Tournament</h1>
            <p className="text-gray-300">Set up a new league/seed style tournament</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">Tournament Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Summer Champions League"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="game" className="text-white">Game</Label>
                  <Select value={formData.game} onValueChange={(value) => handleInputChange('game', value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select a game" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {games.map(game => (
                        <SelectItem key={game} value={game} className="text-white">
                          {game}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.game && <p className="text-red-400 text-sm mt-1">{errors.game}</p>}
                </div>

                <div>
                  <Label htmlFor="mode" className="text-white">Tournament Type</Label>
                  <Select value={formData.mode} onValueChange={(value) => handleInputChange('mode', value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select tournament type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="solo" className="text-white">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Solo (1 Player)
                        </div>
                      </SelectItem>
                      <SelectItem value="duo" className="text-white">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Duo (2 Players)
                        </div>
                      </SelectItem>
                      <SelectItem value="squad" className="text-white">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Squad (4+ Players)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Tournament description..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tournament Settings */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-500" />
                  Tournament Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="prizePool" className="text-white">Prize Pool (₹)</Label>
                  <Input
                    id="prizePool"
                    type="number"
                    value={formData.prizePool}
                    onChange={(e) => handleInputChange('prizePool', e.target.value)}
                    placeholder="50000"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  {errors.prizePool && <p className="text-red-400 text-sm mt-1">{errors.prizePool}</p>}
                </div>

                <div>
                  <Label htmlFor="totalSlots" className="text-white">Total Slots</Label>
                  <Input
                    id="totalSlots"
                    type="number"
                    value={formData.totalSlots}
                    onChange={(e) => handleInputChange('totalSlots', e.target.value)}
                    placeholder="400"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  {errors.totalSlots && <p className="text-red-400 text-sm mt-1">{errors.totalSlots}</p>}
                </div>

                <div>
                  <Label htmlFor="teamsPerGroup" className="text-white">Teams per Group</Label>
                  <Input
                    id="teamsPerGroup"
                    type="number"
                    value={formData.teamsPerGroup}
                    onChange={(e) => handleInputChange('teamsPerGroup', e.target.value)}
                    placeholder="12"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  {errors.teamsPerGroup && <p className="text-red-400 text-sm mt-1">{errors.teamsPerGroup}</p>}
                </div>

                {/* Group Calculation Display */}
                {formData.totalSlots && formData.teamsPerGroup && (
                  <div className="p-3 bg-blue-900/30 border border-blue-700 rounded-md">
                    <p className="text-blue-300 text-sm">
                      <strong>Groups:</strong> {Math.floor(Number(formData.totalSlots) / Number(formData.teamsPerGroup))} full groups
                      {Number(formData.totalSlots) % Number(formData.teamsPerGroup) > 0 && (
                        <span> + 1 group with {Number(formData.totalSlots) % Number(formData.teamsPerGroup)} teams</span>
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Registration Period */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-500" />
                  Registration Period
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="registrationStart" className="text-white">Start Date & Time</Label>
                  <Input
                    id="registrationStart"
                    type="datetime-local"
                    value={formData.registrationStart}
                    onChange={(e) => handleInputChange('registrationStart', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  {errors.registrationStart && <p className="text-red-400 text-sm mt-1">{errors.registrationStart}</p>}
                </div>

                <div>
                  <Label htmlFor="registrationEnd" className="text-white">End Date & Time</Label>
                  <Input
                    id="registrationEnd"
                    type="datetime-local"
                    value={formData.registrationEnd}
                    onChange={(e) => handleInputChange('registrationEnd', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  {errors.registrationEnd && <p className="text-red-400 text-sm mt-1">{errors.registrationEnd}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Entry Settings */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-yellow-500" />
                  Entry Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={formData.entryType === 'paid'}
                    onCheckedChange={(checked) => 
                      handleInputChange('entryType', checked ? 'paid' : 'free')
                    }
                  />
                  <Label className="text-white">
                    {formData.entryType === 'paid' ? 'Paid Entry' : 'Free Entry'}
                  </Label>
                </div>

                {formData.entryType === 'paid' && (
                  <div>
                    <Label htmlFor="entryFee" className="text-white">Entry Fee (₹)</Label>
                    <Input
                      id="entryFee"
                      type="number"
                      value={formData.entryFee}
                      onChange={(e) => handleInputChange('entryFee', e.target.value)}
                      placeholder="500"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    {errors.entryFee && <p className="text-red-400 text-sm mt-1">{errors.entryFee}</p>}
                  </div>
                )}
                
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={formData.isPasswordProtected}
                      onCheckedChange={(checked) => 
                        handleInputChange('isPasswordProtected', checked)
                      }
                    />
                    <Label className="text-white flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Password Protected Tournament
                    </Label>
                  </div>
                  
                  {formData.isPasswordProtected && (
                    <div className="mt-3">
                      <Label htmlFor="password" className="text-white">4-Word Password</Label>
                      <Input
                        id="password"
                        type="text"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="alpha beta gamma delta"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <p className="text-gray-400 text-xs mt-1">Enter exactly 4 words separated by spaces</p>
                      {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
            >
              Create Tournament
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TournamentCreation;