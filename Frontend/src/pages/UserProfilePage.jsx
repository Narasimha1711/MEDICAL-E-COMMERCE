

import React from 'react';
import UserProfile from '../Components/UserProfile';
import { useEffect } from 'react';
import { useUserDetailsQuery } from '../app/userApiSlice';
import { useState } from 'react';

const ProfilePage = () => {


  const { data, isError, isLoading, error } = useUserDetailsQuery()
  
  const [details, setDetails] = useState()

  useEffect(() => {
    if(data) {
      console.log(data)
      setDetails(data)
    }

  }, [data])


  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {details && <UserProfile user={details} />}
    </div>
  );
};

export default ProfilePage;








// import React from 'react';
// import UserProfileSection from '../Components/UserProfileSection';

// const mockUser = {
//   name: "John Doe",
//   email: "john.doe@example.com",
//   phone: "+1 (555) 123-4567",
//   address: "123 Main St, New York, NY 10001",
//   joinDate: "2023-01-15",
//   avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
// };

// function UserProfile() {
//   return (
//     <div>
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
//         <p className="text-gray-600">Manage your account settings</p>
//       </div>
//       <UserProfileSection user={mockUser} />
//     </div>
//   );
// }

// export default UserProfile;