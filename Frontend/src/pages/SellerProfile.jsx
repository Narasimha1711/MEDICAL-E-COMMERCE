/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Lock, Store, Building2 } from "lucide-react";
import SellerSidebar from "../Components/SellerSidebar";
const API_URL = "http://localhost:5000/api/sellers";

const SellerProfile = () => {
  const [formData, setFormData] = useState({
    shopName: "",
    password: "",
    currentPassword: "",
    newPassword: "",
    location: "",
    gstin: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const loadProfile = async () => {
    try {
      // No need to manually get the token from localStorage since it's in cookies
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/givesellerdata`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Automatically includes cookies sent by the browser
      });

      if (!response.ok) {
        throw new Error("Failed to load profile");
      }

      const data = await response.json();
      const { shopName, location, gstin } = data;

      setFormData((prev) => ({
        ...prev,
        shopName: shopName || "",
        location: location || "",
        gstin: gstin || "",
      }));
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to load profile",
      });
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMessage({
        type: "error",
        text: "Geolocation is not supported by your browser",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          location: `${latitude}, ${longitude}`,
        }));
        setMessage({
          type: "success",
          text: "Location updated successfully!",
        });
      },
      (error) => {
        setMessage({
          type: "error",
          text: "Failed to fetch location: " + error.message,
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update profile details
      if (formData.shopName || formData.location || formData.gstin) {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/updatesellerprofile`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies with the request
            body: JSON.stringify({
              shopName: formData.shopName,
              location: formData.location,
              gstin: formData.gstin,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update profile details");
        }
      }

      // Update password if provided
      if (formData.currentPassword && formData.newPassword) {
        const passwordResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/updatepassword`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies with the request
            body: JSON.stringify({
              currentPassword: formData.currentPassword,
              newPassword: formData.newPassword,
            }),
          }
        );

        if (!passwordResponse.ok) {
          throw new Error("Failed to update password");
        }

        // Clear password fields after successful update
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
        }));
      }

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100">
        <SellerSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Edit Profile
            </h2>

            {message.text && (
              <div
                className={`mb-4 p-4 rounded-md ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shop Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Shop Name
                </label>
                <div className="mt-1 relative">
                  <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleInputChange}
                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* GSTIN Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  GSTIN Number
                </label>
                <div className="mt-1 relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleInputChange}
                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <div className="mt-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    readOnly
                  />
                </div>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Fetch Current Location
                </button>
              </div>

              {/* Password Update Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Update Password
                </h3>

                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SellerProfile;
