import { useState } from 'react';
import { Lock, X } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface TournamentPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  tournamentName: string;
}

export const TournamentPasswordDialog = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  tournamentName 
}: TournamentPasswordDialogProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const words = password.trim().split(' ').filter(word => word.length > 0);
    if (words.length !== 4) {
      setError('Password must be exactly 4 words');
      return;
    }
    
    onSubmit(password.trim());
    setPassword('');
    setError('');
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Lock className="w-5 h-5 mr-2 text-yellow-500" />
              Password Required
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-300 text-sm">
              <span className="font-medium">{tournamentName}</span> is password protected. 
              Enter the 4-word password to register.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="tournament-password" className="text-white">
                  Tournament Password
                </Label>
                <Input
                  id="tournament-password"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="alpha beta gamma delta"
                  className="bg-gray-700 border-gray-600 text-white"
                  autoFocus
                />
                <p className="text-gray-400 text-xs mt-1">
                  Enter exactly 4 words separated by spaces
                </p>
                {error && (
                  <p className="text-red-400 text-sm mt-1">{error}</p>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!password.trim()}
                >
                  Submit Password
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-gray-600 text-gray-400 hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};