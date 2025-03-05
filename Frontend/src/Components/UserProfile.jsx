import React, { useState } from 'react';
import { Pencil, Save, Mail, Calendar, Lock, X } from 'lucide-react';
import { format } from 'date-fns';
import { useUserUpdateMutation } from '../app/userApiSlice';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import NotificationToast from '../Components/NotificationToast';

const UserProfile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  console.log("thissfsdfi", editedUser)

  const [fun, { data, isError, error, isLoading }] = useUserUpdateMutation()


  useEffect(() => {
    if(data) {
      
      const id = toast.loading("Please wait...")


      console.log(data)

      if(data.message1 === 'Success') {

        toast.update(id, {
          render: "User Profile Successfully Updated!",
          type: "success",
          isLoading: false,
          autoClose: 1000, // Closes the toast after 3 seconds
        });
      }
    }

  }, [data])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordError('');
  };

  const handleSave = async() => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    await fun({data: editedUser, password: password});

    // console.log('Saving user:', { ...editedUser, password });
    // console.log("completed Editing")
    setIsEditing(false);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
    {/* <NotificationToast message={notificationMessage} type={type} /> */}
    {/* <NotificationToast message={notificationMessage} type={type} /> */}
      <div className="p-6 sm:p-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-black">User Profile</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-black hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-black rounded-full p-2"
            aria-label={isEditing ? "Cancel editing" : "Edit profile"}
          >
            {isEditing ? <X className="h-6 w-6" /> : <Pencil className="h-6 w-6" />}
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">{editedUser.username}</h3>
              <p className="text-gray-600 flex items-center mt-1">
                <Mail className="w-4 h-4 mr-2" /> {editedUser.email}
              </p>
            </div>
            <p className="text-gray-600 flex items-center">
              <Calendar className="w-4 h-4 mr-2" /> Member since: {format(new Date(editedUser.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                id="username"
                name="username"
                type="text"
                value={editedUser.username}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black disabled:bg-gray-100 transition duration-150 ease-in-out"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={editedUser.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black disabled:bg-gray-100 transition duration-150 ease-in-out"
              />
            </div>
            
            {isEditing && (
              <>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition duration-150 ease-in-out"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition duration-150 ease-in-out"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>
                {passwordError && <p className="text-red-500 text-sm mt-1 mb-4">{passwordError}</p>}
              </>
            )}
          </div>
        </div>
      </div>
      {isEditing && (
        <div className="px-6 sm:px-10 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors duration-300 ease-in-out flex items-center justify-center"
          >
            <Save className="w-5 h-5 mr-2" /> Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;









// import React, { useState } from 'react';
// import { Mail, Phone, MapPin, Camera } from 'lucide-react';

// const UserProfileSection = ({ user }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState(user);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submission
//     setIsEditing(false);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
//         <button
//           onClick={() => setIsEditing(!isEditing)}
//           className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
//         >
//           {isEditing ? 'Cancel' : 'Edit Profile'}
//         </button>
//       </div>

//       <div className="flex items-center mb-8">
//         <div className="relative">
//           <img
//             src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
//             alt="Profile"
//             className="w-24 h-24 rounded-full object-cover"
//           />
//           {isEditing && (
//             <button className="absolute bottom-0 right-0 p-1 bg-blue-500 rounded-full text-white hover:bg-blue-600">
//               <Camera className="w-4 h-4" />
//             </button>
//           )}
//         </div>
//         <div className="ml-6">
//           <h3 className="text-xl font-semibold">{user.name}</h3>
//           <p className="text-gray-600">Member since {new Date(user.joinDate).toLocaleDateString()}</p>
//         </div>
//       </div>

//       {isEditing ? (
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-2 gap-6">
//             <InputField
//               label="Full Name"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             />
//             <InputField
//               label="Email"
//               type="email"
//               value={formData.email}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//             />
//             <InputField
//               label="Phone"
//               value={formData.phone}
//               onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//             />
//             <InputField
//               label="Address"
//               value={formData.address}
//               onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Save Changes
//           </button>
//         </form>
//       ) : (
//         <div className="space-y-4">
//           <InfoItem icon={<Mail />} label="Email" value={user.email} />
//           <InfoItem icon={<Phone />} label="Phone" value={user.phone} />
//           <InfoItem icon={<MapPin />} label="Address" value={user.address} />
//         </div>
//       )}
//     </div>
//   );
// };

// const InputField = ({ label, type = "text", value, onChange }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//     <input
//       type={type}
//       value={value}
//       onChange={onChange}
//       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//     />
//   </div>
// );

// const InfoItem = ({ icon, label, value }) => (
//   <div className="flex items-center">
//     <span className="w-5 h-5 text-gray-500 mr-3">{icon}</span>
//     <div>
//       <p className="text-sm text-gray-500">{label}</p>
//       <p className="text-gray-900">{value}</p>
//     </div>
//   </div>
// );

// export default UserProfileSection;