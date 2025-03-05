import { useState } from 'react';
import { FiHeart, FiMessageSquare, FiShare2 } from 'react-icons/fi';

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

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

        <div className="flex justify-between items-center border-t pt-4">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-colors duration-200
                       ${isLiked 
                         ? 'text-red-500 bg-red-50' 
                         : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <FiHeart className={isLiked ? 'fill-current' : ''} />
            <span>{post.likes + (isLiked ? 1 : 0)}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 px-3 py-1 rounded-full text-gray-500 hover:bg-gray-50 transition-colors duration-200"
          >
            <FiMessageSquare />
            <span>{post.comments.length}</span>
          </button>

          <button
            className="flex items-center space-x-2 px-3 py-1 rounded-full text-gray-500 hover:bg-gray-50 transition-colors duration-200"
          >
            <FiShare2 />
          </button>
        </div>

        {showComments && (
          <div className="mt-4 space-y-3 border-t pt-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-900">{comment.author}</p>
                <p className="text-gray-600 mt-1">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;