import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { createPost } from '../../services/postService';
import axios from 'axios';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    author: {
      name: '',
      avatar: ''
    },
    tags: [],
    date: new Date().toISOString()
  });
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:9001/createPost', formData);
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      setLoading(false);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 focus:ring-1 focus:ring-offset-0 focus:ring-green-500 transition-all duration-200"
            required
            placeholder="Enter post title"
            minLength="3"
            maxLength="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 focus:ring-1 focus:ring-offset-0 focus:ring-green-500 transition-all duration-200 resize-none"
            required
            placeholder="Write your post content here..."
            minLength="10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Author Information
          </label>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Author Name
              </label>
              <input
                type="text"
                value={formData.author.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    author: { ...formData.author, name: e.target.value }
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 focus:ring-1 focus:ring-offset-0 focus:ring-green-500 transition-all duration-200"
                required
                placeholder="Enter your name"
                minLength="2"
                maxLength="50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Author Avatar URL
              </label>
              <input
                type="url"
                value={formData.author.avatar}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    author: { ...formData.author, avatar: e.target.value }
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 focus:ring-1 focus:ring-offset-0 focus:ring-green-500 transition-all duration-200"
                required
                placeholder="Enter your avatar URL"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Featured Image
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <input
              type="url"
              value={formData.image}
              onChange={(e) => {
                setFormData({ ...formData, image: e.target.value });
                setImagePreview(e.target.value);
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 focus:ring-1 focus:ring-offset-0 focus:ring-green-500 transition-all duration-200"
              placeholder="Enter image URL (optional)"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInput}
            placeholder="Press Enter to add tags"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 focus:ring-1 focus:ring-offset-0 focus:ring-green-500 transition-all duration-200"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200`}
        >
          {loading ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;