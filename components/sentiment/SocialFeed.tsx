import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react';

interface SocialPost {
  id: string;
  username: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  timestamp: string;
}

interface SocialFeedProps {
  player: string;
  posts: SocialPost[];
}

const SocialFeed: React.FC<SocialFeedProps> = ({ player, posts }) => {
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');

  const filteredPosts = posts.filter(post => 
    filter === 'all' || post.sentiment === filter
  );

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{player} Social Feed</CardTitle>
        <div className="flex space-x-2 mt-2">
          {['all', 'positive', 'negative', 'neutral'].map(sentimentFilter => (
            <button 
              key={sentimentFilter}
              onClick={() => setFilter(sentimentFilter as any)}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === sentimentFilter 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {sentimentFilter.charAt(0).toUpperCase() + sentimentFilter.slice(1)}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {filteredPosts.map(post => (
          <div 
            key={post.id} 
            className="border-b py-3 last:border-b-0 flex items-start space-x-3"
          >
            <MessageCircle className="text-gray-500 mt-1" size={20} />
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="font-semibold">{post.username}</span>
                <span className={`text-sm ${getSentimentColor(post.sentiment)}`}>
                  {post.sentiment.charAt(0).toUpperCase() + post.sentiment.slice(1)}
                </span>
              </div>
              <p className="text-gray-700 mt-1">{post.content}</p>
              <div className="flex items-center space-x-3 mt-2 text-sm text-gray-500">
                <span>{post.timestamp}</span>
                <div className="flex items-center space-x-2">
                  <ThumbsUp size={16} className="cursor-pointer hover:text-blue-500" />
                  <ThumbsDown size={16} className="cursor-pointer hover:text-red-500" />
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredPosts.length === 0 && (
          <p className="text-center text-gray-500 py-4">No posts found</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialFeed;