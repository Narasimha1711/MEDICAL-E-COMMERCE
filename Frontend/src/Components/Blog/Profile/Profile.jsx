import { useState } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfilePosts from './ProfilePosts';
import EditProfileModal from './EditProfileModal';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    bio: 'Health and wellness enthusiast, sharing tips for a better lifestyle.',
    avatar: 'https://via.placeholder.com/150',
  });

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProfileHeader
        profile={profile}
        onEdit={() => setIsEditing(true)}
      />
      <ProfilePosts />
      {isEditing && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditing(false)}
          onSave={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default Profile;