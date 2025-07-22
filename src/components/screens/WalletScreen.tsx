
import { useState } from 'react';
import { ArrowLeft, Plus, Minus, CreditCard, Smartphone, Building, History, TrendingUp, TrendingDown } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';

interface WalletScreenProps {
  onBack: () => void;
}

const WalletScreen = ({ onBack }: WalletScreenProps) => {
  const { balance, transactions, addMoney, withdrawMoney } = useWallet();
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const handleAddMoney = async () => {
    try {
      await addMoney(parseFloat(amount));
      setAmount('');
      setShowAddMoney(false);
    } catch (error) {
      console.error('Failed to add money:', error);
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdrawMoney(parseFloat(amount));
      setAmount('');
      setShowWithdraw(false);
    } catch (error) {
      console.error('Failed to withdraw money:', error);
      alert('Insufficient balance or withdrawal error');
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'withdrawal':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'winnings':
        return <TrendingUp className="w-4 h-4 text-yellow-400" />;
      default:
        return <TrendingDown className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTransactionColor = (type: string, amount: number) => {
    if (amount > 0) return 'text-green-400';
    return 'text-red-400';
  };

  const formatTransactionType = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Money Added';
      case 'withdrawal':
        return 'Withdrawal';
      case 'challenge_entry':
        return 'Challenge Entry';
      case 'tournament_entry':
        return 'Tournament Entry';
      case 'winnings':
        return 'Winnings';
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-white">Wallet</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
          <CardContent className="p-6 text-center">
            <p className="text-blue-100 text-sm mb-2">Current Balance</p>
            <p className="text-4xl font-bold text-white mb-4">₹{balance.toLocaleString()}</p>
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowAddMoney(true)}
                className="flex-1 bg-white text-blue-600 hover:bg-gray-100 flex items-center justify-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Money</span>
              </Button>
              <Button
                onClick={() => setShowWithdraw(true)}
                variant="outline"
                className="flex-1 border-white text-white hover:bg-white hover:text-blue-600 flex items-center justify-center space-x-1"
              >
                <Minus className="w-4 h-4" />
                <span>Withdraw</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <CreditCard className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-white text-sm font-medium">UPI</p>
              <p className="text-xs text-gray-400">Instant</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <Building className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Bank</p>
              <p className="text-xs text-gray-400">1-2 days</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <Smartphone className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Wallet</p>
              <p className="text-xs text-gray-400">Instant</p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <History className="w-5 h-5 mr-2 text-gray-400" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="text-white font-medium">{formatTransactionType(transaction.type)}</p>
                    <p className="text-sm text-gray-400">
                      {transaction.timestamp.toLocaleDateString()} at {transaction.timestamp.toLocaleTimeString()}
                    </p>
                    {transaction.relatedId && (
                      <p className="text-xs text-gray-500">ID: {transaction.relatedId}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${getTransactionColor(transaction.type, transaction.amount)}`}>
                    {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount)}
                  </p>
                  <Badge 
                    variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                    className={`text-xs ${
                      transaction.status === 'completed' ? 'bg-green-600' : 
                      transaction.status === 'pending' ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white">Add Money</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Amount (₹)</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-700">
                  <TabsTrigger value="upi" className="text-white data-[state=active]:bg-blue-600">UPI</TabsTrigger>
                  <TabsTrigger value="card" className="text-white data-[state=active]:bg-blue-600">Card</TabsTrigger>
                  <TabsTrigger value="netbanking" className="text-white data-[state=active]:bg-blue-600">Bank</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upi" className="mt-4">
                  <div className="space-y-2">
                    <Label className="text-white">UPI ID</Label>
                    <Input
                      placeholder="your-upi-id@paytm"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="card" className="mt-4">
                  <div className="space-y-2">
                    <Label className="text-white">Card Number</Label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="netbanking" className="mt-4">
                  <div className="space-y-2">
                    <Label className="text-white">Select Bank</Label>
                    <Input
                      placeholder="Choose your bank"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddMoney(false)}
                  className="flex-1 border-gray-600 text-gray-400"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddMoney}
                  disabled={!amount}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Add ₹{amount}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white">Withdraw Money</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Amount (₹)</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <p className="text-sm text-gray-400">Available: ₹{balance.toLocaleString()}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Bank Account</Label>
                <Input
                  placeholder="Account Number"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">IFSC Code</Label>
                <Input
                  placeholder="IFSC Code"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowWithdraw(false)}
                  className="flex-1 border-gray-600 text-gray-400"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleWithdraw}
                  disabled={!amount || parseFloat(amount) > balance}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Withdraw ₹{amount}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WalletScreen;
