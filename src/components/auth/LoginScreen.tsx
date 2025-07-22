
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Gamepad2, Users, Shield, Trophy, Zap, Star } from 'lucide-react';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password, username);
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Hero Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-green-400 p-3 rounded-2xl">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Clutch<span className="text-blue-400">Core</span>
          </h1>
          <p className="text-gray-300 text-lg">India's Premier Esports Platform</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center">
            <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-white text-sm font-medium">Secure Prizes</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center">
            <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-white text-sm font-medium">Tournaments</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center">
            <Shield className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-white text-sm font-medium">Trusted</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center">
            <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-white text-sm font-medium">Fast Payouts</p>
          </div>
        </div>

        {/* Auth Form */}
        <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Join the Competition</CardTitle>
            <CardDescription className="text-gray-300">
              Enter the world of competitive gaming
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                <TabsTrigger value="login" className="text-white data-[state=active]:bg-blue-600">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-white data-[state=active]:bg-blue-600">
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose your gamer tag"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Secure • Trusted • Gaming-First Platform for India
          </p>
          <div className="flex items-center justify-center mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
            <span className="text-gray-300 text-sm ml-2">Trusted by 10,000+ gamers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
