
import { useState, useEffect } from 'react';
import * as React from 'react';
import { Trophy, Users, Clock, Star, TrendingUp, Gamepad2, Plus, MessageSquare, Heart, Reply, Send, AtSign, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useAuth } from '../../contexts/AuthContext';
import { useWallet } from '../../contexts/WalletContext';
import { useToast } from '../../hooks/use-toast';
import { useChallenges } from '../../contexts/ChallengeContext';



const HomeScreen = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { balance, deductMoney } = useWallet();
  const { challenges, addChallenge, joinChallenge } = useChallenges();
  const [userPosts, setUserPosts] = useState([
    {
      id: 1,
      username: 'ProGamer123',
      avatar: '',
      message: 'Just won my first VALORANT tournament! 🏆 Thanks to @SkillzMaster for the practice sessions',
      timestamp: '2 hours ago',
      likes: 24,
      comments: [
        {
          id: 1,
          username: 'SkillzMaster',
          avatar: '',
          message: 'Congrats bro! @ProGamer123 you deserved it 💪',
          timestamp: '1 hour ago',
          likes: 5,
          replies: [
            {
              id: 1,
              username: 'ProGamer123',
              avatar: '',
              message: '@SkillzMaster Thanks man! Couldn\'t have done it without you',
              timestamp: '45 mins ago',
              likes: 2
            }
          ]
        },
        {
          id: 2,
          username: 'GameMaster99',
          avatar: '',
          message: 'Well played! 🔥',
          timestamp: '30 mins ago',
          likes: 3,
          replies: []
        }
      ]
    },
    {
      id: 2,
      username: 'SkillzMaster',
      avatar: '',
      message: 'Looking for squad members for tonight\'s Free Fire tournament. DM me! @everyone',
      timestamp: '5 hours ago',
      likes: 12,
      comments: [
        {
          id: 3,
          username: 'FFPro2024',
          avatar: '',
          message: 'I\'m interested! @SkillzMaster',
          timestamp: '4 hours ago',
          likes: 1,
          replies: []
        }
      ]
    }
  ]);
  const [newPost, setNewPost] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [commentInputs, setCommentInputs] = useState<{[key: string]: string}>({});
  const [replyInputs, setReplyInputs] = useState<{[key: string]: string}>({});
  const [showComments, setShowComments] = useState<{[key: number]: boolean}>({});
  const [showReplies, setShowReplies] = useState<{[key: string]: boolean}>({});
  const [activeReplyTo, setActiveReplyTo] = useState<string | null>(null);
  
  // Mock users for tagging
  const availableUsers = [
    'ProGamer123', 'SkillzMaster', 'GameMaster99', 'FFPro2024', 'ValorantAce', 
    'HeadShotKing', 'SquadLeader', 'TournamentWinner', 'EsportsChamp'
  ];
  
  const trendingTournaments = [
    {
      id: 1,
      title: "VALORANT Championship",
      organizer: "ESL India",
      entryFee: 500,
      prizePool: 50000,
      participants: 64,
      maxParticipants: 128,
      deadline: "2 days left",
      image: "/placeholder.svg",
      type: "official"
    },
    {
      id: 2,
      title: "Free Fire Masters",
      organizer: "GameOn Esports",
      entryFee: 250,
      prizePool: 25000,
      participants: 89,
      maxParticipants: 100,
      deadline: "5 hours left",
      image: "/placeholder.svg",
      type: "official"
    },
    {
      id: 3,
      title: "Elite Gaming Hub PUBG Tournament",
      organizer: "Elite Gaming Hub",
      entryFee: 300,
      prizePool: 15000,
      participants: 24,
      maxParticipants: 50,
      deadline: "1 day left",
      image: "/placeholder.svg",
      type: "community"
    }
  ];

  // Get recent challenges from context (latest 10)
  const recentChallenges = challenges.slice(0, 10);

  const stories = [
    { id: 1, title: "Tournament Highlights", image: "/placeholder.svg", route: "compete" },
    { id: 2, title: "New Updates", image: "/placeholder.svg", route: "profile" },
    { id: 3, title: "Pro Tips", image: "/placeholder.svg", route: "search" },
    { id: 4, title: "Community", image: "/placeholder.svg", route: "compete" }
  ];

  const handleStoryClick = (route: string) => {
    // In a real app, this would use router navigation
    console.log(`Navigate to ${route}`);
  };

  const handleRegisterTournament = (tournament: any) => {
    if (tournament.entryFee === 0) {
      // Free tournament - just confirm registration
      if (confirm('Register for this free tournament?')) {
        alert('Successfully registered for the tournament!');
      }
    } else {
      // Paid tournament - check wallet balance
      if (balance >= tournament.entryFee) {
        if (confirm(`Pay ₹${tournament.entryFee} to register for this tournament?`)) {
          deductMoney(tournament.entryFee, 'tournament_entry', tournament.id.toString());
          alert('Payment successful! You are now registered for the tournament.');
        }
      } else {
        alert('Insufficient wallet balance. Please add funds to your wallet.');
      }
    }
  };

  const handleCreatePost = () => {
    if (newPost.trim() && user) {
      const post = {
        id: userPosts.length + 1,
        username: user.username,
        avatar: user.avatar || '',
        message: newPost,
        timestamp: 'now',
        likes: 0,
        comments: []
      };
      setUserPosts([post, ...userPosts]);
      setNewPost('');
      setShowPostModal(false);
    }
  };

  const handleLikePost = (postId: number) => {
    setUserPosts(posts => posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const handleLikeComment = (postId: number, commentId: number) => {
    setUserPosts(posts => posts.map(post => 
      post.id === postId ? {
        ...post,
        comments: post.comments.map(comment =>
          comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
        )
      } : post
    ));
  };

  const handleLikeReply = (postId: number, commentId: number, replyId: number) => {
    setUserPosts(posts => posts.map(post => 
      post.id === postId ? {
        ...post,
        comments: post.comments.map(comment =>
          comment.id === commentId ? {
            ...comment,
            replies: comment.replies.map(reply =>
              reply.id === replyId ? { ...reply, likes: reply.likes + 1 } : reply
            )
          } : comment
        )
      } : post
    ));
  };

  const handleAddComment = (postId: number) => {
    const commentText = commentInputs[`post-${postId}`]?.trim();
    if (commentText && user) {
      const newComment = {
        id: Date.now(),
        username: user.username,
        avatar: user.avatar || '',
        message: commentText,
        timestamp: 'now',
        likes: 0,
        replies: []
      };

      setUserPosts(posts => posts.map(post => 
        post.id === postId ? {
          ...post,
          comments: [...post.comments, newComment]
        } : post
      ));

      setCommentInputs(prev => ({ ...prev, [`post-${postId}`]: '' }));
    }
  };

  const handleAddReply = (postId: number, commentId: number) => {
    const replyText = replyInputs[`comment-${commentId}`]?.trim();
    if (replyText && user) {
      const newReply = {
        id: Date.now(),
        username: user.username,
        avatar: user.avatar || '',
        message: replyText,
        timestamp: 'now',
        likes: 0
      };

      setUserPosts(posts => posts.map(post => 
        post.id === postId ? {
          ...post,
          comments: post.comments.map(comment =>
            comment.id === commentId ? {
              ...comment,
              replies: [...comment.replies, newReply]
            } : comment
          )
        } : post
      ));

      setReplyInputs(prev => ({ ...prev, [`comment-${commentId}`]: '' }));
      setActiveReplyTo(null);
    }
  };

  const toggleComments = (postId: number) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleReplies = (commentId: number) => {
    const key = `comment-${commentId}`;
    setShowReplies(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTagUser = (username: string, type: 'post' | 'comment' | 'reply', id?: string) => {
    const tag = `@${username} `;
    if (type === 'post') {
      setNewPost(prev => prev + tag);
    } else if (type === 'comment' && id) {
      setCommentInputs(prev => ({ ...prev, [id]: (prev[id] || '') + tag }));
    } else if (type === 'reply' && id) {
      setReplyInputs(prev => ({ ...prev, [id]: (prev[id] || '') + tag }));
    }
  };

  const renderTextWithTags = (text: string) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const username = part.slice(1);
        if (availableUsers.includes(username)) {
          return (
            <span key={index} className="text-blue-400 font-medium hover:underline cursor-pointer">
              {part}
            </span>
          );
        }
      }
      return part;
    });
  };

  const handleJoinChallenge = async (challenge: any) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to join challenges",
        variant: "destructive"
      });
      return;
    }

    const entryPrice = challenge.entryPrices[0]?.price || 0;
    
    if (entryPrice === 0) {
      // Free challenge
      if (confirm(`Join ${challenge.creator}'s ${challenge.game} challenge?`)) {
        joinChallenge(challenge.challengeId, user.username);
        toast({
          title: "Challenge Joined!",
          description: `Successfully joined ${challenge.challengeId}`,
        });
        console.log('Successfully joined challenge:', challenge.challengeId);
      }
    } else {
      // Paid challenge
      if (balance >= entryPrice) {
        if (confirm(`Pay ₹${entryPrice} to join ${challenge.creator}'s ${challenge.game} challenge?`)) {
          try {
            deductMoney(entryPrice, 'challenge_entry', challenge.challengeId);
            joinChallenge(challenge.challengeId, user.username);
            toast({
              title: "Challenge Joined!",
              description: `Successfully joined ${challenge.challengeId} for ₹${entryPrice}`,
            });
            console.log('Successfully joined challenge:', challenge.challengeId);
          } catch (error) {
            toast({
              title: "Payment Failed",
              description: "Failed to process payment",
              variant: "destructive"
            });
          }
        }
      } else {
        toast({
          title: "Insufficient Balance",
          description: "Please add funds to your wallet",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Create Post Section */}
      {user && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {user.username[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button 
                variant="outline" 
                onClick={() => setShowPostModal(true)}
                className="flex-1 justify-start text-gray-400 border-gray-600 hover:bg-gray-700"
              >
                What's on your mind, {user.username}?
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Create Post
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Share your thoughts... Use @username to tag people"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
              />
              
              {/* Quick Tag Suggestions */}
              <div className="flex flex-wrap gap-1">
                <span className="text-xs text-gray-400 mr-2">Quick tags:</span>
                {availableUsers.slice(0, 5).map(username => (
                  <Button
                    key={username}
                    size="sm"
                    variant="ghost"
                    onClick={() => handleTagUser(username, 'post')}
                    className="text-xs text-blue-400 hover:bg-blue-600/20 p-1 h-auto"
                  >
                    @{username}
                  </Button>
                ))}
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => setShowPostModal(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-400"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreatePost}
                  disabled={!newPost.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User Posts Feed */}
      {userPosts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
            Community Posts
          </h2>
          <div className="space-y-3">
            {userPosts.map((post) => (
              <Card key={post.id} className="bg-gray-800 border-gray-700 animate-fade-in">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.avatar} />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {post.username[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="font-medium text-white">{post.username}</p>
                        <p className="text-xs text-gray-400">{post.timestamp}</p>
                        <Button variant="ghost" size="sm" className="ml-auto p-1 h-auto">
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                      
                      <p className="text-gray-300 mb-3">
                        {renderTextWithTags(post.message)}
                      </p>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleLikePost(post.id)}
                          className="text-gray-400 hover:text-red-400 p-0 hover-scale"
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          {post.likes}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleComments(post.id)}
                          className="text-gray-400 hover:text-blue-400 p-0 hover-scale"
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {post.comments.length}
                        </Button>
                      </div>

                      {/* Comments Section */}
                      {showComments[post.id] && (
                        <div className="space-y-3 animate-fade-in">
                          {/* Add Comment Input */}
                          <div className="flex space-x-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={user?.avatar} />
                              <AvatarFallback className="bg-blue-600 text-white text-sm">
                                {user?.username[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex space-x-2">
                              <Input
                                placeholder="Write a comment... Use @username to tag"
                                value={commentInputs[`post-${post.id}`] || ''}
                                onChange={(e) => setCommentInputs(prev => ({ ...prev, [`post-${post.id}`]: e.target.value }))}
                                className="bg-gray-700 border-gray-600 text-white text-sm"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                              />
                              <Button
                                size="sm"
                                onClick={() => handleAddComment(post.id)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Quick Tag for Comments */}
                          <div className="flex space-x-1 ml-10">
                            {availableUsers.slice(0, 3).map(username => (
                              <Button
                                key={username}
                                size="sm"
                                variant="ghost"
                                onClick={() => handleTagUser(username, 'comment', `post-${post.id}`)}
                                className="text-xs text-blue-400 hover:bg-blue-600/20 p-1 h-auto"
                              >
                                @{username}
                              </Button>
                            ))}
                          </div>

                          {/* Comments List */}
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="ml-4 space-y-2 animate-scale-in">
                              <div className="flex items-start space-x-2">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={comment.avatar} />
                                  <AvatarFallback className="bg-green-600 text-white text-sm">
                                    {comment.username[0]?.toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 bg-gray-700 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <p className="font-medium text-white text-sm">{comment.username}</p>
                                    <p className="text-xs text-gray-400">{comment.timestamp}</p>
                                  </div>
                                  <p className="text-gray-300 text-sm">
                                    {renderTextWithTags(comment.message)}
                                  </p>
                                  
                                  <div className="flex items-center space-x-3 mt-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleLikeComment(post.id, comment.id)}
                                      className="text-gray-400 hover:text-red-400 p-0 text-xs hover-scale"
                                    >
                                      <Heart className="w-3 h-3 mr-1" />
                                      {comment.likes}
                                    </Button>
                                    
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setActiveReplyTo(activeReplyTo === `comment-${comment.id}` ? null : `comment-${comment.id}`)}
                                      className="text-gray-400 hover:text-blue-400 p-0 text-xs hover-scale"
                                    >
                                      <Reply className="w-3 h-3 mr-1" />
                                      Reply
                                    </Button>
                                    
                                    {comment.replies.length > 0 && (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => toggleReplies(comment.id)}
                                        className="text-gray-400 hover:text-purple-400 p-0 text-xs hover-scale"
                                      >
                                        {showReplies[`comment-${comment.id}`] ? 'Hide' : 'Show'} {comment.replies.length} replies
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Reply Input */}
                              {activeReplyTo === `comment-${comment.id}` && (
                                <div className="ml-10 flex space-x-2 animate-fade-in">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={user?.avatar} />
                                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                                      {user?.username[0]?.toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 flex space-x-2">
                                    <Input
                                      placeholder={`Reply to @${comment.username}...`}
                                      value={replyInputs[`comment-${comment.id}`] || ''}
                                      onChange={(e) => setReplyInputs(prev => ({ ...prev, [`comment-${comment.id}`]: e.target.value }))}
                                      className="bg-gray-600 border-gray-500 text-white text-sm"
                                      onKeyPress={(e) => e.key === 'Enter' && handleAddReply(post.id, comment.id)}
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => handleAddReply(post.id, comment.id)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <Send className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {/* Replies */}
                              {showReplies[`comment-${comment.id}`] && comment.replies.map((reply) => (
                                <div key={reply.id} className="ml-10 flex items-start space-x-2 animate-scale-in">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={reply.avatar} />
                                    <AvatarFallback className="bg-purple-600 text-white text-xs">
                                      {reply.username[0]?.toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 bg-gray-600 rounded-lg p-2">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <p className="font-medium text-white text-sm">{reply.username}</p>
                                      <p className="text-xs text-gray-400">{reply.timestamp}</p>
                                    </div>
                                    <p className="text-gray-300 text-sm">
                                      {renderTextWithTags(reply.message)}
                                    </p>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleLikeReply(post.id, comment.id, reply.id)}
                                      className="text-gray-400 hover:text-red-400 p-0 text-xs mt-1 hover-scale"
                                    >
                                      <Heart className="w-3 h-3 mr-1" />
                                      {reply.likes}
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Stories Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
          Trending Now
        </h2>
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {stories.map((story) => (
            <div 
              key={story.id} 
              className="flex-shrink-0 cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => handleStoryClick(story.route)}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                  <span className="text-xs text-white font-medium text-center px-1">
                    {story.title.split(' ')[0]}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 text-center mt-1 max-w-16 truncate">
                {story.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Tournaments */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
          Featured Tournaments
        </h2>
        <div className="space-y-4">
          {trendingTournaments.map((tournament) => (
            <Card key={tournament.id} className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="relative">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <div className="absolute top-2 right-2 flex flex-col space-y-1">
                  <Badge className="bg-red-500 text-white">
                    <Clock className="w-3 h-3 mr-1" />
                    {tournament.deadline}
                  </Badge>
                  {tournament.type === 'community' && (
                    <Badge className="bg-purple-500 text-white text-xs">
                      Community
                    </Badge>
                  )}
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
                    {tournament.participants}/{tournament.maxParticipants}
                  </span>
                  <span>Entry: ₹{tournament.entryFee}</span>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
                  ></div>
                </div>
                
                <Button 
                  onClick={() => handleRegisterTournament(tournament)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Register Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Challenges */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <Gamepad2 className="w-5 h-5 mr-2 text-green-400" />
          Recent Challenges
        </h2>
        <div className="space-y-3">
          {recentChallenges.map((challenge) => (
            <Card key={challenge.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={challenge.avatar} />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {challenge.creator[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">{challenge.creator}</p>
                      <p className="text-sm text-gray-400">{challenge.timePosted}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {challenge.game}
                  </Badge>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{challenge.type}</span>
                    <span>ID: {challenge.challengeId}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex flex-wrap gap-1">
                      {challenge.entryPrices.map((entry, idx) => (
                        <span key={idx} className="text-green-400 font-medium text-xs">
                          ₹{entry.price}
                        </span>
                      ))}
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleJoinChallenge(challenge)}
                    >
                      Join
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Social Activity */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <Star className="w-5 h-5 mr-2 text-purple-400" />
          Recent Activity
        </h2>
        <div className="space-y-2">
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-sm text-gray-300">
              <span className="text-blue-400 font-medium">ProGamer123</span> won the 1v1 VALORANT challenge
            </p>
            <p className="text-xs text-gray-500 mt-1">5 minutes ago</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-sm text-gray-300">
              <span className="text-green-400 font-medium">SkillzMaster</span> joined Free Fire Masters tournament
            </p>
            <p className="text-xs text-gray-500 mt-1">15 minutes ago</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-sm text-gray-300">
              <span className="text-purple-400 font-medium">ESL India</span> announced new tournament
            </p>
            <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomeScreen;
