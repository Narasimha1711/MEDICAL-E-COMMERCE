/* eslint-disable no-unused-vars */
import "./SellerSignup.css"; 
import DELIVERY_MEDICINE from "../assets/DeliveryMedicine.gif";
import { FaLock } from "react-icons/fa";
import { IoMdMailOpen } from "react-icons/io";
import { GiShop } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import GST from "../assets/gst.png";
import React, { useState } from "react";

export default function SellerSignup() {
  const [loading, setLoading] = useState(false); // Loading state
  const [location, setLocation] = useState([]); 
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setpassword] = useState('');
  const [shopName, setshopName] = useState('');
  const [gstin, setgstin] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/sellerSignup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, shopName, password, location, gstin }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      console.log(await response.json());
      navigate('/sellerLogin');
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  const getUserLocation = (e) => {
    e.preventDefault(); // Prevent form submission
    setLoading(true); // Set loading to true when button is clicked

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation([latitude, longitude]);
          setLoading(false); // Stop loading once location is retrieved
          console.log(`User Location: Latitude: ${latitude}, Longitude: ${longitude}`);
        },
        (error) => {
          setLoading(false); // Stop loading on error
          console.error("Error getting user location:", error.message);
        }
      );
    } else {
      setLoading(false); // Stop loading if geolocation is not supported
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div>
      <div className="back-ground-image">
        <img
          src={DELIVERY_MEDICINE}
          alt="back-ground-image"
          className="img-background"
        />
      </div>
      <div className="leftBox">
        <div className="wrapper1">
          <form onSubmit={onSubmit} action="POST">
            <h1>Signup</h1>
            <div className="input-box1">
              <input type="email" name="email" placeholder="Email" required value={email} onChange={(e) => { setEmail(e.target.value) }} />
              <IoMdMailOpen className="icon1" />
            </div>
            <div className="input-box1">
              <input
                type="text"
                name="shopname"
                placeholder="Shop Name"
                required
                value={shopName}
                onChange={(e) => { setshopName(e.target.value) }}
              />
              <GiShop className="icon1" />
            </div>
            <div className="input-box1">
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => { setpassword(e.target.value) }}
              />
              <FaLock className="icon1" />
            </div>
            <div className="input-box1">
              <input type="text" name="gstin" placeholder="GSTIN" required value={gstin} onChange={(e) => { setgstin(e.target.value) }} />
              <img src={GST} alt="gst" className="icon1gst" />
            </div>

            <button
              className="submit1-locate-me"
              onClick={getUserLocation}
            >
              Locate Me
            </button>
            <button type="submit" className="submit">
              Sign Up
            </button>

            <div style={{ color: 'red', marginLeft: '50rem', fontWeight: '800', position: 'relative', top: '8rem', left: '12rem' }}>
              {error}
            </div>

            <div className="register-link1">
              <p>
                Already Having an Account ?
                <Link to="/sellerLogin">
                  <span> Login </span>
                </Link>
              </p>
            </div>

            {/* Show loading message in case the location is being fetched */}
            {loading && <p>Fetching your location...</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

