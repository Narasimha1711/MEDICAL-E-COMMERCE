import ContactForm from '../Components/Contact/ContactForm';
import ContactInfo from '../Components/Contact/ContactInfo';
import Map from '../Components/Contact/Map';
import { FaHeartbeat } from 'react-icons/fa';

function ContactUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FaHeartbeat className="text-4xl text-blue-600 mr-2" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Contact Us
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to providing 24/7 support for all your medicine delivery needs. 
            Reach out to us anytime, and we'll be happy to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <ContactForm />
          </div>
          
          <div className="space-y-8">
            <ContactInfo />
            <Map />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;