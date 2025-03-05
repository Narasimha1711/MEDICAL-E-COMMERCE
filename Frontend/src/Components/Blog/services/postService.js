// Initial mock data
const initialPosts = [
  {
    id: '1',
    title: 'The Power of Morning Meditation',
    content: 'Start your day with 10 minutes of mindful meditation. Research shows that morning meditation can reduce stress, improve focus, and boost overall well-being. Here\'s how to create a perfect morning meditation routine: Find a quiet space, set a comfortable posture, focus on your breath, and let thoughts pass by without judgment...',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    },
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800',
    date: '2024-03-14T08:00:00.000Z',
    likes: 42,
    tags: ['meditation', 'mindfulness', 'morning-routine'],
    comments: [
      { id: 'c1', author: 'Mike Ross', content: 'This changed my morning routine completely!' },
      { id: 'c2', author: 'Emma Wilson', content: 'Great tips! I\'ve been meditating for a month now.' }
    ]
  },
  {
    id: '2',
    title: 'Colorful Superfood Smoothie Bowl Recipe',
    content: 'Transform your breakfast into a vibrant feast with this antioxidant-rich smoothie bowl. Blend frozen acai, mixed berries, banana, and almond milk for the base. Top with fresh fruits, chia seeds, coconut flakes, and a drizzle of honey. This nutrient-packed bowl will energize your morning and boost your immune system...',
    author: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    },
    image: 'https://images.unsplash.com/photo-1611574474484-ced6cb7acb82?w=800',
    date: '2024-03-13T09:30:00.000Z',
    likes: 56,
    tags: ['recipe', 'breakfast', 'healthy-eating'],
    comments: [
      { id: 'c3', author: 'Lisa Chen', content: 'Made this today - absolutely delicious!' },
      { id: 'c4', author: 'Tom Parker', content: 'Love the combination of flavors!' }
    ]
  },
  {
    id: '3',
    title: 'Yoga Flow for Energy and Flexibility',
    content: 'Discover this 20-minute energizing yoga sequence perfect for both beginners and intermediate practitioners. This flow combines sun salutations, warrior poses, and gentle backbends to increase flexibility and boost energy levels. Practice this sequence in the morning or whenever you need a natural energy boost...',
    author: {
      name: 'Maya Patel',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    date: '2024-03-12T10:15:00.000Z',
    likes: 38,
    tags: ['yoga', 'fitness', 'flexibility'],
    comments: [
      { id: 'c5', author: 'David Kim', content: 'Perfect for my morning routine!' }
    ]
  }
];

// Initialize localStorage with mock data if it's empty
const initializeStorage = () => {
  const storedPosts = localStorage.getItem('blog_posts');
  if (!storedPosts) {
    localStorage.setItem('blog_posts', JSON.stringify(initialPosts));
  }
};

// Initialize storage when the module loads
initializeStorage();

// Helper function to get posts from localStorage
const getStoredPosts = () => {
  const posts = localStorage.getItem('blog_posts');
  return posts ? JSON.parse(posts) : [];
};

// Helper function to save posts to localStorage
const savePostsToStorage = (posts) => {
  localStorage.setItem('blog_posts', JSON.stringify(posts));
};

export const getPosts = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return getStoredPosts();
};

export const createPost = async (postData) => {
  const newPost = {
    id: Date.now().toString(),
    ...postData,
    author: {
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150',
    },
    date: new Date().toISOString(),
    likes: 0,
    comments: [],
  };

  const posts = getStoredPosts();
  const updatedPosts = [newPost, ...posts];
  savePostsToStorage(updatedPosts);
  return newPost;
};

export const likePost = async (postId) => {
  const posts = getStoredPosts();
  const updatedPosts = posts.map(post =>
    post.id === postId
      ? { ...post, likes: post.likes + 1 }
      : post
  );
  savePostsToStorage(updatedPosts);
};

export const addComment = async (postId, comment) => {
  const posts = getStoredPosts();
  const updatedPosts = posts.map(post =>
    post.id === postId
      ? {
          ...post,
          comments: [
            ...post.comments,
            { id: Date.now().toString(), ...comment },
          ],
        }
      : post
  );
  savePostsToStorage(updatedPosts);
};