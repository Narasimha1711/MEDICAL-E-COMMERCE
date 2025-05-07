import { useState } from 'react';
import { FiHeart, FiMessageSquare, FiShare2 } from 'react-icons/fi';

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [likes, setLikes] = useState(post.likes || 0);

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:9001/api/posts/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setLikes(data.likes);
      setIsLiked(true);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (comment) => {
    try {
      const response = await fetch(`http://localhost:9001/api/posts/${post._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: comment.author,
          content: comment.content
        })
      });
      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-xl shadow-soft hover:shadow-glow transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
      {post.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center mb-4">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 rounded-full border-2 border-primary-200"
          />
          <div className="ml-3">
            <h3 className="font-medium text-gray-900">{post.author.name}</h3>
            <p className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
          </div>
        </div>

        <h2 className="text-xl font-serif font-bold mb-3 text-gray-900 hover:text-primary-600 transition-colors">
          {post.title}
        </h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          {truncateText(post.content, 200)}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-800 
                         rounded-full text-sm font-medium hover:from-primary-200 hover:to-secondary-200 
                         transition-colors duration-200 cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>

      
        
      </div>
    </div>
  );
};

export default PostCard;