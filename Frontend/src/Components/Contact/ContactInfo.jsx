import { FaPhone, FaEnvelope, FaClock, FaComments, FaShieldAlt } from 'react-icons/fa';

const ContactInfo = () => {
  const iconClasses = "text-2xl text-blue-600";
  const containerClasses = "flex items-start space-x-4 p-4 rounded-lg hover:bg-blue-50 transition-colors duration-200";

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
      
      <div className="space-y-6">
        {/* Phone Support */}
        <div className={containerClasses}>
          <FaPhone className={iconClasses} />
          <div>
            <h3 className="font-semibold text-gray-800">Phone Support</h3>
            <p className="text-blue-600 font-medium">+91 98765 43210</p>
            <p className="text-sm text-gray-600">24/7 Emergency Support Available</p>
          </div>
        </div>

        {/* Email Support */}
        <div className={containerClasses}>
          <FaEnvelope className={iconClasses} />
          <div>
            <h3 className="font-semibold text-gray-800">Email</h3>
            <p className="text-blue-600 font-medium">support@meddelivery.in</p>
            <p className="text-sm text-gray-600">We typically respond within 24 hours</p>
          </div>
        </div>

        {/* Operating Hours */}
        <div className={containerClasses}>
          <FaClock className={iconClasses} />
          <div>
            <h3 className="font-semibold text-gray-800">Operating Hours</h3>
            <p className="text-gray-600">Monday - Friday: 9:00 AM - 9:00 PM</p>
            <p className="text-gray-600">Saturday - Sunday: 10:00 AM - 6:00 PM</p>
          </div>
        </div>

        {/* Live Chat */}
        <div className="mt-8">
          <button 
            onClick={() => alert('Live chat feature is under development!')}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-6 rounded-lg
                     hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                     transform transition-all duration-200 ease-in-out hover:scale-[1.02] flex items-center justify-center space-x-2"
          >
            <FaComments />
            <span>Start Live Chat</span>
          </button>
        </div>

        {/* Privacy Assurance */}
        <div className="mt-6 flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
          <FaShieldAlt className="text-blue-600 text-xl flex-shrink-0 mt-1" />
          <p className="text-sm text-gray-600">
            Your privacy is our priority. All information shared will remain confidential and be used solely for addressing your concerns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
