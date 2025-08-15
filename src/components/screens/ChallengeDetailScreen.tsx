import { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Upload, Trophy, Clock, User, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../integrations/supabase/client';

interface ChallengeDetailScreenProps {
  challengeId: string;
  onBack: () => void;
}

interface Challenge {
  id: string;
  creator_id: string;
  game: string;
  type: string;
  entry_fee: number;
  challenge_id: string;
  status: string;
  opponent_id?: string;
  room_id?: string;
  room_password?: string;
  winner_id?: string;
  created_at: string;
}

interface ChatMessage {
  id: string;
  user_id: string;
  message?: string;
  image_url?: string;
  created_at: string;
}

const ChallengeDetailScreen = ({ challengeId, onBack }: ChallengeDetailScreenProps) => {
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomId, setRoomId] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallengeDetails();
    fetchChatMessages();
  }, [challengeId]);

  const fetchChallengeDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('challenge_id', challengeId)
        .single();

      if (error) throw error;
      setChallenge(data);
      if (data.room_id) setRoomId(data.room_id);
      if (data.room_password) setRoomPassword(data.room_password);
    } catch (error) {
      console.error('Error fetching challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('challenge_chat')
        .select('*')
        .eq('challenge_id', challengeId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setChatMessages(data || []);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !challenge) return;

    try {
      const { error } = await supabase
        .from('challenge_chat')
        .insert({
          challenge_id: challenge.id,
          user_id: user.id,
          message: newMessage
        });

      if (error) throw error;
      setNewMessage('');
      fetchChatMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const updateRoomDetails = async () => {
    if (!challenge || !user) return;

    try {
      const { error } = await supabase
        .from('challenges')
        .update({
          room_id: roomId,
          room_password: roomPassword
        })
        .eq('id', challenge.id);

      if (error) throw error;
      setChallenge(prev => prev ? { ...prev, room_id: roomId, room_password: roomPassword } : null);
    } catch (error) {
      console.error('Error updating room details:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        <div className="text-white">Loading challenge details...</div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="p-4">
        <div className="text-center text-white">Challenge not found</div>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const isCreator = user?.id === challenge.creator_id;
  const isOpponent = user?.id === challenge.opponent_id;
  const isParticipant = isCreator || isOpponent;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="border-gray-600 text-gray-400">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Badge className={
          challenge.status === 'open' ? 'bg-yellow-600' :
          challenge.status === 'accepted' ? 'bg-green-600' :
          challenge.status === 'completed' ? 'bg-blue-600' : 'bg-gray-600'
        }>
          {challenge.status}
        </Badge>
      </div>

      {/* Challenge Info */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
            {challenge.game} {challenge.type}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Challenge ID:</span>
              <span className="text-white font-mono text-sm">{challenge.challenge_id}</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Entry Fee:</span>
              <span className="text-green-400 font-medium">₹{challenge.entry_fee}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Created:</span>
              <span className="text-white text-sm">{new Date(challenge.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Details - Only visible to participants */}
      {isParticipant && challenge.status === 'accepted' && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Room Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Room ID</label>
                <Input
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter room ID"
                  className="bg-gray-700 border-gray-600 text-white"
                  disabled={!isCreator}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Password</label>
                <Input
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  placeholder="Enter password"
                  className="bg-gray-700 border-gray-600 text-white"
                  disabled={!isCreator}
                />
              </div>
            </div>
            {isCreator && (
              <Button onClick={updateRoomDetails} className="bg-blue-600 hover:bg-blue-700">
                Update Room Details
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Chat Section - Only visible to participants */}
      {isParticipant && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-64 overflow-y-auto space-y-2 bg-gray-700 rounded-lg p-3">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-2 rounded-lg ${
                      message.user_id === user?.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-600 text-white'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      {message.image_url && (
                        <img src={message.image_url} alt="Screenshot" className="mt-2 rounded max-w-full" />
                      )}
                      <p className="text-xs text-gray-300 mt-1">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="bg-gray-700 border-gray-600 text-white flex-1"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700">
                Send
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-400">
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChallengeDetailScreen;