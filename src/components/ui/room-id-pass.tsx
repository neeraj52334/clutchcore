import React, { useState } from 'react';
import { Key, Eye, EyeOff, Copy, CheckCircle, Gamepad2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Badge } from './badge';

interface RoomIdPassProps {
  title: string;
  roomId?: string;
  password?: string;
  isPublished?: boolean;
  isOwner: boolean;
  onPublish?: (roomId: string, password: string) => void;
  className?: string;
}

export const RoomIdPass: React.FC<RoomIdPassProps> = ({
  title,
  roomId,
  password,
  isPublished = false,
  isOwner,
  onPublish,
  className = ""
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [newRoomId, setNewRoomId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePublish = () => {
    if (newRoomId.trim() && newPassword.trim() && onPublish) {
      onPublish(newRoomId.trim(), newPassword.trim());
      setIsEditing(false);
      setNewRoomId('');
      setNewPassword('');
    }
  };

  if (!isPublished && !isOwner) {
    return (
      <Card className={`bg-gray-800/50 border-gray-700 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-center py-6">
            <div className="text-center">
              <Gamepad2 className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Room ID & Password will be shared soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gray-800/50 border-gray-700 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center">
          <Key className="w-5 h-5 mr-2 text-blue-400" />
          {title}
          {isPublished && (
            <Badge variant="secondary" className="ml-2 bg-green-600 text-white">
              Published
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPublished ? (
          <>
            {/* Published Room Details */}
            <div className="space-y-3">
              <div>
                <Label className="text-gray-300 text-sm">Room ID</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex-1 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                    <span className="text-white font-mono text-lg">{roomId}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(roomId || '', 'roomId')}
                    className="border-gray-600 hover:bg-gray-700"
                  >
                    {copiedField === 'roomId' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-gray-300 text-sm">Password</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex-1 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                    <span className="text-white font-mono text-lg">
                      {showPassword ? password : '••••••••'}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowPassword(!showPassword)}
                    className="border-gray-600 hover:bg-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(password || '', 'password')}
                    className="border-gray-600 hover:bg-gray-700"
                  >
                    {copiedField === 'password' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : isOwner ? (
          <>
            {/* Owner Publish Form */}
            {!isEditing ? (
              <div className="text-center py-4">
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Publish Room ID & Password
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Room ID</Label>
                  <Input
                    value={newRoomId}
                    onChange={(e) => setNewRoomId(e.target.value)}
                    placeholder="Enter room ID"
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Password</Label>
                  <Input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter password"
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={handlePublish}
                    disabled={!newRoomId.trim() || !newPassword.trim()}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Publish
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setNewRoomId('');
                      setNewPassword('');
                    }}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};