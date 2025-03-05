import { getPosts } from './postService';

export const getUserPosts = async () => {
  // For now, we'll reuse the posts from postService
  // In a real app, this would filter posts by user ID
  const allPosts = await getPosts();
  return allPosts;
};

export const updateProfile = async (profileData) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return profileData;
};