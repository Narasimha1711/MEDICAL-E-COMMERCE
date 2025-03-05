import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';

const ContactForm = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    purpose: '',
    message: '',
  });

  // State for errors and submission
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Regex for validation
  const validations = {
    name: /^[a-zA-Z\s]{1,50}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[0-9]{10}$/,
    message: /^.{10,}$/, // At least 10 characters
  };

  const purposes = [
    'Order Inquiry',
    'Delivery Issue',
    'Prescription Assistance',
    'Feedback',
    'Complaint',
    'Other',
  ];

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate the form fields
  const validateForm = () => {
    const newErrors = {};
    if (!validations.name.test(formData.name)) {
      newErrors.name = 'Name must only contain letters and spaces.';
    }
    if (!validations.email.test(formData.email)) {
      newErrors.email = 'Invalid email address.';
    }
    if (formData.phone && !validations.phone.test(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits.';
    }
    if (!formData.subject) {
      newErrors.subject = 'Subject is required.';
    }
    if (!formData.purpose) {
      newErrors.purpose = 'Purpose is required.';
    }
    if (!validations.message.test(formData.message)) {
      newErrors.message = 'Message must be at least 10 characters long.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Form is valid if no errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:9001/contact', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert(response.data.message || 'Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        purpose: '',
        message: '',
      });
      setErrors({});
    } catch (error) {
      alert(
        error.response?.data?.message || 'An error occurred while sending the message. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // CSS Classes
  const inputClasses =
    'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out';
  const labelClasses = 'block text-gray-700 font-medium mb-2';
  const errorClasses = 'text-red-500 text-sm mt-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Name *</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={inputClasses}
            placeholder="John Doe"
          />
          {errors.name && <p className={errorClasses}>{errors.name}</p>}
        </div>

        <div>
          <label className={labelClasses}>Email *</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClasses}
            placeholder="johndoe@example.com"
          />
          {errors.email && <p className={errorClasses}>{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Phone Number</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClasses}
            placeholder="9876543210"
          />
          {errors.phone && <p className={errorClasses}>{errors.phone}</p>}
        </div>

        <div>
          <label className={labelClasses}>Purpose *</label>
          <select
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="">Select a purpose</option>
            {purposes.map((purpose) => (
              <option key={purpose} value={purpose}>
                {purpose}
              </option>
            ))}
          </select>
          {errors.purpose && <p className={errorClasses}>{errors.purpose}</p>}
        </div>
      </div>

      <div>
        <label className={labelClasses}>Subject *</label>
        <input
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={inputClasses}
          placeholder="How can we assist you?"
        />
        {errors.subject && <p className={errorClasses}>{errors.subject}</p>}
      </div>

      <div>
        <label className={labelClasses}>Message *</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className={`${inputClasses} h-32 resize-none`}
          placeholder="Please describe your inquiry in detail..."
        />
        {errors.message && <p className={errorClasses}>{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg 
                 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                 transform transition-all duration-200 ease-in-out hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed
                 flex items-center justify-center space-x-2"
      >
        <FaPaperPlane className={isSubmitting ? 'animate-bounce' : ''} />
        <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
      </button>
    </form>
  );
};

export default ContactForm;
